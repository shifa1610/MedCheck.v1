import Tesseract from 'tesseract.js';
import { extractMedicalRecord } from './aiService.js';
import { recognizeHandwrittenDocument } from '../utils/auth.js';

/**
 * Preprocess image on an in-memory canvas to maximize OCR accuracy:
 * 1. Proportional scaling (constrain oversized 48MP photos; upscale low-res crops)
 * 2. Grayscale luminance conversion (Rec. 601)
 * 3. Adaptive percentile histogram contrast stretching (eliminates paper yellowing/shadows)
 * 4. High-contrast S-curve boost (deepens ballpoint ink, whites out background)
 * 5. High-pass edge sharpening (makes faint doctor handwriting and tiny print legible)
 */
export function preprocessCanvas(sourceElement, options = { contrastBoost: true, sharpen: true }) {
  if (typeof document === 'undefined' || !sourceElement) return sourceElement;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return sourceElement;

  let width = sourceElement.videoWidth || sourceElement.naturalWidth || sourceElement.width || 800;
  let height = sourceElement.videoHeight || sourceElement.naturalHeight || sourceElement.height || 600;

  // Max dimension constraint for fast and accurate OCR (optimal glyph height ~30-40px)
  const MAX_DIM = 1800;
  const MIN_DIM = 1000;

  if (width > MAX_DIM || height > MAX_DIM) {
    if (width > height) {
      height = Math.round((height * MAX_DIM) / width);
      width = MAX_DIM;
    } else {
      width = Math.round((width * MAX_DIM) / height);
      height = MAX_DIM;
    }
  } else if (Math.max(width, height) < MIN_DIM && width > 0 && height > 0) {
    // Upscale small or cropped prescription sections so character strokes are thick enough
    const scale = MIN_DIM / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  canvas.width = width;
  canvas.height = height;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw source image onto canvas
  ctx.drawImage(sourceElement, 0, 0, width, height);

  if (!options.contrastBoost) {
    return canvas;
  }

  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const len = data.length;

    // Step 1: Compute luminance histogram (256 bins)
    const hist = new Uint32Array(256);
    const grays = new Uint8ClampedArray(len / 4);

    for (let i = 0, p = 0; i < len; i += 4, p++) {
      const g = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      grays[p] = g;
      hist[g]++;
    }

    // Step 2: Adaptive percentile bounds (eliminate dark shadow borders and bright paper cast)
    const totalPixels = len / 4;
    const pLowCount = totalPixels * 0.02; // 2nd percentile (ink baseline)
    const pHighCount = totalPixels * 0.96; // 96th percentile (paper baseline)

    let acc = 0;
    let minL = 0;
    let maxL = 255;

    for (let b = 0; b < 256; b++) {
      acc += hist[b];
      if (acc >= pLowCount && minL === 0) {
        minL = b;
      }
      if (acc >= pHighCount) {
        maxL = b;
        break;
      }
    }

    const range = Math.max(25, maxL - minL);

    // Step 3: Contrast stretch + S-curve ink enhancement
    for (let i = 0, p = 0; i < len; i += 4, p++) {
      const g = grays[p];
      // Normalize between [0, 255]
      let norm = ((g - minL) / range) * 255;
      norm = Math.max(0, Math.min(255, norm));

      // S-curve contrast boost:
      // Darken values below 135 (boost faint ink strokes)
      // Brighten values above 135 (clean yellowish/gray paper to white)
      let finalVal;
      if (norm < 135) {
        finalVal = Math.pow(norm / 135, 1.3) * 115;
      } else {
        finalVal = 135 + Math.pow((norm - 135) / 120, 0.85) * 120;
      }

      finalVal = Math.max(0, Math.min(255, Math.round(finalVal)));

      data[i] = finalVal;
      data[i + 1] = finalVal;
      data[i + 2] = finalVal;
    }

    ctx.putImageData(imgData, 0, 0);

    // Step 4: Edge sharpening convolution (crisp up handwriting loops and small numbers)
    if (options.sharpen && width > 400 && height > 400) {
      const sharpData = ctx.getImageData(0, 0, width, height);
      const src = imgData.data;
      const dst = sharpData.data;
      const w = width;

      // 3x3 mild unsharp sharpening kernel: [0, -0.2, 0; -0.2, 1.8, -0.2; 0, -0.2, 0]
      for (let y = 1; y < height - 1; y++) {
        const row = y * w;
        for (let x = 1; x < w - 1; x++) {
          const idx = (row + x) * 4;
          const up = (row - w + x) * 4;
          const down = (row + w + x) * 4;
          const left = (row + x - 1) * 4;
          const right = (row + x + 1) * 4;

          const sharp = 1.8 * src[idx] - 0.2 * (src[up] + src[down] + src[left] + src[right]);
          const clamped = Math.max(0, Math.min(255, Math.round(sharp)));

          dst[idx] = clamped;
          dst[idx + 1] = clamped;
          dst[idx + 2] = clamped;
        }
      }
      ctx.putImageData(sharpData, 0, 0);
    }
  } catch (err) {
    console.warn('Canvas pixel manipulation error:', err);
  }

  return canvas;
}

/**
 * Real OCR Scanner using Tesseract.js
 * Ingests live video frame, image element, Blob/File, or DataURL
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

    // Convert any input source (File, Blob, DataURL, image, video) to a preprocessed canvas
    if (typeof window !== 'undefined' && imageSource) {
      try {
        const drawable = await toDrawableSource(imageSource);
        target = preprocessCanvas(drawable, { contrastBoost: true, sharpen: true });
      } catch (prepErr) {
        console.warn('[OCR Engine Warning]: Could not preprocess image canvas, falling back to raw source:', prepErr);
        target = imageSource;
      }
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
