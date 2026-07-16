import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, ctaCls, ctaEnabled, ctaDisabled, journeyLabels } from "./StaffComponents";
import { patchDraft } from "./onboardingDraft";

type ScanStep = "idle" | "starting" | "scanning" | "verified";

export default function StaffLivenessPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [step, setStep] = useState<ScanStep>("idle");
  const [progress, setProgress] = useState(0);
  const [hasCamera, setHasCamera] = useState(true);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => stopStream, []);

  useEffect(() => {
    if (step !== "scanning") return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          captureFrame();
          stopStream();
          setStep("verified");
          return 100;
        }
        return p + 2;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [step]);

  const captureFrame = () => {
    const video = videoRef.current;
    if (video && video.videoWidth > 0) {
      const canvas = document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 320;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const size = Math.min(video.videoWidth, video.videoHeight);
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, (video.videoWidth - size) / 2, (video.videoHeight - size) / 2, size, size, 0, 0, canvas.width, canvas.height);
        patchDraft({ livenessFaceImage: canvas.toDataURL("image/jpeg", 0.85) });
        return;
      }
    }
    patchDraft({ livenessFaceImage: "" });
  };

  const runScan = async () => {
    if (step !== "idle") return;
    setStep("starting");
    setProgress(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      setHasCamera(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
      setTimeout(() => setStep("scanning"), 1200);
    } catch {
      setHasCamera(false);
      setTimeout(() => setStep("scanning"), 600);
    }
  };

  const scanning = step === "scanning";
  const verified = step === "verified";
  const cameraLive = (step === "starting" || scanning) && hasCamera;

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title="Liveness Verification" onBack={() => { stopStream(); navigate("/staff-rewards/validating"); }} />
        <StaffProgressTracker currentStep={7} totalSteps={11} labels={journeyLabels} />

        <div className="flex-1 overflow-y-auto px-[24px] pt-[10px] pb-[120px]">
          <h2 className="font-['Effra',sans-serif] font-bold text-[20px] text-[#383838] mb-[6px]">Confirm the customer is present</h2>
          <p className="font-['Effra',sans-serif] text-[14px] text-[#707070] leading-[20px] mb-[24px]">
            Hand the device to the customer and ask them to look into the camera.
          </p>

          <div className="flex flex-col items-center">
            <div className="relative">
              {scanning && (
                <motion.div
                  className="absolute -inset-[8px] rounded-full border-2 border-[#003883]/30"
                  animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.15, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                />
              )}
              <motion.div
                animate={verified ? { scale: [1, 1.06, 1] } : {}}
                className={`w-[170px] h-[170px] rounded-full flex items-center justify-center relative overflow-hidden shadow-[0_10px_30px_rgba(0,56,131,0.14)] ${verified ? "bg-gradient-to-b from-[#e8f8ee] to-[#d3f2de]" : "bg-gradient-to-b from-[#ebf3ff] to-[#dcebff]"}`}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] ${cameraLive ? "opacity-100" : "opacity-0"} transition-opacity`}
                />
                {scanning && (
                  <motion.div
                    initial={{ y: -80 }}
                    animate={{ y: 80 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.9 }}
                    className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#b5d334] to-transparent shadow-[0_0_10px_#b5d334] z-10"
                  />
                )}
                {verified ? (
                  <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, stiffness: 240 }} width="60" height="60" viewBox="0 0 48 48" fill="none" className="relative z-10">
                    <circle cx="24" cy="24" r="22" fill="#34c759" />
                    <motion.path d="M15 24.5L21 30.5L33 18" stroke="white" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.15 }} />
                  </motion.svg>
                ) : (
                  !cameraLive && (
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="9" r="3.4" stroke="#003883" strokeWidth="1.6" />
                      <path d="M5 20a7 7 0 0114 0" stroke="#003883" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  )
                )}
              </motion.div>
            </div>

            {scanning && (
              <div className="w-[170px] mt-[14px]">
                <div className="h-[5px] bg-[#eceef1] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#003883] to-[#1e5fc4] rounded-full transition-all duration-75" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            <p className="font-['Effra',sans-serif] text-[13px] text-[#707070] mt-[12px]">
              {verified
                ? "Liveness confirmed"
                : scanning
                  ? `Scanning… ${progress}%`
                  : step === "starting"
                    ? "Position your face in the frame"
                    : "Facial liveness scan"}
            </p>
            {!hasCamera && (scanning || verified) && (
              <p className="font-['Effra',sans-serif] text-[11px] text-[#9ca3af] mt-[4px]">Camera unavailable — simulated scan</p>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] p-[16px] z-20">
          <div className="max-w-[430px] mx-auto">
            {verified ? (
              <button onClick={() => navigate("/staff-rewards/otp")} className={`${ctaCls} ${ctaEnabled}`}>
                Continue
              </button>
            ) : (
              <button
                onClick={runScan}
                disabled={step !== "idle"}
                className={`${ctaCls} ${step === "idle" ? "bg-[#003883] text-white shadow-[0_8px_20px_rgba(0,56,131,0.30)] hover:bg-[#002a63] active:scale-[0.98]" : ctaDisabled}`}
              >
                {step === "idle" ? "Start liveness scan" : "Verifying…"}
              </button>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
