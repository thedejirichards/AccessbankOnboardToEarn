import { useNavigate } from "react-router";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, cardCls, ctaCls, ctaEnabled, journeyLabels } from "./StaffComponents";
import { patchDraft, clearDraft } from "./onboardingDraft";

export default function StaffConsentPage() {
  const navigate = useNavigate();

  const accept = () => {
    patchDraft({ consentAccepted: true });
    navigate("/staff-rewards/identity");
  };

  const decline = () => {
    clearDraft();
    navigate("/staff-rewards");
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title="Customer Consent" onBack={() => navigate("/staff-rewards/account-type")} />
        <StaffProgressTracker currentStep={3} totalSteps={10} labels={journeyLabels} />

        <div className="flex-1 overflow-y-auto px-[24px] pt-[10px] pb-[120px]">
          <h2 className="font-['Effra',sans-serif] font-bold text-[20px] text-[#383838] mb-[6px]">Before we begin</h2>
          <p className="font-['Effra',sans-serif] text-[14px] text-[#707070] leading-[20px] mb-[20px]">
            Please read this to the customer and confirm they agree before continuing.
          </p>

          <div className={`${cardCls} p-[18px] leading-[20px]`}>
            <p className="font-['Effra',sans-serif] font-bold text-[13.5px] text-[#26282b] mb-[10px]">
              Consent to open a DiamondXtra account with Onboard2Earn
            </p>
            <p className="font-['Effra',sans-serif] text-[13px] text-[#4b5563] mb-[10px]">
              By continuing, the customer agrees that:
            </p>
            <ul className="list-disc pl-[18px] flex flex-col gap-[8px]">
              {[
                "Their BVN or NIN will be used to verify their identity with the relevant national registry.",
                "A facial liveness scan will be captured to confirm they are physically present.",
                "Personal data (name, contact details, address, signature, photo) will be captured and processed under the NDPA 2023 for account opening purposes only.",
                "They may withdraw consent at any time before the account is created, with no obligation.",
              ].map((line, i) => (
                <li key={i} className="font-['Effra',sans-serif] text-[12.5px] text-[#4b5563] leading-[18px]">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] p-[16px] z-20">
          <div className="max-w-[430px] mx-auto flex flex-col gap-[10px]">
            <button onClick={accept} className={`${ctaCls} ${ctaEnabled}`}>
              Customer accepts
            </button>
            <button
              onClick={decline}
              className="w-full bg-white border-2 border-[#e6e8ec] text-[#707070] font-['Effra',sans-serif] font-medium text-[16px] py-[16px] rounded-[14px] hover:bg-[#f7f9fc] active:scale-[0.98] transition-all"
            >
              Customer declines
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
