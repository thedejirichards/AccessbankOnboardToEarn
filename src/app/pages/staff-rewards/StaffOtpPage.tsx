import { useState } from "react";
import { useNavigate } from "react-router";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, ctaCls, ctaEnabled, ctaDisabled, journeyLabels } from "./StaffComponents";
import { getDraft, patchDraft, type OtpChannel } from "./onboardingDraft";

const channels: { id: OtpChannel; label: string }[] = [
  { id: "sms", label: "SMS" },
  { id: "whatsapp", label: "WhatsApp" },
];

const firstNames = ["Ngozi", "Chidi", "Amaka", "Emeka", "Bisi", "Tunde", "Fatima", "Ibrahim", "Chiamaka", "Segun"];
const lastNames = ["Okafor", "Adeyemi", "Umeh", "Bello", "Okoro", "Balogun", "Eze", "Yusuf", "Nwosu", "Ogundele"];
const genders = ["Female", "Male"];

function hashDigits(s: string): number {
  return s.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function generateProfile(idNumber: string) {
  const h = hashDigits(idNumber || "00000000000");
  const firstName = firstNames[h % firstNames.length];
  const lastName = lastNames[(h >> 2) % lastNames.length];
  const gender = genders[h % genders.length];
  const year = 1970 + (h % 35);
  const month = String(1 + (h % 12)).padStart(2, "0");
  const day = String(1 + (h % 28)).padStart(2, "0");
  return { firstName, lastName, gender, dob: `${year}-${month}-${day}` };
}

export default function StaffOtpPage() {
  const navigate = useNavigate();
  const draft = getDraft();
  const [channel, setChannel] = useState<OtpChannel>("sms");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(false);

  const destination = channel === "email" ? draft.email : draft.phone;
  const masked =
    channel === "email"
      ? destination?.replace(/^(.{2}).*(@.*)$/, "$1•••$2")
      : destination?.replace(/(\d{4})\d+(\d{3})/, "$1 ••• $2");

  const send = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1000);
  };

  const verify = () => {
    if (code.length !== 6) return;
    setError(false);
    setVerifying(true);
    setTimeout(() => {
      // Simulated: any 6-digit code is accepted (no real OTP gateway).
      setVerifying(false);
      const profile = generateProfile(draft.idNumber || "");
      patchDraft({ otpChannel: channel, otpVerified: true, profile });
      navigate("/staff-rewards/review");
    }, 900);
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title="OTP Verification" onBack={() => navigate("/staff-rewards/liveness")} />
        <StaffProgressTracker currentStep={7} totalSteps={10} labels={journeyLabels} />

        <div className="flex-1 overflow-y-auto px-[24px] pt-[10px] pb-[120px]">
          {!sent ? (
            <>
              <h2 className="font-['Effra',sans-serif] font-bold text-[20px] text-[#383838] mb-[6px]">Send a verification code</h2>
              <p className="font-['Effra',sans-serif] text-[14px] text-[#707070] leading-[20px] mb-[20px]">
                Choose how the customer should receive their one-time code.
              </p>
              <div className="flex flex-col gap-[10px] mb-[24px]">
                {channels.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setChannel(c.id)}
                    className={`flex items-center justify-between px-[16px] py-[14px] rounded-[14px] border-2 transition-all ${channel === c.id ? "border-[#003883] bg-[#ebf3ff]" : "border-[#e6e8ec] hover:border-[#c9cdd4]"}`}
                  >
                    <span className="font-['Effra',sans-serif] font-medium text-[14px] text-[#26282b]">{c.label}</span>
                    {channel === c.id && (
                      <span className="w-[18px] h-[18px] rounded-full bg-[#003883] flex items-center justify-center">
                        <span className="w-[7px] h-[7px] rounded-full bg-white" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <button onClick={send} disabled={sending} className={`${ctaCls} ${sending ? ctaDisabled : ctaEnabled}`}>
                {sending ? "Sending…" : "Send code"}
              </button>
            </>
          ) : (
            <>
              <h2 className="font-['Effra',sans-serif] font-bold text-[20px] text-[#383838] mb-[6px]">Enter verification code</h2>
              <p className="font-['Effra',sans-serif] text-[14px] text-[#707070] leading-[20px] mb-[20px]">
                We sent a 6-digit code via {channel.toUpperCase()} to <span className="font-bold text-[#383838]">{masked}</span>.
              </p>
              <input
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(false); }}
                inputMode="numeric"
                maxLength={6}
                placeholder="••••••"
                className={`w-full text-center tracking-[10px] bg-white border rounded-[8px] px-[16px] py-[16px] font-['Effra',sans-serif] font-bold text-[22px] text-[#1E293B] outline-none focus:border-2 transition-colors mb-[10px] ${error ? "border-[#dc2626]" : "border-[#E2E8F0] focus:border-[#003883]"}`}
              />
              {error && (
                <p className="font-['Effra',sans-serif] text-[12px] text-[#dc2626] mb-[10px]">Enter the 6-digit code sent to the customer.</p>
              )}
              <button onClick={() => setSent(false)} className="font-['Effra',sans-serif] text-[13px] font-medium text-[#003883] hover:underline transition-all mb-[24px]">
                Didn't get it? Resend
              </button>
              <button onClick={verify} disabled={code.length !== 6 || verifying} className={`${ctaCls} ${code.length === 6 && !verifying ? ctaEnabled : ctaDisabled}`}>
                {verifying ? "Verifying…" : "Verify"}
              </button>
            </>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
