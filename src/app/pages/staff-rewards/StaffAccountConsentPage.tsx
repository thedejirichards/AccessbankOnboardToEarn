import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, RoleBadge, cardCls, ctaCls, ctaEnabled, ctaDisabled, journeyLabels, pagePadXBtm, bottomBarCls, bottomBarInner, sectionTitle, sectionDesc } from "./StaffComponents";
import { clearDraft, patchDraft, type AccountCategory } from "./onboardingDraft";

type SubStep = "category" | "type" | "consent";

const categories: { id: AccountCategory; title: string; desc: string; disabled?: boolean }[] = [
  { id: "individual", title: "Individual", desc: "A personal account for a single customer." },
  { id: "sme", title: "SME", desc: "Business accounts for registered enterprises.", disabled: true },
];

const accountTypes = [
  { id: "diamondxtra", title: "DiamondXtra", desc: "Everyday savings account with flexible access and no minimum balance." },
];

export default function StaffAccountConsentPage() {
  const navigate = useNavigate();
  const [sub, setSub] = useState<SubStep>("category");
  const [selectedCategory, setSelectedCategory] = useState<AccountCategory | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => { clearDraft(); }, []);

  const goBack = () => {
    if (sub === "category") navigate("/staff-rewards");
    else if (sub === "type") setSub("category");
    else setSub("type");
  };

  const submitCategory = () => {
    if (!selectedCategory) return;
    patchDraft({ category: selectedCategory });
    setSub("type");
  };

  const submitType = () => {
    if (!selectedType) return;
    patchDraft({ accountType: selectedType });
    setSub("consent");
  };

  const acceptConsent = () => {
    patchDraft({ consentAccepted: true });
    navigate("/staff-rewards/terms-identity");
  };

  const declineConsent = () => {
    clearDraft();
    navigate("/staff-rewards");
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title="Account & Consent" onBack={goBack} />
        <StaffProgressTracker currentStep={1} totalSteps={4} labels={journeyLabels} />

        <div className={`flex-1 overflow-y-auto ${pagePadXBtm} pt-2`}>
          <AnimatePresence mode="wait">
            {sub === "category" && (
              <motion.div key="cat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <h2 className={`${sectionTitle} mb-1`}>What kind of account?</h2>
                <div className="mb-4"><RoleBadge role="staff" /></div>
                <p className={`${sectionDesc} mb-6`}>
                  Choose the account category for this customer.
                </p>
                <div className="flex flex-col gap-3">
                  {categories.map((c) => {
                    const active = selectedCategory === c.id;
                    return (
                      <motion.button
                        key={c.id}
                        whileTap={!c.disabled ? { scale: 0.98 } : undefined}
                        onClick={() => !c.disabled && setSelectedCategory(c.id)}
                        disabled={c.disabled}
                        className={`relative text-left px-4 md:px-5 py-4 rounded-2xl border-2 transition-all ${c.disabled ? "opacity-50 cursor-not-allowed border-[#e6e8ec] bg-[#f9fafb]" : active ? "border-[#003883] bg-[#ebf3ff] shadow-[0_0_0_4px_#ebf3ff]" : `border-[#e6e8ec] ${cardCls} hover:border-[#c9cdd4]`}`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-['Effra',sans-serif] font-bold text-[15px] md:text-base text-[#26282b]">{c.title}</p>
                          {c.disabled && (
                            <span className="font-['Effra',sans-serif] font-bold text-[9px] text-[#9ca3af] bg-[#eceef1] px-[8px] py-[3px] rounded-full">COMING SOON</span>
                          )}
                          {active && !c.disabled && (
                            <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, stiffness: 260 }} width="22" height="22" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" fill="#003883" />
                              <path d="M8 12.5l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>
                          )}
                        </div>
                        <p className="font-['Effra',sans-serif] text-xs md:text-sm text-[#9ca3af] mt-1 leading-tight">{c.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {sub === "type" && (
              <motion.div key="type" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <h2 className={`${sectionTitle} mb-1`}>Select an account type</h2>
                <div className="mb-4"><RoleBadge role="staff" /></div>
                <p className={`${sectionDesc} mb-6`}>
                  This determines the product the customer's account will be opened under.
                </p>
                <div className="flex flex-col gap-3">
                  {accountTypes.map((t) => {
                    const active = selectedType === t.id;
                    return (
                      <motion.button
                        key={t.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedType(t.id)}
                        className={`relative text-left px-4 md:px-5 py-4 rounded-2xl border-2 transition-all ${active ? "border-[#003883] bg-[#ebf3ff] shadow-[0_0_0_4px_#ebf3ff]" : `border-[#e6e8ec] ${cardCls} hover:border-[#c9cdd4]`}`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-['Effra',sans-serif] font-bold text-[15px] md:text-base text-[#26282b]">{t.title}</p>
                          {active && (
                            <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, stiffness: 260 }} width="22" height="22" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" fill="#003883" />
                              <path d="M8 12.5l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>
                          )}
                        </div>
                        <p className="font-['Effra',sans-serif] text-xs md:text-sm text-[#9ca3af] mt-1 leading-tight">{t.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {sub === "consent" && (
              <motion.div key="consent" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <h2 className={`${sectionTitle} mb-1`}>Before we begin</h2>
                <div className="mb-3"><RoleBadge role="customer" /></div>
                <p className={`${sectionDesc} mb-5`}>
                  Please read this to the customer and confirm they agree before continuing.
                </p>
                <div className={`${cardCls} p-4 md:p-5 leading-5 md:leading-6`}>
                  <p className="font-['Effra',sans-serif] font-bold text-sm md:text-[15px] text-[#26282b] mb-3">
                    Consent to open a DiamondXtra account with Onboard2Earn
                  </p>
                  <p className="font-['Effra',sans-serif] text-sm text-[#4b5563] mb-3">
                    By continuing, the customer agrees that:
                  </p>
                  <ul className="list-disc pl-5 flex flex-col gap-2">
                    {[
                      "Their BVN or NIN will be used to verify their identity with the relevant national registry.",
                      "A facial liveness scan will be captured to confirm they are physically present.",
                      "A verification email will be sent to their phone for secure confirmation.",
                      "Personal data (name, contact details, address, photo) will be captured and processed under the NDPA 2023 for account opening purposes only.",
                      "They may withdraw consent at any time before the account is created, with no obligation.",
                    ].map((line, i) => (
                      <li key={i} className="font-['Effra',sans-serif] text-xs md:text-sm text-[#4b5563] leading-5 md:leading-6">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={bottomBarCls}>
          <div className={bottomBarInner}>
            {sub === "category" && (
              <button onClick={submitCategory} disabled={!selectedCategory} className={`${ctaCls} ${selectedCategory ? ctaEnabled : ctaDisabled}`}>
                Continue
              </button>
            )}
            {sub === "type" && (
              <button onClick={submitType} disabled={!selectedType} className={`${ctaCls} ${selectedType ? ctaEnabled : ctaDisabled}`}>
                Continue
              </button>
            )}
            {sub === "consent" && (
              <>
                <button onClick={acceptConsent} className={`${ctaCls} ${ctaEnabled}`}>
                  Customer accepts
                </button>
                <button
                  onClick={declineConsent}
                  className="w-full bg-white border-2 border-[#e6e8ec] text-[#707070] font-['Effra',sans-serif] font-medium text-base py-4 rounded-[14px] hover:bg-[#f7f9fc] active:scale-[0.98] transition-all"
                >
                  Customer declines
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
