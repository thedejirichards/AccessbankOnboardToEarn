import { useState } from "react";
import { useNavigate } from "react-router";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, FloatingField, ctaCls, ctaEnabled, ctaDisabled, journeyLabels } from "./StaffComponents";
import { patchDraft, type IdType } from "./onboardingDraft";

export default function StaffIdentityPage() {
  const navigate = useNavigate();
  const [idType, setIdType] = useState<IdType>("bvn");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const ready = idNumber.length === 11 && phone.trim().length >= 11 && emailValid;

  const submit = () => {
    if (!ready) return;
    patchDraft({ idType, idNumber, phone, email });
    navigate("/staff-rewards/validating");
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title="Identity Verification" onBack={() => navigate("/staff-rewards/consent")} />
        <StaffProgressTracker currentStep={5} totalSteps={11} labels={journeyLabels} />

        <div className="flex-1 overflow-y-auto px-[24px] pt-[10px] pb-[120px]">
          <h2 className="font-['Effra',sans-serif] font-bold text-[20px] text-[#383838] mb-[6px]">Verify identity</h2>
          <p className="font-['Effra',sans-serif] text-[14px] text-[#707070] leading-[20px] mb-[24px]">
            Choose an identification method and enter the customer's details.
          </p>

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
              label="Customer phone number"
              value={phone}
              onChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 11))}
              inputMode="numeric"
              maxLength={11}
              hint="Used to deliver the OTP later in this journey"
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
            <button onClick={submit} disabled={!ready} className={`${ctaCls} ${ready ? ctaEnabled : ctaDisabled}`}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
