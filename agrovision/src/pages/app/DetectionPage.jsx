import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Upload,
  X,
  ScanLine,
  ChevronDown,
  AlertCircle,
  Sparkles,
  Cpu,
} from 'lucide-react';

import Button from '../../components/ui/Button';
import { analyzeImage } from '../../services/detectionService';
import { useToast } from '../../hooks/useToast';


// ============================================================
// SUPPORTED CROPS
// ============================================================

const SUPPORTED_CROPS = [
  'Tomato',
  'Potato',
  'Pepper',
];


// ============================================================
// ANALYSIS PHASES
// ============================================================

const PHASES = [
  'Preparing leaf image...',
  'Extracting visual features...',
  'Classifying crop disease...',
  'Preparing diagnostic result...',
];


export default function DetectionPage() {

  const navigate = useNavigate();
  const { addToast } = useToast();

  const fileInputRef = useRef(null);


  // ==========================================================
  // STATE
  // ==========================================================

  const [selectedCrop, setSelectedCrop] = useState('');

  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);

  const [isDragging, setIsDragging] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);

  const [analysisPhase, setAnalysisPhase] = useState(0);

  const [progressPercent, setProgressPercent] = useState(0);

  const [error, setError] = useState('');


  // ==========================================================
  // IMAGE SELECTION
  // ==========================================================

  const handleImageSelect = (file) => {

    if (!file) {
      return;
    }


    // --------------------------------------------------------
    // File type
    // --------------------------------------------------------

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];


    if (!allowedTypes.includes(file.type)) {

      setError(
        'Please upload a valid JPG, PNG, or WEBP image.'
      );

      setImageFile(null);
      setImagePreview(null);

      return;
    }


    // --------------------------------------------------------
    // File size
    // --------------------------------------------------------

    if (file.size > 12 * 1024 * 1024) {

      setError(
        'Image file size must be less than 12MB.'
      );

      setImageFile(null);
      setImagePreview(null);

      return;
    }


    // --------------------------------------------------------
    // Valid image
    // --------------------------------------------------------

    setError('');

    setImageFile(file);


    const reader = new FileReader();

    reader.onload = (event) => {

      setImagePreview(
        event.target?.result || null
      );

    };

    reader.readAsDataURL(file);
  };


  // ==========================================================
  // DRAG & DROP
  // ==========================================================

  const handleDragOver = (event) => {

    event.preventDefault();

    setIsDragging(true);
  };


  const handleDragLeave = () => {

    setIsDragging(false);
  };


  const handleDrop = (event) => {

    event.preventDefault();

    setIsDragging(false);

    const file =
      event.dataTransfer?.files?.[0];

    if (file) {
      handleImageSelect(file);
    }
  };


  // ==========================================================
  // ANALYZE IMAGE
  // ==========================================================

  const handleAnalyze = async () => {

    // --------------------------------------------------------
    // Validate crop
    // --------------------------------------------------------

    if (
      !SUPPORTED_CROPS.includes(
        selectedCrop
      )
    ) {

      setError(
        'Please select Tomato, Potato, or Pepper.'
      );

      return;
    }


    // --------------------------------------------------------
    // Validate actual file
    // --------------------------------------------------------

    if (!imageFile) {

      setError(
        'Please upload a real crop leaf image.'
      );

      return;
    }


    // --------------------------------------------------------
    // Start analysis
    // --------------------------------------------------------

    setError('');

    setAnalyzing(true);

    setProgressPercent(10);

    setAnalysisPhase(0);


    // --------------------------------------------------------
    // Visual progress animation
    // --------------------------------------------------------

    const interval = setInterval(() => {

      setProgressPercent((previous) => {

        if (previous >= 85) {

          return previous;
        }

        const next =
          previous + 15;

        if (next >= 65) {

          setAnalysisPhase(2);

        } else if (next >= 35) {

          setAnalysisPhase(1);

        }

        return next;

      });

    }, 300);


    try {

      // ------------------------------------------------------
      // REAL API CALL
      // ------------------------------------------------------

      const result = await analyzeImage(
        imageFile,
        selectedCrop
      );


      clearInterval(interval);


      // ------------------------------------------------------
      // Complete progress
      // ------------------------------------------------------

      setProgressPercent(100);

      setAnalysisPhase(3);


      // ------------------------------------------------------
      // Show warning if model is uncertain
      // ------------------------------------------------------

      if (result.warning) {

        addToast(
          result.warning,
          'warning'
        );
      }


      // ------------------------------------------------------
      // Store result
      // ------------------------------------------------------

      sessionStorage.setItem(
        'agrovision_result',
        JSON.stringify({

          ...result,

          imagePreview,
        })
      );


      // ------------------------------------------------------
      // Navigate to result page
      // ------------------------------------------------------

      setTimeout(() => {

        navigate('/result');

      }, 500);


    } catch (err) {

      clearInterval(interval);

      setAnalyzing(false);

      setProgressPercent(0);

      setAnalysisPhase(0);


      const message =
        err?.message ||
        'Unable to complete disease detection.';


      setError(message);


      addToast(
        message,
        'error'
      );
    }
  };


  // ==========================================================
  // REMOVE IMAGE
  // ==========================================================

  const removeImage = () => {

    setImageFile(null);

    setImagePreview(null);

    setError('');

    if (fileInputRef.current) {

      fileInputRef.current.value = '';

    }
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto animate-fade-in">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="text-center max-w-xl mx-auto mb-8">

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">

          <Sparkles
            size={13}
            className="text-emerald-600"
          />

          <span>
            AI Disease Detection
          </span>

        </div>


        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">

          Crop Disease Diagnosis

        </h1>


        <p className="text-sm text-gray-500 mt-2">

          Upload a clear photograph of a
          Tomato, Potato, or Pepper leaf
          to receive a preliminary disease
          classification.

        </p>

      </div>


      {/* ======================================================
          ANALYZING SCREEN
      ====================================================== */}

      {analyzing ? (

        <div className="glass-card p-8 sm:p-12 bg-white rounded-3xl border border-emerald-200 shadow-card-lg text-center relative overflow-hidden">

          <div className="max-w-md mx-auto space-y-6">


            {/* IMAGE */}

            <div className="relative w-44 h-44 mx-auto rounded-2xl overflow-hidden bg-gray-950 border-2 border-emerald-500 shadow-glow">

              {imagePreview && (

                <img
                  src={imagePreview}
                  alt="Scanning leaf"
                  className="w-full h-full object-cover opacity-80"
                />

              )}


              <div
                className="
                  laser-scan-line
                  absolute
                  left-0
                  right-0
                  h-1
                  scanner-line
                  z-20
                "
              />


              <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500/80 rounded text-[10px] font-mono text-white font-bold">

                SCANNING

              </div>

            </div>


            {/* PROGRESS */}

            <div>

              <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">

                <span>
                  Neural Inference Pipeline
                </span>

                <span className="font-mono text-emerald-600">

                  {progressPercent}%

                </span>

              </div>


              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">

                <div
                  className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{
                    width:
                      `${progressPercent}%`,
                  }}
                />

              </div>

            </div>


            {/* CURRENT PHASE */}

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-2 text-xs font-mono text-gray-700">

              <Cpu
                size={15}
                className="text-brand-600 animate-spin"
              />

              <span>
                {PHASES[analysisPhase]}
              </span>

            </div>

          </div>

        </div>

      ) : (

        <div className="space-y-6">


          {/* ==================================================
              SUPPORTED CROPS
          ================================================== */}

          <div className="glass-card p-4 bg-white/90 border border-gray-200/80 rounded-2xl">

            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">

              Supported Crops

            </p>


            <div className="grid grid-cols-3 gap-2.5">

              {SUPPORTED_CROPS.map(
                (crop) => (

                  <button
                    key={crop}
                    onClick={() =>
                      setSelectedCrop(crop)
                    }
                    className={`
                      py-2.5
                      px-3
                      rounded-xl
                      text-xs
                      font-bold
                      border
                      transition-all

                      ${selectedCrop === crop

                        ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-xs ring-1 ring-brand-500/20'

                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >

                    {crop}

                  </button>

                )
              )}

            </div>

          </div>


          {/* ==================================================
              CROP SELECTION
          ================================================== */}

          <div className="glass-card p-6 bg-white border border-gray-200/80 rounded-3xl">

            <div className="flex items-center gap-2.5 mb-3">

              <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">

                1

              </div>

              <h3 className="text-base font-bold text-gray-900">

                Specify Crop Type

              </h3>

            </div>


            <div className="relative">

              <select
                value={selectedCrop}
                onChange={(event) =>
                  setSelectedCrop(
                    event.target.value
                  )
                }
                className="input pr-10 text-xs font-semibold text-gray-800 bg-gray-50 border-gray-200 rounded-xl w-full"
              >

                <option value="">

                  Choose a crop...

                </option>


                {SUPPORTED_CROPS.map(
                  (crop) => (

                    <option
                      key={crop}
                      value={crop}
                    >

                      {crop}

                    </option>

                  )
                )}

              </select>


              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

            </div>

          </div>


          {/* ==================================================
              IMAGE UPLOAD
          ================================================== */}

          <div className="glass-card p-6 bg-white border border-gray-200/80 rounded-3xl">

            <div className="flex items-center justify-between mb-3">

              <div className="flex items-center gap-2.5">

                <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">

                  2

                </div>

                <h3 className="text-base font-bold text-gray-900">

                  Upload Leaf Image

                </h3>

              </div>


              {imagePreview && (

                <button
                  onClick={removeImage}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                >

                  <X size={14} />

                  Clear

                </button>

              )}

            </div>


            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) =>
                handleImageSelect(
                  event.target.files?.[0]
                )
              }
            />


            {!imagePreview ? (

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className={`
                  border-2
                  border-dashed
                  rounded-2xl
                  p-8
                  sm:p-12
                  text-center
                  cursor-pointer
                  transition-all

                  ${isDragging

                    ? 'border-brand-500 bg-brand-50/50 scale-[0.99]'

                    : 'border-gray-300 hover:border-brand-400 hover:bg-emerald-50/30'
                  }
                `}
              >

                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-brand-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xs">

                  <Upload size={24} />

                </div>


                <p className="text-sm font-bold text-gray-800">

                  Drop leaf image here, or{' '}

                  <span className="text-brand-600 underline">

                    browse device

                  </span>

                </p>


                <p className="text-xs text-gray-400 mt-1">

                  JPG, PNG, or WEBP up to 12MB

                </p>

              </div>

            ) : (

              <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 h-72 flex items-center justify-center group">

                <img
                  src={imagePreview}
                  alt="Leaf preview"
                  className="w-full h-full object-cover"
                />


                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />


                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">

                  <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg">

                    Image Ready

                  </span>


                  <button
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="text-xs font-semibold bg-white text-gray-900 px-3 py-1 rounded-lg shadow-sm hover:bg-gray-100"
                  >

                    Change Image

                  </button>

                </div>

              </div>

            )}

          </div>


          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (

            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">

              <AlertCircle
                size={16}
                className="shrink-0"
              />

              <span>
                {error}
              </span>

            </div>

          )}


          {/* ==================================================
              BUTTON
          ================================================== */}

          <div className="pt-2">

            <Button
              variant="primary"
              size="lg"
              onClick={handleAnalyze}
              className="w-full text-base font-extrabold shadow-glow py-3.5 flex items-center justify-center gap-2"
            >

              <ScanLine size={20} />

              Run Disease Detection

            </Button>

          </div>

        </div>

      )}

    </div>
  );
}