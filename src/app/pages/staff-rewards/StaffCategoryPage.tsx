import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, cardCls, ctaCls, ctaEnabled, ctaDisabled, journeyLabels } from "./StaffComponents";
import { clearDraft, patchDraft, type AccountCategory } from "./onboardingDraft";

const categories: { id: AccountCategory; title: string; desc: string; disabled?: boolean }[] = [
  { id: "individual", title: "Individual", desc: "A personal account for a single customer." },
  { id: "sme", title: "SME", desc: "Business accounts for registered enterprises.", disabled: true },
];

export default function StaffCategoryPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<AccountCategory | null>(null);

  useEffect(() => { clearDraft(); }, []);

  const submit = () => {
    if (!selected) return;
    patchDraft({ category: selected });
    navigate("/staff-rewards/account-type");
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title="Account Category" onBack={() => navigate("/staff-rewards")} />
        <StaffProgressTracker currentStep={1} totalSteps={10} labels={journeyLabels} />

        <div className="flex-1 overflow-y-auto px-[24px] pt-[10px] pb-[120px]">
          <h2 className="font-['Effra',sans-serif] font-bold text-[20px] text-[#383838] mb-[6px]">What kind of account?</h2>
          <p className="font-['Effra',sans-serif] text-[14px] text-[#707070] leading-[20px] mb-[24px]">
            Choose the account category for this customer.
          </p>

          <div className="flex flex-col gap-[12px]">
            {categories.map((c) => {
              const active = selected === c.id;
              return (
                <motion.button
                  key={c.id}
                  whileTap={!c.disabled ? { scale: 0.98 } : undefined}
                  onClick={() => !c.disabled && setSelected(c.id)}
                  disabled={c.disabled}
                  className={`relative text-left px-[18px] py-[16px] rounded-[16px] border-2 transition-all ${c.disabled ? "opacity-50 cursor-not-allowed border-[#e6e8ec] bg-[#f9fafb]" : active ? "border-[#003883] bg-[#ebf3ff] shadow-[0_0_0_4px_#ebf3ff]" : `border-[#e6e8ec] ${cardCls} hover:border-[#c9cdd4]`}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-['Effra',sans-serif] font-bold text-[15px] text-[#26282b]">{c.title}</p>
                    {c.disabled && (
                      <span className="font-['Effra',sans-serif] font-bold text-[9px] text-[#9ca3af] bg-[#eceef1] px-[8px] py-[3px] rounded-full">
                        COMING SOON
                      </span>
                    )}
                    {active && !c.disabled && (
                      <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, stiffness: 260 }} width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#003883" />
                        <path d="M8 12.5l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </div>
                  <p className="font-['Effra',sans-serif] text-[12.5px] text-[#9ca3af] mt-[4px] leading-tight">{c.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] p-[16px] z-20">
          <div className="max-w-[430px] mx-auto">
            <button onClick={submit} disabled={!selected} className={`${ctaCls} ${selected ? ctaEnabled : ctaDisabled}`}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
