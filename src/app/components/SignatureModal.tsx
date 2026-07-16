import { useState, useRef, useEffect } from "react";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signature: string) => void;
}

type SignatureMode = 'draw' | 'photo' | 'upload';

export default function SignatureModal({ isOpen, onClose, onSave }: SignatureModalProps) {
  const [mode, setMode] = useState<SignatureMode>('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Cleanup camera when modal closes
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setCapturedPhoto(null);
      setUploadedImage(null);
      setMode('draw');
      clearCanvas();
    }
  }, [isOpen, stream]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = '#003883';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSave = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        const signature = canvas.toDataURL('image/png');
        onSave(signature);
      }
    } else if (mode === 'photo' && capturedPhoto) {
      onSave(capturedPhoto);
    } else if (mode === 'upload' && uploadedImage) {
      onSave(uploadedImage);
    }
    onClose();
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const photo = canvas.toDataURL('image/png');
      setCapturedPhoto(photo);
      
      // Stop camera after capture
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModeChange = (newMode: SignatureMode) => {
    // Stop camera if switching away from photo mode
    if (mode === 'photo' && stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setMode(newMode);
    setCapturedPhoto(null);
    setUploadedImage(null);
    clearCanvas();

    // Start camera if switching to photo mode
    if (newMode === 'photo') {
      startCamera();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-t-[20px] w-full max-w-[480px] max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-[20px] border-b border-[#ebebeb]">
          <h3 className="font-['Effra',sans-serif] font-bold text-[18px] text-[#383838]">
            Add Signature
          </h3>
          <button
            onClick={onClose}
            className="w-[32px] h-[32px] rounded-full hover:bg-[#f5f5f5] flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="#383838" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-[#ebebeb]">
          <button
            onClick={() => handleModeChange('draw')}
            className={`flex-1 py-[16px] font-['Effra',sans-serif] font-semibold text-[14px] ${
              mode === 'draw' 
                ? 'text-[#003883] border-b-2 border-[#003883]' 
                : 'text-[#8a8a8a]'
            }`}
          >
            Draw
          </button>
          <button
            onClick={() => handleModeChange('photo')}
            className={`flex-1 py-[16px] font-['Effra',sans-serif] font-semibold text-[14px] ${
              mode === 'photo' 
                ? 'text-[#003883] border-b-2 border-[#003883]' 
                : 'text-[#8a8a8a]'
            }`}
          >
            Take Photo
          </button>
          <button
            onClick={() => handleModeChange('upload')}
            className={`flex-1 py-[16px] font-['Effra',sans-serif] font-semibold text-[14px] ${
              mode === 'upload' 
                ? 'text-[#003883] border-b-2 border-[#003883]' 
                : 'text-[#8a8a8a]'
            }`}
          >
            Upload
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-[20px]">
          {/* Draw Mode */}
          {mode === 'draw' && (
            <div className="flex flex-col items-center">
              <p className="font-['Effra',sans-serif] font-medium text-[14px] text-[#595959] mb-[16px] text-center">
                Draw your signature below
              </p>
              <div className="w-full border-2 border-dashed border-[#d3d3d6] rounded-[8px] bg-[#f9f9f9] overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[150px] touch-none cursor-crosshair bg-white"
                />
              </div>
              <button
                onClick={clearCanvas}
                className="mt-[16px] px-[20px] py-[10px] border border-[#d3d3d6] rounded-[4px] font-['Effra',sans-serif] font-medium text-[14px] text-[#595959] hover:bg-[#f5f5f5]"
              >
                Clear
              </button>
            </div>
          )}

          {/* Photo Mode */}
          {mode === 'photo' && (
            <div className="flex flex-col items-center">
              <p className="font-['Effra',sans-serif] font-medium text-[14px] text-[#595959] mb-[16px] text-center">
                Take a photo of your signature
              </p>
              
              {!capturedPhoto ? (
                <div className="w-full">
                  <div className="w-full aspect-video bg-black rounded-[8px] overflow-hidden mb-[16px]">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={capturePhoto}
                    className="w-full py-[14px] bg-[#003883] rounded-[4px] font-['Effra',sans-serif] font-bold text-[16px] text-white hover:bg-[#002a5c]"
                  >
                    Capture
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <div className="w-full border-2 border-[#d3d3d6] rounded-[8px] overflow-hidden mb-[16px]">
                    <img src={capturedPhoto} alt="Captured signature" className="w-full" />
                  </div>
                  <button
                    onClick={() => {
                      setCapturedPhoto(null);
                      startCamera();
                    }}
                    className="w-full py-[14px] border border-[#d3d3d6] rounded-[4px] font-['Effra',sans-serif] font-medium text-[14px] text-[#595959] hover:bg-[#f5f5f5]"
                  >
                    Retake
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Upload Mode */}
          {mode === 'upload' && (
            <div className="flex flex-col items-center">
              <p className="font-['Effra',sans-serif] font-medium text-[14px] text-[#595959] mb-[16px] text-center">
                Upload an image of your signature
              </p>
              
              {!uploadedImage ? (
                <div className="w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-[60px] border-2 border-dashed border-[#d3d3d6] rounded-[8px] bg-[#f9f9f9] hover:bg-[#f5f5f5] flex flex-col items-center justify-center gap-[12px]"
                  >
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <path d="M38 32V38H10V32H6V38C6 40.2 7.8 42 10 42H38C40.2 42 42 40.2 42 38V32H38Z" fill="#8a8a8a"/>
                      <path d="M26 26.34L32.66 19.66L35.48 22.48L24 34L12.52 22.48L15.34 19.66L22 26.34V6H26V26.34Z" fill="#8a8a8a"/>
                    </svg>
                    <span className="font-['Effra',sans-serif] font-medium text-[14px] text-[#595959]">
                      Click to upload
                    </span>
                    <span className="font-['Effra',sans-serif] font-normal text-[12px] text-[#8a8a8a]">
                      PNG, JPG up to 10MB
                    </span>
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <div className="w-full border-2 border-[#d3d3d6] rounded-[8px] overflow-hidden mb-[16px]">
                    <img src={uploadedImage} alt="Uploaded signature" className="w-full" />
                  </div>
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="w-full py-[14px] border border-[#d3d3d6] rounded-[4px] font-['Effra',sans-serif] font-medium text-[14px] text-[#595959] hover:bg-[#f5f5f5]"
                  >
                    Change Image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-[20px] border-t border-[#ebebeb] flex gap-[12px]">
          <button
            onClick={onClose}
            className="flex-1 py-[14px] border border-[#d3d3d6] rounded-[4px] font-['Effra',sans-serif] font-bold text-[16px] text-[#595959] hover:bg-[#f5f5f5]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-[14px] bg-[#ff8200] rounded-[4px] font-['Effra',sans-serif] font-bold text-[16px] text-white hover:bg-[#e67500]"
          >
            Save Signature
          </button>
        </div>
      </div>
    </div>
  );
}