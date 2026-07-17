import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, FloatingField, ctaCls, ctaEnabled, ctaDisabled, journeyLabels } from "./StaffComponents";
import { patchDraft, type IdType } from "./onboardingDraft";

type FailureReason = "duplicate" | "aml";

const failureCopy: Record<FailureReason, { title: string; message: string }> = {
  duplicate: {
    title: "Duplicate customer detected",
    message: "A customer with this BVN/NIN already has an account with us.",
  },
  aml: {
    title: "AML screening flagged",
    message: "This customer was flagged during AML (Anti-Money Laundering) screening.",
  },
};

// Demo trigger values: any other 11-digit ID number passes normally.
const demoOutcomes: Record<string, FailureReason | null> = {
  "11111111111": null,
  "22222222222": "duplicate",
  "33333333333": "aml",
};

export default function StaffIdentityPage() {
  const navigate = useNavigate();
  const [idType, setIdType] = useState<IdType>("bvn");
  const [idNumber, setIdNumber] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<FailureReason | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const ready = idNumber.length === 11 && dob !== "" && emailValid;

  const runCheck = () => {
    if (!ready || checking) return;
    const forceFail = demoOutcomes[idNumber] ?? null;
    setError(null);
    setChecking(true);
    patchDraft({ idType, idNumber, dob, email });
    setTimeout(() => {
      if (forceFail) {
        setChecking(false);
        setError(forceFail);
      } else {
        navigate("/staff-rewards/liveness");
      }
    }, 1400);
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title="Identity Verification" onBack={() => navigate("/staff-rewards/terms")} />
        <StaffProgressTracker currentStep={5} totalSteps={10} labels={journeyLabels} />

        <div className="flex-1 overflow-y-auto px-[24px] pt-[10px] pb-[120px]">
          <h2 className="font-['Effra',sans-serif] font-bold text-[20px] text-[#383838] mb-[6px]">Verify identity</h2>
          <p className="font-['Effra',sans-serif] text-[14px] text-[#707070] leading-[20px] mb-[20px]">
            Choose an identification method and enter the customer's details. We'll run background checks
            automatically once you continue.
          </p>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#fdeaea] rounded-[14px] p-[16px] mb-[20px]">
                  <p className="font-['Effra',sans-serif] font-bold text-[13.5px] text-[#dc2626] mb-[4px]">
                    {failureCopy[error].title}
                  </p>
                  <p className="font-['Effra',sans-serif] text-[12.5px] text-[#a83232] leading-[18px]">
                    {failureCopy[error].message}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <label className="font-['Effra',sans-serif] text-[12px] text-[#707070] mb-[6px] block">Identification method</label>
          <div className="flex gap-[8px] mb-[16px]">
            {(["bvn", "nin"] as IdType[]).map((t) => (
              <button
                key={t}
                onClick={() => { setIdType(t); setIdNumber(""); }}
                className={`flex-1 py-[11px] rounded-[12px] font-['Effra',sans-serif] font-medium text-[13px] border-2 transition-all active:scale-[0.97] ${idType === t ? "border-[#003883] bg-[#ebf3ff] text-[#003883] shadow-[0_0_0_4px_#ebf3ff]" : "border-[#e6e8ec] text-[#707070] hover:border-[#c9cdd4]"}`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mb-[16px]">
            <FloatingField
              label={`${idType.toUpperCase()} (11 digits)`}
              value={idNumber}
              onChange={(v) => setIdNumber(v.replace(/\D/g, "").slice(0, 11))}
              inputMode="numeric"
              maxLength={11}
            />
          </div>
          <div className="mb-[16px]">
            <FloatingField
              label="Date of birth"
              value={dob}
              onChange={setDob}
              type="date"
            />
          </div>
          <div className="mb-[16px]">
            <FloatingField
              label="Customer email address"
              value={email}
              onChange={setEmail}
              type="email"
            />
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] p-[16px] z-20">
          <div className="max-w-[430px] mx-auto">
            <button onClick={runCheck} disabled={!ready || checking} className={`${ctaCls} ${ready && !checking ? ctaEnabled : ctaDisabled}`}>
              {checking ? (
                <span className="inline-flex items-center gap-[8px]">
                  <span className="w-[15px] h-[15px] border-[2px] border-white/40 border-t-white rounded-full animate-spin" />
                  Running background checks…
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
