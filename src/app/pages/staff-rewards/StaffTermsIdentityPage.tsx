import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, FloatingField, StatusChip, RoleBadge, ctaCls, ctaEnabled, ctaDisabled, journeyLabels, pagePadXBtm, bottomBarCls, bottomBarInner, sectionTitle, sectionDesc } from "./StaffComponents";
import { patchDraft, type IdType } from "./onboardingDraft";

type SubStep = "pending" | "approved" | "identity";
type ScanStep = "idle" | "starting" | "scanning" | "verified";
type FailureReason = "duplicate" | "aml";

const firstNames = ["Ngozi", "Chidi", "Amaka", "Emeka", "Bisi", "Tunde", "Fatima", "Ibrahim", "Chiamaka", "Segun"];
const lastNames = ["Okafor", "Adeyemi", "Umeh", "Bello", "Okoro", "Balogun", "Eze", "Yusuf", "Nwosu", "Ogundele"];
const genders = ["Female", "Male"];

function hashDigits(s: string): number {
  return s.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function generateProfile(idNumber: string, dob: string) {
  const h = hashDigits(idNumber || "00000000000");
  const firstName = firstNames[h % firstNames.length];
  const middleName = "Tobi";
  const lastName = lastNames[(h >> 2) % lastNames.length];
  const gender = genders[h % genders.length];
  return { firstName, middleName, lastName, gender, dob };
}

const failureCopy: Record<FailureReason, { title: string; message: string }> = {
  duplicate: { title: "Duplicate customer detected", message: "A customer with this BVN/NIN already has an account with us." },
  aml: { title: "AML screening flagged", message: "This customer was flagged during AML (Anti-Money Laundering) screening." },
};

const demoOutcomes: Record<string, FailureReason | null> = {
  "11111111111": null,
  "22222222222": "duplicate",
  "33333333333": "aml",
};

export default function StaffTermsIdentityPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [sub, setSub] = useState<SubStep>("pending");
  const [resent, setResent] = useState(false);
  const [approvalError] = useState(false);

  const [idType, setIdType] = useState<IdType>("bvn");
  const [idNumber, setIdNumber] = useState("");
  const [dob, setDob] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<FailureReason | null>(null);

  const [idVerified, setIdVerified] = useState(false);
  const [scanStep, setScanStep] = useState<ScanStep>("idle");
  const [progress, setProgress] = useState(0);
  const [hasCamera, setHasCamera] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [idFocused, setIdFocused] = useState(false);

  const isValidBvn = idType === "bvn" && /^\d{11}$/.test(idNumber);
  const isValidNin = idType === "nin" && (/^\d{11}$/.test(idNumber) || /^[a-zA-Z0-9]{6}$/.test(idNumber));
  const idValid = idType === "bvn" ? isValidBvn : isValidNin;
  const identityReady = idValid && dob !== "";

  useEffect(() => {
    if (sub !== "pending") return;
    const timer = setTimeout(() => setSub("approved"), 2400);
    return () => clearTimeout(timer);
  }, [sub]);

  useEffect(() => {
    if (!resent) return;
    const timer = setTimeout(() => setResent(false), 2000);
    return () => clearTimeout(timer);
  }, [resent]);

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

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      streamRef.current = stream;
      setHasCamera(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
      setTimeout(() => setScanStep("scanning"), 1200);
    } catch {
      setHasCamera(false);
      setTimeout(() => setScanStep("scanning"), 600);
    }
  };

  const switchCamera = async () => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    if (scanStep === "starting" || scanning) {
      stopStream();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: next } });
        streamRef.current = stream;
        setHasCamera(true);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        setHasCamera(false);
      }
    }
  };

  const livenessVerified = scanStep === "verified";
  const scanning = scanStep === "scanning";
  const cameraLive = (scanStep === "starting" || scanning) && hasCamera;

  const goBack = () => {
    if (sub === "pending") navigate("/staff-rewards/account");
    else if (sub === "approved") setSub("pending");
    else {
      stopStream();
      if (idVerified && !livenessVerified) setScanStep("idle");
      else setSub("approved");
    }
  };

  const handleContinue = () => {
    if (sub === "approved") setSub("identity");
  };

  const handleResend = () => {
    setResent(true);
  };

  const runCheck = () => {
    if (!identityReady || checking) return;
    const forceFail = demoOutcomes[idNumber] ?? null;
    setError(null);
    setChecking(true);
    patchDraft({ idType, idNumber, dob });
    setTimeout(() => {
      if (forceFail) {
        setChecking(false);
        setError(forceFail);
      } else {
        const profile = generateProfile(idNumber, dob);
        patchDraft({ profile });
        setIdVerified(true);
        setChecking(false);
      }
    }, 1400);
  };

  const handleVerifyComplete = () => {
    stopStream();
    navigate("/staff-rewards/complete");
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader
          title={sub === "identity" ? "Identity Verification" : "Customer Approval"}
          onBack={goBack}
        />
        <StaffProgressTracker currentStep={2} totalSteps={4} labels={journeyLabels} />

        <div className={`flex-1 overflow-y-auto ${pagePadXBtm} pt-2`}>
          <AnimatePresence mode="wait">
            {sub === "pending" && (
              <motion.div key="pending" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex flex-col items-center text-center pt-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mb-6"
                >
                  <div className="w-20 h-20 rounded-full border-[4px] border-[#e6e8ec] border-t-[#FF8200]" />
                </motion.div>
                <div className="mb-2">
                  <StatusChip label={approvalError ? "Error" : "Pending"} tone={approvalError ? "red" : "amber"} />
                </div>
                <h2 className={`${sectionTitle} mb-2`}>Awaiting customer approval</h2>
                <p className={`${sectionDesc} max-w-[280px] mb-4`}>
                  An email has been sent to the customer to confirm they want to be onboarded.
                </p>
                <button type="button" onClick={handleResend} className="font-['Effra',sans-serif] text-sm text-[#003883] font-medium hover:underline">
                  {resent ? "Sent!" : "Didn't get mail? Resend"}
                </button>
              </motion.div>
            )}

            {sub === "approved" && (
              <motion.div key="approved" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col items-center text-center pt-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  className="mb-6"
                >
                  <div className="w-20 h-20 rounded-full bg-[#e8f8ee] flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#34c759] shadow-[0_6px_18px_rgba(52,199,89,0.4)] flex items-center justify-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
                <div className="mb-2">
                  <StatusChip label="Approved" tone="green" />
                </div>
                <h2 className={`${sectionTitle} mb-2`}>Customer approved</h2>
                <p className={`${sectionDesc} max-w-[280px]`}>
                  The customer has confirmed via email. You can now proceed with identity verification.
                </p>
              </motion.div>
            )}

            {sub === "identity" && (
              <motion.div key="identity" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <h2 className={`${sectionTitle} mb-1`}>Verify identity</h2>
                <p className={`${sectionDesc} mb-5`}>
                  Choose an identification method and enter the customer's details. We'll run background checks
                  automatically once you verify.
                </p>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="bg-[#fdeaea] rounded-2xl p-4 md:p-5 mb-5">
                        <p className="font-['Effra',sans-serif] font-bold text-sm md:text-[15px] text-[#dc2626] mb-1">{failureCopy[error].title}</p>
                        <p className="font-['Effra',sans-serif] text-xs md:text-sm text-[#a83232] leading-5 md:leading-6">{failureCopy[error].message}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <label className="font-['Effra',sans-serif] text-xs md:text-sm text-[#707070] mb-2 block">Identification method</label>
                <div className="flex gap-2 mb-4">
                  {(["bvn", "nin"] as IdType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setIdType(t); setIdNumber(""); setError(null); setIdVerified(false); setScanStep("idle"); setProgress(0); }}
                      className={`flex-1 py-3 rounded-xl font-['Effra',sans-serif] font-medium text-sm border-2 transition-all active:scale-[0.97] ${idType === t ? "border-[#003883] bg-[#ebf3ff] text-[#003883] shadow-[0_0_0_4px_#ebf3ff]" : "border-[#e6e8ec] text-[#707070] hover:border-[#c9cdd4]"}`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="mb-4">
                  <FloatingField
                    label={<span>{idType === "bvn" ? "BVN (11 digits)" : "NIN number or share code"} <span className="text-[#dc2626]">*</span></span>}
                    value={idNumber}
                    onChange={(v) => {
                      if (idType === "bvn") {
                        setIdNumber(v.replace(/\D/g, "").slice(0, 11));
                      } else {
                        setIdNumber(v.replace(/[^a-zA-Z0-9]/g, "").slice(0, 11));
                      }
                      setIdVerified(false);
                      setScanStep("idle");
                      setProgress(0);
                    }}
                    inputMode={idType === "bvn" ? "numeric" : "text"}
                    maxLength={idType === "bvn" ? 11 : 11}
                    onFocus={() => setIdFocused(true)}
                    onBlur={() => setIdFocused(false)}
                    error={idFocused && idNumber.length > 0 && !idValid}
                  />
                  {idType === "nin" && (
                    <p className="mt-1.5 font-['Effra',sans-serif] text-[11px] text-[#94A3B8]">Enter 11-digit NIN or 6-character share code</p>
                  )}
                </div>
                <div className="mb-4">
                  <FloatingField label={<span>Date of birth <span className="text-[#dc2626]">*</span></span>} value={dob} onChange={setDob} type="date" />
                </div>

                {/* Facial verification — shown only after ID passes */}
                <AnimatePresence>
                  {idVerified && (
                    <motion.div
                      key="liveness"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[#e6e8ec] pt-5 mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusChip label="ID verified" tone="green" />
                        </div>
                        <h3 className={`${sectionTitle} text-lg mb-1 mt-3`}>Facial verification</h3>
                        <div className="mb-3"><RoleBadge role="staff" /></div>
                        <p className={`${sectionDesc} mb-5`}>
                          Hand the device to the customer and ask them to look into the camera.
                        </p>

                        <div className="flex flex-col items-center">
                          <div className="relative">
                            {(scanning || cameraLive) && (
                              <button
                                type="button"
                                onClick={switchCamera}
                                className="absolute -top-1 -right-1 z-20 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center active:scale-90 transition-transform"
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                  <path d="M20 7l-2-2m2 2l-2 2m2-2h-6a4 4 0 00-4 4v1" stroke="#383838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M4 17l2 2m-2-2l2-2m-2 2h6a4 4 0 004-4V9" stroke="#383838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            )}
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
                            {livenessVerified ? "Liveness confirmed" : scanning ? `Scanning… ${progress}%` : scanStep === "starting" ? `Using ${facingMode === "environment" ? "back" : "front"} camera — position face in frame` : `Facial liveness scan (${facingMode === "environment" ? "back" : "front"} camera)`}
                          </p>
                          {!hasCamera && (scanning || livenessVerified) && (
                            <p className="font-['Effra',sans-serif] text-xs text-[#9ca3af] mt-1">Camera unavailable — simulated scan</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={bottomBarCls}>
          <div className={bottomBarInner}>
            {(sub === "pending" || sub === "approved") && (
              <button
                onClick={handleContinue}
                disabled={sub === "pending"}
                className={`${ctaCls} ${sub === "approved" ? ctaEnabled : ctaDisabled}`}
              >
                Continue
              </button>
            )}
            {sub === "identity" && !idVerified && (
              <button onClick={runCheck} disabled={!identityReady || checking} className={`${ctaCls} ${identityReady && !checking ? ctaEnabled : ctaDisabled}`}>
                {checking ? (
                  <span className="inline-flex items-center gap-[8px]">
                    <span className="w-[15px] h-[15px] border-[2px] border-white/40 border-t-white rounded-full animate-spin" />
                    Verifying…
                  </span>
                ) : (
                  "Verify"
                )}
              </button>
            )}
            {sub === "identity" && idVerified && !livenessVerified && (
              <button onClick={runScan} disabled={scanStep !== "idle"} className={`${ctaCls} ${scanStep === "idle" ? "bg-[#FF8200] text-white shadow-[0_8px_20px_rgba(255,130,0,0.35)] hover:bg-[#e67500] active:scale-[0.98]" : ctaDisabled}`}>
                {scanStep === "idle" ? "Start facial scan" : "Verifying…"}
              </button>
            )}
            {sub === "identity" && livenessVerified && (
              <button onClick={handleVerifyComplete} className={`${ctaCls} ${ctaEnabled}`}>
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
