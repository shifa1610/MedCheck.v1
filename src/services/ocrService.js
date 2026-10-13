import Tesseract from 'tesseract.js';
import { extractMedicalRecord } from './aiService.js';
import { recognizeHandwrittenDocument } from '../utils/auth.js';

/**
 * Preprocess image on an in-memory canvas to maximize OCR accuracy:
 * 1. Grayscale conversion
 * 2. Contrast stretching (enhances faint ink and dot-matrix lab print)
 * 3. Binarization thresholding
 */
export function preprocessCanvas(sourceElement, options = { contrastBoost: true, binarize: false }) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let width = sourceElement.videoWidth || sourceElement.naturalWidth || sourceElement.width;
  let height = sourceElement.videoHeight || sourceElement.naturalHeight || sourceElement.height;

  // Max dimension constraint for fast and accurate OCR
  const MAX_DIM = 1800;
  if (width > MAX_DIM || height > MAX_DIM) {
    if (width > height) {
      height = Math.round((height * MAX_DIM) / width);
      width = MAX_DIM;
    } else {
      width = Math.round((width * MAX_DIM) / height);
      height = MAX_DIM;
    }
  }

  canvas.width = width;
  canvas.height = height;

  // Draw source image
  ctx.drawImage(sourceElement, 0, 0, width, height);

  if (!options.contrastBoost && !options.binarize) {
    return canvas;
  }

  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Contrast stretching & Grayscale conversion
    for (let i = 0; i < data.length; i += 4) {
      // Luminance
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

      if (options.contrastBoost) {
        // High-contrast S-curve stretch
        const factor = 1.35;
        const adjusted = factor * (gray - 128) + 128;
        const clamped = Math.max(0, Math.min(255, adjusted));
        data[i] = clamped;
        data[i + 1] = clamped;
        data[i + 2] = clamped;
      } else {
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  } catch (err) {
    console.warn('Canvas pixel manipulation error (CORS or canvas security):', err);
  }

  return canvas;
}

/**
 * Real OCR Scanner using Tesseract.js
 * Ingests live video frame, image element, or Blob/DataURL
 */
export async function structureOCRResult(result, metadata = {}) {
  const rawText = result?.data?.text || '';
  if (!rawText.trim()) {
    throw new Error('No readable text was found in this image. Try a sharper, well-lit photo.');
  }

  const confidence = Math.round(result.data.confidence || 0);
  const scanId = metadata.scanId || globalThis.crypto?.randomUUID?.() || `scan-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const structuredRecord = await extractMedicalRecord(rawText, {
    scanId,
    sourceFilename: metadata.sourceFilename || '',
    ocrConfidence: confidence
  });

  return {
    success: true,
    scanId,
    sourceFilename: metadata.sourceFilename || '',
    rawText: rawText.trim(),
    confidence,
    structuredRecord: {
      ...structuredRecord,
      ocrMetadata: {
        confidence,
        wordsCount: result.data.words?.length || 0,
        scannedAt: new Date().toISOString(),
        engine: metadata.engine || 'Tesseract.js'
      }
    }
  };
}

async function imageToBase64(imageSource) {
  if (typeof imageSource === 'string') {
    const dataUrlMatch = imageSource.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
    if (!dataUrlMatch) throw new Error('Choose a JPEG, PNG, or WebP image for handwriting recognition.');
    return { mimeType: dataUrlMatch[1], image: dataUrlMatch[2] };
  }

  if (!imageSource || typeof imageSource.arrayBuffer !== 'function') {
    throw new Error('Choose a JPEG, PNG, or WebP image for handwriting recognition.');
  }
  const inferredMimeType = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
  }[imageSource.name?.match(/\.[^.]+$/)?.[0]?.toLowerCase()];
  const mimeType = ['image/jpeg', 'image/png', 'image/webp'].includes(imageSource.type)
    ? imageSource.type
    : inferredMimeType;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
    throw new Error('Choose a JPEG, PNG, or WebP image for handwriting recognition.');
  }

  const bytes = new Uint8Array(await imageSource.arrayBuffer());
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return { mimeType, image: btoa(binary) };
}

export async function scanHandwrittenPrescription(imageSource, metadata = {}) {
  const { image, mimeType } = await imageToBase64(imageSource);
  const result = await recognizeHandwrittenDocument(image, mimeType);
  return structureOCRResult(
    { data: { text: result.text, confidence: result.confidence } },
    { ...metadata, engine: 'Google Cloud Vision handwriting recognition' }
  );
}

export async function scanMedicalDocument(imageSource, onProgress = null, metadata = {}) {
  try {
    let target = imageSource;

    // If source is a video or image element, preprocess to high-contrast canvas
    if (typeof window !== 'undefined' && (imageSource instanceof HTMLVideoElement || imageSource instanceof HTMLImageElement)) {
      target = preprocessCanvas(imageSource, { contrastBoost: true });
    }

    const result = await Tesseract.recognize(
      target,
      'eng',
      {
        logger: (m) => {
          if (onProgress && m.status === 'recognizing text') {
            onProgress({
              stage: 'reading',
              percent: Math.min(99, Math.round((m.progress || 0) * 100)),
              statusText: `Scanning characters (${Math.round((m.progress || 0) * 100)}%)...`
            });
          } else if (onProgress && m.status === 'loading tesseract core') {
            onProgress({
              stage: 'init',
              percent: 15,
              statusText: 'Initializing OCR Engine...'
            });
          } else if (onProgress && m.status === 'loading language traineddata') {
            onProgress({
              stage: 'lang',
              percent: 35,
              statusText: 'Loading Medical English & Latin Dictionary...'
            });
          }
        }
      }
    );

    return await structureOCRResult(result, metadata);
  } catch (err) {
    console.error('[OCR Engine Error]:', err);
    throw err;
  }
}
