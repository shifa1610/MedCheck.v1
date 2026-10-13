import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function getTextConfidence(annotation) {
  const confidences = (annotation?.pages || [])
    .flatMap(page => page.blocks || [])
    .flatMap(block => block.paragraphs || [])
    .flatMap(paragraph => paragraph.words || [])
    .map(word => word.confidence)
    .filter(value => Number.isFinite(value));

  if (!confidences.length) return 0;
  return Math.round(confidences.reduce((total, value) => total + value, 0) / confidences.length * 100);
}

router.use(requireAuth);

router.post('/handwriting', async (req, res) => {
  const { image, mimeType } = req.body || {};
  if (typeof image !== 'string' || !image || typeof mimeType !== 'string' || !ALLOWED_MIME_TYPES.has(mimeType)) {
    return res.status(400).json({ error: 'Provide a JPEG, PNG, or WebP image for handwriting recognition.' });
  }
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(image)) {
    return res.status(400).json({ error: 'The image data is invalid.' });
  }

  const imageBuffer = Buffer.from(image, 'base64');
  if (!imageBuffer.length || imageBuffer.length > MAX_IMAGE_BYTES || imageBuffer.toString('base64') !== image) {
    return res.status(413).json({ error: 'Image must be valid and no larger than 15 MB.' });
  }

  const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Cloud handwriting recognition is not configured on this server.' });
  }

  let visionResponse;
  try {
    visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: image },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION' }]
          }]
        })
      }
    );
  } catch (error) {
    console.error('[MedCheck] Cloud handwriting recognition request failed:', error.message);
    return res.status(502).json({ error: 'Cloud handwriting recognition is unavailable. Please try again.' });
  }

  if (!visionResponse.ok) {
    console.error(`[MedCheck] Cloud handwriting recognition returned HTTP ${visionResponse.status}.`);
    return res.status(502).json({ error: 'Cloud handwriting recognition failed. Please check the image and try again.' });
  }

  let visionResult;
  try {
    visionResult = await visionResponse.json();
  } catch (error) {
    console.error('[MedCheck] Cloud handwriting recognition returned an invalid response:', error.message);
    return res.status(502).json({ error: 'Cloud handwriting recognition returned an invalid response.' });
  }

  const annotation = visionResult.responses?.[0]?.fullTextAnnotation;
  if (visionResult.responses?.[0]?.error || !annotation?.text?.trim()) {
    return res.status(422).json({ error: 'No readable handwriting was found. Try a sharper, well-lit image.' });
  }

  return res.json({
    text: annotation.text.trim(),
    confidence: getTextConfidence(annotation)
  });
});

export default router;
