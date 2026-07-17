import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, cardCls, ctaCls, ctaEnabled, ctaDisabled, journeyLabels } from "./StaffComponents";
import { patchDraft } from "./onboardingDraft";

const accountTypes = [
  { id: "diamondxtra", title: "DiamondXtra", desc: "Everyday savings account with flexible access and no minimum balance." },
];

export default function StaffAccountTypePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const submit = () => {
    if (!selected) return;
    patchDraft({ accountType: selected });
    navigate("/staff-rewards/consent");
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title="Account Type" onBack={() => navigate("/staff-rewards/category")} />
        <StaffProgressTracker currentStep={2} totalSteps={10} labels={journeyLabels} />

        <div className="flex-1 overflow-y-auto px-[24px] pt-[10px] pb-[120px]">
          <h2 className="font-['Effra',sans-serif] font-bold text-[20px] text-[#383838] mb-[6px]">Select an account type</h2>
          <p className="font-['Effra',sans-serif] text-[14px] text-[#707070] leading-[20px] mb-[24px]">
            This determines the product the customer's account will be opened under.
          </p>

          <div className="flex flex-col gap-[12px]">
            {accountTypes.map((t) => {
              const active = selected === t.id;
              return (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelected(t.id)}
                  className={`relative text-left px-[18px] py-[16px] rounded-[16px] border-2 transition-all ${active ? "border-[#003883] bg-[#ebf3ff] shadow-[0_0_0_4px_#ebf3ff]" : `border-[#e6e8ec] ${cardCls} hover:border-[#c9cdd4]`}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-['Effra',sans-serif] font-bold text-[15px] text-[#26282b]">{t.title}</p>
                    {active && (
                      <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, stiffness: 260 }} width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#003883" />
                        <path d="M8 12.5l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </div>
                  <p className="font-['Effra',sans-serif] text-[12.5px] text-[#9ca3af] mt-[4px] leading-tight">{t.desc}</p>
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
