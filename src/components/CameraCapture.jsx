import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  RefreshCw, 
  RotateCcw, 
  Check, 
  X, 
  Sparkles, 
  Sliders, 
  AlertTriangle,
  FileText,
  Zap,
  SwitchCamera
} from 'lucide-react';
import { scanMedicalDocument, preprocessCanvas } from '../services/ocrService';

export default function CameraCapture({ onDocumentExtracted, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' for rear, 'user' for front
  const [capturedImage, setCapturedImage] = useState(null);
  const [contrastBoost, setContrastBoost] = useState(true);
  
  // OCR processing state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('');
  const [extractedResult, setExtractedResult] = useState(null);

  // Initialize camera stream
  const startCamera = async (mode = facingMode) => {
    try {
      setCameraError(null);

      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      let newStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        // Fallback without strict facingMode (e.g. laptop webcam)
        newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. Please check browser camera permissions or upload an image file instead.');
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  // Flip between front and rear cameras
  const handleSwitchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture snapshot from video stream
  const handleSnap = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);

    // Stop camera video to save power
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedResult(null);
    setIsScanning(false);
    startCamera(facingMode);
  };

  // Run real OCR on the captured snapshot
  const handleRunOCR = async () => {
    if (!capturedImage) return;

    setIsScanning(true);
    setScanProgress(5);
    setScanStatusText('Initializing Optical Character Recognition...');

    try {
      const img = new Image();
      img.src = capturedImage;
      await new Promise(resolve => { img.onload = resolve; });

      // Apply contrast filter if requested
      const processed = preprocessCanvas(img, { contrastBoost });

      const result = await scanMedicalDocument(processed, ({ percent, statusText }) => {
        setScanProgress(percent);
        setScanStatusText(statusText);
      });

      setExtractedResult(result);
      setIsScanning(false);
    } catch (err) {
      console.error('OCR processing failure:', err);
      setIsScanning(false);
      alert('Unable to read text from this photo. Please retake with better lighting and closer framing.');
    }
  };

  // Accept and save extracted record
  const handleConfirmRecord = () => {
    if (extractedResult && extractedResult.structuredRecord) {
      onDocumentExtracted(extractedResult.structuredRecord);
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      {cameraError ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
          <h4 className="text-sm font-bold text-rose-900">Camera Access Issue</h4>
          <p className="text-xs text-rose-700 leading-relaxed max-w-md mx-auto">
            {cameraError}
          </p>
          <div className="pt-2">
            <button
              onClick={() => startCamera(facingMode)}
              className="text-xs font-semibold px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors shadow-xs"
            >
              Retry Camera Permission
            </button>
          </div>
        </div>
      ) : !capturedImage ? (
        /* LIVE VIEWFINDER SCREEN */
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 sm:aspect-16/10 flex items-center justify-center border-2 border-teal-500/50 shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Document Framing Reticle */}
            <div className="absolute inset-6 sm:inset-10 border-2 border-dashed border-teal-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between">
                <span className="w-4 h-4 border-t-4 border-l-4 border-teal-400" />
                <span className="w-4 h-4 border-t-4 border-r-4 border-teal-400" />
              </div>
              <div className="text-center">
                <span className="bg-black/60 backdrop-blur-xs text-teal-300 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Align Prescription or Lab Report Here
                </span>
              </div>
              <div className="flex justify-between">
                <span className="w-4 h-4 border-b-4 border-l-4 border-teal-400" />
                <span className="w-4 h-4 border-b-4 border-r-4 border-teal-400" />
              </div>
            </div>

            {/* Live Camera Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE VIEWFINDER</span>
            </div>

            {/* Camera Switcher Button */}
            <button
              onClick={handleSwitchCamera}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white flex items-center justify-center transition-colors"
              title="Switch Camera (Front/Rear)"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
          </div>

          {/* Shutter Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Hold steady under good lighting for clear OCR</span>
            </div>

            <button
              onClick={handleSnap}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-teal-600/25 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Snap Photo</span>
            </button>
          </div>
        </div>
      ) : (
        /* CAPTURED PREVIEW & REAL OCR SCANNING SCREEN */
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 aspect-4/3 sm:aspect-16/10 flex items-center justify-center">
            <img 
              src={capturedImage} 
              alt="Captured document" 
              className={`w-full h-full object-contain ${contrastBoost ? 'contrast-125 brightness-105' : ''}`}
            />

            {isScanning && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400 text-teal-400 flex items-center justify-center animate-spin">
                  <RefreshCw className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{scanStatusText}</h4>
                  <p className="text-xs text-slate-300">
                    Extracting doctor handwriting, drug strengths, and lab values
                  </p>
                </div>
                <div className="w-56 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full transition-all duration-200"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          {!isScanning && !extractedResult && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={contrastBoost}
                  onChange={(e) => setContrastBoost(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <Sliders className="w-3.5 h-3.5 text-teal-600" />
                <span>Enhance Ink Contrast (Faint Handwriting)</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>

                <button
                  onClick={handleRunOCR}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Run OCR Analysis</span>
                </button>
              </div>
            </div>
          )}

          {/* OCR RESULTS PREVIEW */}
          {extractedResult && (
            <div className="space-y-3 bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>OCR Extraction Complete ({extractedResult.confidence}% confidence)</span>
                </div>
                <button
                  onClick={handleRetake}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline"
                >
                  Retake Photo
                </button>
              </div>

              {/* Extracted text snippet */}
              <div className="p-3 bg-white rounded-xl border border-emerald-200/80 text-xs text-slate-700 max-h-32 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed">
                {extractedResult.rawText || "No readable text found in this framing."}
              </div>

              {/* Clinical summary preview */}
              <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Detected Clinical Entities:</div>
                <div className="flex flex-wrap gap-1.5">
                  {extractedResult.structuredRecord.medications?.map((m, i) => (
                    <span key={i} className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Rx: {m.name} ({m.dosage})
                    </span>
                  ))}
                  {extractedResult.structuredRecord.biomarkers?.map((b, i) => (
                    <span key={i} className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Lab: {b.name} = {b.value} {b.unit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleConfirmRecord}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  <span>Save to Patient Timeline & Summary</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
