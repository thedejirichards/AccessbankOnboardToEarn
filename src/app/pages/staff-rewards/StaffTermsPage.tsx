import { useState } from "react";
import { useNavigate } from "react-router";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, ToggleSwitch, RadioOption, cardCls, ctaCls, ctaEnabled, ctaDisabled, journeyLabels } from "./StaffComponents";
import { patchDraft } from "./onboardingDraft";

export default function StaffTermsPage() {
  const navigate = useNavigate();
  const [cryptoAttestation, setCryptoAttestation] = useState(false);
  const [pep, setPep] = useState<"yes" | "no" | null>(null);
  const [resident, setResident] = useState<"yes" | "no" | null>("yes");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);

  const ready = cryptoAttestation && pep !== null && resident !== null && termsAccepted && dataConsent;

  const submit = () => {
    if (!ready) return;
    patchDraft({
      cryptoAttestation,
      politicallyExposed: pep === "yes",
      resident: resident === "yes",
      termsAccepted,
      dataConsent,
    });
    navigate("/staff-rewards/identity");
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title="Terms & Conditions" onBack={() => navigate("/staff-rewards/consent")} />
        <StaffProgressTracker currentStep={4} totalSteps={11} labels={journeyLabels} />

        <div className="flex-1 overflow-y-auto px-[24px] pt-[14px] pb-[120px]">
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
