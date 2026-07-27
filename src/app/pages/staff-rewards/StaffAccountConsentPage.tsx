import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, RoleBadge, FloatingField, FloatingSelect, cardCls, ctaCls, ctaEnabled, ctaDisabled, journeyLabels, pagePadXBtm, bottomBarCls, bottomBarInner, sectionTitle, sectionDesc } from "./StaffComponents";
import { clearDraft, patchDraft, type AccountCategory, type TermsDelivery } from "./onboardingDraft";

const termsDeliveryOptions: { value: TermsDelivery; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
];

const accountTypeOptions = ["Diamond Xtra"];

function ValidationPill({ valid, label }: { valid: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium font-['Effra',sans-serif] transition-colors ${valid ? "bg-[#e8f8ee] text-[#16753a]" : "bg-[#f5f6f7] text-[#9ca3af]"}`}>
      {valid ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12.5l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#d1d5db" strokeWidth="2" /></svg>
      )}
      {label}
    </span>
  );
}

const consentPoints = [
  "Their BVN or NIN will be used to verify their identity with the relevant national registry.",
  "A facial liveness scan will be captured to confirm they are physically present.",
  "A verification email will be sent to their phone for secure confirmation.",
  "The phone number collected will be used as an alternate account number.",
  "Personal data (name, contact details, address, photo) will be captured and processed under the NDPA 2023 for account opening purposes only.",
  "They may withdraw consent at any time before the account is created, with no obligation.",
];

export default function StaffAccountConsentPage() {
  const navigate = useNavigate();

  const [preferredName, setPreferredName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accountType, setAccountType] = useState(accountTypeOptions[0]);
  const [termsDelivery, setTermsDelivery] = useState<TermsDelivery[]>([]);
  const [consentRead, setConsentRead] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalViewed, setInfoModalViewed] = useState(false);
  const [infoExplained, setInfoExplained] = useState(false);

  useEffect(() => { clearDraft(); }, []);

  const goBack = () => navigate("/staff-rewards");

  const submitAndContinue = () => {
    if (!phone.trim() || termsDelivery.length === 0) return;
    patchDraft({
      preferredName: preferredName.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim(),
      termsDelivery,
      category: "individual" as AccountCategory,
      accountType: accountType.toLowerCase().replace(/\s+/g, ""),
      consentAccepted: true,
    });
    navigate("/staff-rewards/terms-identity");
  };

  const canContinue =
    phone.trim() !== "" &&
    accountType !== "" &&
    termsDelivery.length > 0 &&
    consentRead &&
    infoExplained;

  const toggleTermsDelivery = (value: TermsDelivery) => {
    setTermsDelivery((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title="Account & Consent" onBack={goBack} />
        <StaffProgressTracker currentStep={1} totalSteps={4} labels={journeyLabels} />

        <div className={`flex-1 overflow-y-auto ${pagePadXBtm} pt-2`}>
          <h2 className={`${sectionTitle} mb-1`}>Consent Invitation Details</h2>
          <div className="mb-4"><RoleBadge role="staff" /></div>
          <p className={`${sectionDesc} mb-5`}>
            Enter the customer's contact details to send a secure link for completing the required terms, declarations and privacy consent. The information entered on this screen is for communication purposes only and will not be used to determine the customer's official account name.
          </p>

          <div className="flex flex-col gap-4">
            <FloatingField
              label="Preferred Name for This Message"
              value={preferredName}
              onChange={setPreferredName}
            />
            <FloatingField
              label={<span>Phone Number <span className="text-[#dc2626]">*</span></span>}
              value={phone}
              onChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 11))}
              type="tel"
              inputMode="tel"
              maxLength={11}
            />
            <div>
              <FloatingField
                label="Email Address"
                value={email}
                onChange={setEmail}
                type="email"
                inputMode="email"
              />
              {email.trim().length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <ValidationPill valid={/^[^\s@]+$/.test(email)} label="Valid username" />
                  <ValidationPill valid={!/\s/.test(email) && !/[!#$%^&*()=+\[\]{};:'"<>?,/\\|`~]/.test(email)} label="No spaces/special chars" />
                  <ValidationPill valid={email.includes("@")} label="Includes @" />
                  <ValidationPill valid={/^[^\s@]+@([^\s@]+\.)+[^\s@]{2,}$/.test(email)} label="Valid domain e.g. gmail" />
                  <ValidationPill valid={/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)} label="Valid extension e.g. .com" />
                  <ValidationPill valid={email.length <= 320} label="Max 320 characters" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <p className="font-['Effra',sans-serif] font-semibold text-sm text-[#26282b] mb-3">
              How should we send the terms & conditions?
            </p>
            <div className={`${cardCls} p-4 flex flex-col`}>
              {termsDeliveryOptions.map((opt) => {
                const checked = termsDelivery.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleTermsDelivery(opt.value)}
                    className="flex items-center gap-[10px] py-[7px]"
                  >
                    <span className={`w-[20px] h-[20px] rounded-[6px] border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? "border-[#003883] bg-[#003883]" : "border-[#c9cdd4]"}`}>
                      {checked && (
                        <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, stiffness: 260 }} width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      )}
                    </span>
                    <span className="font-['Effra',sans-serif] text-[14px] text-[#26282b]">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <p className="font-['Effra',sans-serif] font-semibold text-sm text-[#26282b] mb-3">
              Account type
            </p>
            <FloatingSelect
              label="Account Type"
              value={accountType}
              onChange={setAccountType}
              options={accountTypeOptions}
            />
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowInfoModal(true)}
              className="font-['Effra',sans-serif] font-semibold text-sm text-[#003883] hover:underline mb-3"
            >
              Why we need this information
            </button>

            <button
              type="button"
              onClick={() => { if (infoModalViewed) setInfoExplained((prev) => !prev); }}
              className={`flex items-start gap-[10px] w-full text-left mb-4 ${!infoModalViewed ? "opacity-40 cursor-not-allowed" : ""}`}
              disabled={!infoModalViewed}
            >
              <span className={`w-[20px] h-[20px] rounded-[6px] border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${infoExplained ? "border-[#003883] bg-[#003883]" : "border-[#c9cdd4]"}`}>
                {infoExplained && (
                  <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, stiffness: 260 }} width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                )}
              </span>
              <span className="font-['Effra',sans-serif] text-xs md:text-sm text-[#4b5563] leading-5 md:leading-6">
                I have explained the purpose of collecting this information to the customer and confirmed that the selected phone number or email address belongs to the customer.
              </span>
            </button>

            <div className={`${cardCls} p-4 md:p-5 leading-5 md:leading-6`}>
              <p className="font-['Effra',sans-serif] font-extrabold text-sm md:text-base text-[#26282b] mb-1">
                Before we begin
              </p>
              <p className="font-['Effra',sans-serif] text-xs text-[#707070] mb-3">
                Please read this to the customer.
              </p>

              <p className="font-['Effra',sans-serif] text-sm text-[#4b5563] mb-3">
                By continuing, the customer agrees that:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-2 mb-4">
                {consentPoints.map((line, i) => (
                  <li key={i} className="font-['Effra',sans-serif] text-xs md:text-sm text-[#4b5563] leading-5 md:leading-6">
                    {line}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setConsentRead((prev) => !prev)}
                className="flex items-start gap-[10px] w-full text-left"
              >
                <span className={`w-[20px] h-[20px] rounded-[6px] border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${consentRead ? "border-[#003883] bg-[#003883]" : "border-[#c9cdd4]"}`}>
                  {consentRead && (
                    <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, stiffness: 260 }} width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </span>
                <span className="font-['Effra',sans-serif] text-xs md:text-sm text-[#4b5563] leading-5 md:leading-6">
                  I have read the above to the customer and they understand
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Info modal */}
        {showInfoModal && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowInfoModal(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative bg-white rounded-t-2xl p-5 md:p-6 w-full shadow-[0_-10px_40px_rgba(0,0,0,0.15)]"
            >
              <div className="w-10 h-1 bg-[#d1d5db] rounded-full mx-auto mb-4" />
              <p className="font-['Effra',sans-serif] font-bold text-base text-[#26282b] mb-3">
                Why we need this information
              </p>
              <ul className="flex flex-col gap-3 mb-5">
                <li className="font-['Effra',sans-serif] text-sm text-[#4b5563] leading-6">
                  The name and contact details entered on this screen will only be used to personalise and send the customer a secure consent link.
                </li>
                <li className="font-['Effra',sans-serif] text-sm text-[#4b5563] leading-6">
                  These details will not be used to create the account or determine the customer's official account name. The account will be created using the customer's identity details as verified from their BVN or NIN.
                </li>
                <li className="font-['Effra',sans-serif] text-sm text-[#4b5563] leading-6">
                  The customer will be shown the verified name before the account is created.
                </li>
              </ul>
              <button
                onClick={() => { setShowInfoModal(false); setInfoModalViewed(true); }}
                className={`w-full ${ctaCls} ${ctaEnabled}`}
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}

        <div className={bottomBarCls}>
          <div className={bottomBarInner}>
            <button onClick={submitAndContinue} disabled={!canContinue} className={`${ctaCls} ${canContinue ? ctaEnabled : ctaDisabled}`}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
