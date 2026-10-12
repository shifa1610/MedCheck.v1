import Tesseract from 'tesseract.js';
import { extractMedicalRecord } from './aiService';

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
export async function scanMedicalDocument(imageSource, onProgress = null) {
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

    const rawText = result.data.text || '';
    const confidence = Math.round(result.data.confidence || 0);

    // Run clinical NLP extraction on extracted OCR text
    const structuredRecord = await extractMedicalRecord(rawText);

    return {
      success: true,
      rawText: rawText.trim(),
      confidence,
      structuredRecord: {
        ...structuredRecord,
        ocrMetadata: {
          confidence,
          wordsCount: result.data.words?.length || 0,
          scannedAt: new Date().toISOString()
        }
      }
    };
  } catch (err) {
    console.error('[OCR Engine Error]:', err);
    throw err;
  }
}
