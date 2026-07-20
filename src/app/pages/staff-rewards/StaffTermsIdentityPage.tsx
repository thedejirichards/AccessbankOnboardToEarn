import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, ToggleSwitch, RadioOption, FloatingField, cardCls, ctaCls, ctaEnabled, ctaDisabled, journeyLabels } from "./StaffComponents";
import { patchDraft, type IdType } from "./onboardingDraft";

type SubStep = "terms" | "identity";
type FailureReason = "duplicate" | "aml";

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
  const [sub, setSub] = useState<SubStep>("terms");

  const [cryptoAttestation, setCryptoAttestation] = useState(false);
  const [pep, setPep] = useState<"yes" | "no" | null>(null);
  const [resident, setResident] = useState<"yes" | "no" | null>("yes");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);

  const [idType, setIdType] = useState<IdType>("bvn");
  const [idNumber, setIdNumber] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<FailureReason | null>(null);

  const termsReady = cryptoAttestation && pep !== null && resident !== null && termsAccepted && dataConsent;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const identityReady = idNumber.length === 11 && dob !== "" && emailValid;

  const goBack = () => {
    if (sub === "terms") navigate("/staff-rewards/account");
    else setSub("terms");
  };

  const submitTerms = () => {
    if (!termsReady) return;
    patchDraft({
      cryptoAttestation,
      politicallyExposed: pep === "yes",
      resident: resident === "yes",
      termsAccepted,
      dataConsent,
    });
    setSub("identity");
  };

  const runCheck = () => {
    if (!identityReady || checking) return;
    const forceFail = demoOutcomes[idNumber] ?? null;
    setError(null);
    setChecking(true);
    patchDraft({ idType, idNumber, dob, email });
    setTimeout(() => {
      if (forceFail) {
        setChecking(false);
        setError(forceFail);
      } else {
        navigate("/staff-rewards/verification");
      }
    }, 1400);
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title={sub === "terms" ? "Terms & Conditions" : "Identity Verification"} onBack={goBack} />
        <StaffProgressTracker currentStep={2} totalSteps={4} labels={journeyLabels} />

        <div className="flex-1 overflow-y-auto px-[24px] pt-[10px] pb-[120px]">
          <AnimatePresence mode="wait">
            {sub === "terms" && (
              <motion.div key="terms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                {/* 1. Cryptocurrency attestation */}
                <div className={`${cardCls} p-[18px] mb-[16px]`}>
                  <div className="flex items-start justify-between gap-[14px]">
                    <p className="font-['Effra',sans-serif] text-[13px] text-[#4b5563] leading-[19px]">
                      I/We, hereby confirm that my/our account will not be used for any cryptocurrency transactions. If
                      such transactions occur, this serves as my/our instruction to close the account in accordance with
                      the Cease &amp; Desist notice above.
                    </p>
                    <ToggleSwitch checked={cryptoAttestation} onChange={setCryptoAttestation} />
                  </div>
                </div>

                {/* 2. Politically Exposed Person */}
                <div className={`${cardCls} p-[18px] mb-[16px]`}>
                  <p className="font-['Effra',sans-serif] font-bold text-[14px] text-[#26282b] mb-[6px]">
                    Are you a Politically Exposed Person?
                  </p>
                  <p className="font-['Effra',sans-serif] text-[12.5px] text-[#9ca3af] leading-[17px] mb-[12px]">
                    A Politically Exposed Person (PEP) is someone in a high-ranking public office or their close associate
                    or family member.
                  </p>
                  <div className="flex flex-col gap-[2px]">
                    <RadioOption label="No" selected={pep === "no"} onSelect={() => setPep("no")} />
                    <RadioOption label="Yes" selected={pep === "yes"} onSelect={() => setPep("yes")} />
                  </div>
                </div>

                {/* 3. Residency */}
                <div className={`${cardCls} p-[18px] mb-[16px]`}>
                  <p className="font-['Effra',sans-serif] font-bold text-[14px] text-[#26282b] mb-[12px]">
                    Are you a resident in Nigeria?
                  </p>
                  <div className="flex flex-col gap-[2px]">
                    <RadioOption label="No" selected={resident === "no"} onSelect={() => setResident("no")} />
                    <RadioOption label="Yes" selected={resident === "yes"} onSelect={() => setResident("yes")} />
                  </div>
                </div>

                {/* 4. Terms and Conditions */}
                <div className={`${cardCls} p-[18px] mb-[16px]`}>
                  <div className="flex items-start justify-between gap-[14px] mb-[8px]">
                    <p className="font-['Effra',sans-serif] text-[13.5px] text-[#26282b] leading-[19px]">
                      I agree to the Terms and Conditions
                    </p>
                    <ToggleSwitch checked={termsAccepted} onChange={setTermsAccepted} />
                  </div>
                  <button type="button" className="font-['Effra',sans-serif] text-[12.5px] font-medium text-[#003883] hover:underline">
                    Read Terms and Conditions
                  </button>
                </div>

                {/* 5. Personal Data Consent */}
                <div className={`${cardCls} p-[18px]`}>
                  <div className="flex items-start justify-between gap-[14px] mb-[8px]">
                    <p className="font-['Effra',sans-serif] text-[13.5px] text-[#26282b] leading-[19px]">
                      I consent to Access Bank's use of my data.
                    </p>
                    <ToggleSwitch checked={dataConsent} onChange={setDataConsent} />
                  </div>
                  <button type="button" className="font-['Effra',sans-serif] text-[12.5px] font-medium text-[#003883] hover:underline">
                    Read personal data use consent
                  </button>
                </div>
              </motion.div>
            )}

            {sub === "identity" && (
              <motion.div key="identity" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <h2 className="font-['Effra',sans-serif] font-bold text-[20px] text-[#383838] mb-[6px]">Verify identity</h2>
                <p className="font-['Effra',sans-serif] text-[14px] text-[#707070] leading-[20px] mb-[20px]">
                  Choose an identification method and enter the customer's details. We'll run background checks
                  automatically once you continue.
                </p>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="bg-[#fdeaea] rounded-[14px] p-[16px] mb-[20px]">
                        <p className="font-['Effra',sans-serif] font-bold text-[13.5px] text-[#dc2626] mb-[4px]">{failureCopy[error].title}</p>
                        <p className="font-['Effra',sans-serif] text-[12.5px] text-[#a83232] leading-[18px]">{failureCopy[error].message}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <label className="font-['Effra',sans-serif] text-[12px] text-[#707070] mb-[6px] block">Identification method</label>
                <div className="flex gap-[8px] mb-[16px]">
                  {(["bvn", "nin"] as IdType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setIdType(t); setIdNumber(""); setError(null); }}
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
                  <FloatingField label="Date of birth" value={dob} onChange={setDob} type="date" />
                </div>
                <div className="mb-[16px]">
                  <FloatingField label="Customer email address" value={email} onChange={setEmail} type="email" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] p-[16px] z-20">
          <div className="max-w-[430px] mx-auto">
            {sub === "terms" && (
              <button onClick={submitTerms} disabled={!termsReady} className={`${ctaCls} ${termsReady ? ctaEnabled : ctaDisabled}`}>
                Continue
              </button>
            )}
            {sub === "identity" && (
              <button onClick={runCheck} disabled={!identityReady || checking} className={`${ctaCls} ${identityReady && !checking ? ctaEnabled : ctaDisabled}`}>
                {checking ? (
                  <span className="inline-flex items-center gap-[8px]">
                    <span className="w-[15px] h-[15px] border-[2px] border-white/40 border-t-white rounded-full animate-spin" />
                    Running background checks…
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
