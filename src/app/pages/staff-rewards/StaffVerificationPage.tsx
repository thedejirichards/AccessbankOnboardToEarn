import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, RoleBadge, cardCls, ctaCls, ctaEnabled, ctaDisabled, journeyLabels, pagePadXBtm, bottomBarCls, bottomBarInner, sectionTitle, sectionDesc } from "./StaffComponents";
import { getDraft, patchDraft, clearDraft } from "./onboardingDraft";

type SubStep = "liveness" | "email" | "review";
type ScanStep = "idle" | "starting" | "scanning" | "verified";

const firstNames = ["Ngozi", "Chidi", "Amaka", "Emeka", "Bisi", "Tunde", "Fatima", "Ibrahim", "Chiamaka", "Segun"];
const lastNames = ["Okafor", "Adeyemi", "Umeh", "Bello", "Okoro", "Balogun", "Eze", "Yusuf", "Nwosu", "Ogundele"];
const genders = ["Female", "Male"];

function hashDigits(s: string): number {
  return s.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function generateProfile(idNumber: string, dob: string) {
  const h = hashDigits(idNumber || "00000000000");
  const firstName = firstNames[h % firstNames.length];
  const lastName = lastNames[(h >> 2) % lastNames.length];
  const gender = genders[h % genders.length];
  return { firstName, lastName, gender, dob };
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="font-['Effra',sans-serif] text-sm text-[#9ca3af]">{label}</span>
      <span className="font-['Effra',sans-serif] font-medium text-sm text-[#26282b]">{value}</span>
    </div>
  );
}

export default function StaffVerificationPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const draft = getDraft();

  const [sub, setSub] = useState<SubStep>("liveness");
  const [scanStep, setScanStep] = useState<ScanStep>("idle");
  const [progress, setProgress] = useState(0);
  const [hasCamera, setHasCamera] = useState(true);

  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailConfirming, setEmailConfirming] = useState(false);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => stopStream, []);

  useEffect(() => {
    if (scanStep !== "scanning") return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          captureFrame();
          stopStream();
          setScanStep("verified");
          return 100;
        }
        return p + 2;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [scanStep]);

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
    if (scanStep !== "idle") return;
    setScanStep("starting");
    setProgress(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      setHasCamera(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
      setTimeout(() => setScanStep("scanning"), 1200);
    } catch {
      setHasCamera(false);
      setTimeout(() => setScanStep("scanning"), 600);
    }
  };

  const livenessVerified = scanStep === "verified";
  const scanning = scanStep === "scanning";
  const cameraLive = (scanStep === "starting" || scanning) && hasCamera;

  const sendEmailVerification = () => {
    setEmailSending(true);
    setTimeout(() => { setEmailSending(false); setEmailSent(true); }, 1200);
  };

  const confirmEmailVerification = () => {
    setEmailConfirming(true);
    const profile = generateProfile(draft.idNumber || "", draft.dob || "");
    patchDraft({ emailVerified: true, profile });
    setTimeout(() => { setEmailConfirming(false); setSub("review"); }, 1000);
  };

  const goBack = () => {
    if (sub === "liveness") {
      stopStream();
      navigate("/staff-rewards/terms-identity");
    } else if (sub === "email") {
      setSub("liveness");
    } else {
      setSub("email");
    }
  };

  const cancelReview = () => {
    clearDraft();
    navigate("/staff-rewards");
  };

  const title = sub === "liveness" ? "Facial Verification" : sub === "email" ? "Email Confirmation" : "Review Profile";

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title={title} onBack={goBack} />
        <StaffProgressTracker currentStep={3} totalSteps={4} labels={journeyLabels} />

        <div className={`flex-1 overflow-y-auto ${pagePadXBtm} pt-2`}>
          <AnimatePresence mode="wait">
            {/* ---- Liveness sub-step ---- */}
            {sub === "liveness" && (
              <motion.div key="liveness" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <h2 className={`${sectionTitle} mb-1`}>Confirm the customer is present</h2>
                <div className="mb-3"><RoleBadge role="customer" /></div>
                <p className={`${sectionDesc} mb-6`}>
                  Hand the device to the customer and ask them to look into the camera.
                </p>
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {scanning && (
                      <motion.div className="absolute -inset-[8px] rounded-full border-2 border-[#003883]/30" animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.15, 0.6] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }} />
                    )}
                    <motion.div
                      animate={livenessVerified ? { scale: [1, 1.06, 1] } : {}}
                      className={`w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center relative overflow-hidden shadow-[0_10px_30px_rgba(0,56,131,0.14)] ${livenessVerified ? "bg-gradient-to-b from-[#e8f8ee] to-[#d3f2de]" : "bg-gradient-to-b from-[#ebf3ff] to-[#dcebff]"}`}
                    >
                      <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] ${cameraLive ? "opacity-100" : "opacity-0"} transition-opacity`} />
                      {scanning && (
                        <motion.div initial={{ y: -80 }} animate={{ y: 80 }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.9 }} className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#b5d334] to-transparent shadow-[0_0_10px_#b5d334] z-10" />
                      )}
                      {livenessVerified ? (
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
                    <div className="w-40 md:w-48 mt-3">
                      <div className="h-[5px] bg-[#eceef1] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#003883] to-[#1e5fc4] rounded-full transition-all duration-75" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                  <p className="font-['Effra',sans-serif] text-sm text-[#707070] mt-3">
                    {livenessVerified ? "Liveness confirmed" : scanning ? `Scanning… ${progress}%` : scanStep === "starting" ? "Position your face in the frame" : "Facial liveness scan"}
                  </p>
                  {!hasCamera && (scanning || livenessVerified) && (
                    <p className="font-['Effra',sans-serif] text-xs text-[#9ca3af] mt-1">Camera unavailable — simulated scan</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* ---- Email verification sub-step ---- */}
            {sub === "email" && (
              <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <h2 className={`${sectionTitle} mb-1`}>Verify email address</h2>
                <div className="mb-3"><RoleBadge role="customer" /></div>
                <p className={`${sectionDesc} mb-5`}>
                  A secure verification link will be sent to the customer's phone. They must confirm it on their device before you can proceed.
                </p>

                <div className={`${cardCls} p-4 md:p-5 mb-4`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#ebf3ff] flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="4" width="20" height="16" rx="3" stroke="#003883" strokeWidth="1.8" />
                        <path d="M2 7l10 6 10-6" stroke="#003883" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Effra',sans-serif] text-xs text-[#9ca3af]">Sending to</p>
                      <p className="font-['Effra',sans-serif] font-bold text-sm md:text-[15px] text-[#26282b] truncate">{draft.email || "—"}</p>
                    </div>
                  </div>

                  {!emailSent ? (
                    <button onClick={sendEmailVerification} disabled={emailSending} className={`w-full ${ctaCls} ${emailSending ? ctaDisabled : "bg-[#003883] text-white shadow-[0_8px_20px_rgba(0,56,131,0.30)] hover:bg-[#002a63] active:scale-[0.98]"}`}>
                      {emailSending ? (
                        <span className="inline-flex items-center gap-[8px]">
                          <span className="w-[15px] h-[15px] border-[2px] border-white/40 border-t-white rounded-full animate-spin" />
                          Sending verification link…
                        </span>
                      ) : (
                        "Send verification link"
                      )}
                    </button>
                  ) : (
                    <div className="bg-[#e8f8ee] rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, stiffness: 260 }} width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                          <circle cx="12" cy="12" r="10" fill="#16a34a" />
                          <path d="M8 12.5l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                        <div>
                          <p className="font-['Effra',sans-serif] font-bold text-sm text-[#16753a]">Verification link sent</p>
                          <p className="font-['Effra',sans-serif] text-xs md:text-sm text-[#1a7a42] leading-5 md:leading-6 mt-0.5">
                            Ask the customer to check their phone and tap the confirmation link.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {emailSent && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <p className="font-['Effra',sans-serif] text-sm text-[#707070] leading-5 md:leading-6 mb-4">
                      Once the customer has confirmed on their phone, tap below to continue.
                    </p>
                    <button onClick={confirmEmailVerification} disabled={emailConfirming} className={`w-full ${ctaCls} ${emailConfirming ? ctaDisabled : ctaEnabled}`}>
                      {emailConfirming ? (
                        <span className="inline-flex items-center gap-[8px]">
                          <span className="w-[15px] h-[15px] border-[2px] border-white/40 border-t-white rounded-full animate-spin" />
                          Confirming…
                        </span>
                      ) : (
                        "Customer has confirmed"
                      )}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ---- Review sub-step ---- */}
            {sub === "review" && (
              <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <h2 className={`${sectionTitle} mb-1`}>Confirm this is correct</h2>
                <div className="mb-3"><RoleBadge role="customer" /></div>
                <p className={`${sectionDesc} mb-5`}>
                  This is what we retrieved from the {(draft.idType || "bvn").toUpperCase()} record. Ask the customer to confirm.
                </p>

                <div className="flex justify-center mb-5">
                  <div className="w-22 h-22 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-[0_8px_20px_rgba(16,24,40,0.14)] bg-[#ebf3ff] flex items-center justify-center">
                    {draft.livenessFaceImage ? (
                      <img src={draft.livenessFaceImage} alt="Customer" className="w-full h-full object-cover" />
                    ) : (
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="9" r="3.4" stroke="#003883" strokeWidth="1.6" />
                        <path d="M5 20a7 7 0 0114 0" stroke="#003883" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className={`${cardCls} px-4 md:px-5 divide-y divide-[#f4f5f7]`}>
                  <ReviewRow label="Full name" value={draft.profile ? `${draft.profile.firstName} ${draft.profile.lastName}` : "—"} />
                  <ReviewRow label="Date of birth" value={draft.profile?.dob || "—"} />
                  <ReviewRow label="Gender" value={draft.profile?.gender || "—"} />
                  <ReviewRow label={(draft.idType || "bvn").toUpperCase()} value={draft.idNumber || "—"} />
                  <ReviewRow label="Phone" value={draft.phone || "—"} />
                  <ReviewRow label="Email" value={draft.email || "—"} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={bottomBarCls}>
          <div className={bottomBarInner}>
            {sub === "liveness" && (
              livenessVerified ? (
                <button onClick={() => setSub("email")} className={`${ctaCls} ${ctaEnabled}`}>Continue</button>
              ) : (
                <button onClick={runScan} disabled={scanStep !== "idle"} className={`${ctaCls} ${scanStep === "idle" ? "bg-[#003883] text-white shadow-[0_8px_20px_rgba(0,56,131,0.30)] hover:bg-[#002a63] active:scale-[0.98]" : ctaDisabled}`}>
                  {scanStep === "idle" ? "Start facial scan" : "Verifying…"}
                </button>
              )
            )}
            {sub === "review" && (
              <div className="flex flex-col gap-[10px]">
                <button onClick={() => navigate("/staff-rewards/complete")} className={`${ctaCls} ${ctaEnabled}`}>
                  Profile is correct — continue
                </button>
                <button onClick={cancelReview} className="w-full bg-white border-2 border-[#e6e8ec] text-[#707070] font-['Effra',sans-serif] font-medium text-base py-4 rounded-[14px] hover:bg-[#f7f9fc] active:scale-[0.98] transition-all">
                  Information is incorrect — cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
