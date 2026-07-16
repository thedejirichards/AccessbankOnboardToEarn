import { useNavigate } from "react-router";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, cardCls, ctaCls, ctaEnabled, journeyLabels } from "./StaffComponents";
import { getDraft, clearDraft } from "./onboardingDraft";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-[11px]">
      <span className="font-['Effra',sans-serif] text-[13px] text-[#9ca3af]">{label}</span>
      <span className="font-['Effra',sans-serif] font-medium text-[13.5px] text-[#26282b]">{value}</span>
    </div>
  );
}

export default function StaffReviewPage() {
  const navigate = useNavigate();
  const draft = getDraft();
  const profile = draft.profile;
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : "—";

  const cancel = () => {
    clearDraft();
    navigate("/staff-rewards");
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title="Review Profile" onBack={() => navigate("/staff-rewards/otp")} />
        <StaffProgressTracker currentStep={9} totalSteps={11} labels={journeyLabels} />

        <div className="flex-1 overflow-y-auto px-[24px] pt-[10px] pb-[120px]">
          <h2 className="font-['Effra',sans-serif] font-bold text-[20px] text-[#383838] mb-[6px]">Confirm this is correct</h2>
          <p className="font-['Effra',sans-serif] text-[14px] text-[#707070] leading-[20px] mb-[20px]">
            This is what we retrieved from the {(draft.idType || "bvn").toUpperCase()} record. Ask the customer to confirm.
          </p>

          <div className="flex justify-center mb-[20px]">
            <div className="w-[86px] h-[86px] rounded-full overflow-hidden border-4 border-white shadow-[0_8px_20px_rgba(16,24,40,0.14)] bg-[#ebf3ff] flex items-center justify-center">
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

          <div className={`${cardCls} px-[18px] divide-y divide-[#f4f5f7]`}>
            <Row label="Full name" value={fullName} />
            <Row label="Date of birth" value={profile?.dob || "—"} />
            <Row label="Gender" value={profile?.gender || "—"} />
            <Row label={(draft.idType || "bvn").toUpperCase()} value={draft.idNumber || "—"} />
            <Row label="Phone" value={draft.phone || "—"} />
            <Row label="Email" value={draft.email || "—"} />
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] p-[16px] z-20">
          <div className="max-w-[430px] mx-auto flex flex-col gap-[10px]">
            <button onClick={() => navigate("/staff-rewards/additional-info")} className={`${ctaCls} ${ctaEnabled}`}>
              This is correct
            </button>
            <button
              onClick={cancel}
              className="w-full bg-white border-2 border-[#e6e8ec] text-[#707070] font-['Effra',sans-serif] font-medium text-[16px] py-[16px] rounded-[14px] hover:bg-[#f7f9fc] active:scale-[0.98] transition-all"
            >
              Information is incorrect — cancel
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
