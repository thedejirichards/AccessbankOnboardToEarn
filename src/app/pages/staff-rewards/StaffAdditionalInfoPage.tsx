import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import MobileLayout from "../../components/MobileLayout";
import SignatureModal from "../../components/SignatureModal";
import { StaffHeader, StaffProgressTracker, FloatingField, FloatingSelect, ctaCls, ctaEnabled, ctaDisabled, journeyLabels } from "./StaffComponents";
import { getDraft, patchDraft, type RelationshipOfficer } from "./onboardingDraft";
import { nigerianStates, lgasByState } from "./nigeriaLocations";

const roPool: RelationshipOfficer[] = [
  { name: "Adaeze Nwankwo", email: "adaeze.nwankwo@accessbankplc.com", phone: "0803 210 4471" },
  { name: "Femi Adisa", email: "femi.adisa@accessbankplc.com", phone: "0805 662 9013" },
  { name: "Grace Okon", email: "grace.okon@accessbankplc.com", phone: "0701 348 8820" },
];

function generateAccountNumber(): string {
  let n = "";
  for (let i = 0; i < 10; i++) n += Math.floor(Math.random() * 10);
  return n;
}

export default function StaffAdditionalInfoPage() {
  const navigate = useNavigate();
  const draft = getDraft();
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [street, setStreet] = useState("");
  const lgaOptions = state ? lgasByState[state] || [] : [];

  const selectState = (v: string) => {
    setState(v);
    setLga("");
  };
  const [signature, setSignature] = useState<string | null>(null);
  const [sigOpen, setSigOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const ready = state.trim().length > 1 && lga.trim().length > 1 && street.trim().length > 4 && signature !== null;

  const submit = () => {
    if (!ready || creating) return;
    setCreating(true);
    setTimeout(() => {
      const ro = roPool[Math.floor(Math.random() * roPool.length)];
      patchDraft({
        state,
        lga,
        street,
        signature: signature || "",
        accountNumber: generateAccountNumber(),
        ro,
      });
      navigate("/staff-rewards/success");
    }, 1500);
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title="Additional Information" onBack={() => navigate("/staff-rewards/review")} />
        <StaffProgressTracker currentStep={9} totalSteps={10} labels={journeyLabels} />

        <div className="flex-1 overflow-y-auto px-[24px] pt-[10px] pb-[120px]">
          <div className="flex justify-center mb-[20px]">
            <div className="text-center">
              <div className="w-[86px] h-[86px] rounded-full overflow-hidden border-4 border-white shadow-[0_8px_20px_rgba(16,24,40,0.14)] bg-[#ebf3ff] flex items-center justify-center mx-auto">
                {draft.livenessFaceImage ? (
                  <img src={draft.livenessFaceImage} alt="Passport" className="w-full h-full object-cover" />
                ) : (
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="9" r="3.4" stroke="#003883" strokeWidth="1.6" />
                    <path d="M5 20a7 7 0 0114 0" stroke="#003883" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <p className="font-['Effra',sans-serif] text-[11px] text-[#9ca3af] mt-[6px]">Passport photo — from liveness scan</p>
            </div>
          </div>

          <div className="mb-[16px]">
            <FloatingSelect label="State" value={state} onChange={selectState} options={nigerianStates} />
          </div>
          <div className="mb-[16px]">
            <FloatingSelect
              label="LGA"
              value={lga}
              onChange={setLga}
              options={lgaOptions}
              disabled={!state}
              hint={!state ? "Select a state first" : undefined}
            />
          </div>
          <div className="mb-[16px]">
            <FloatingField label="Street address" value={street} onChange={setStreet} />
          </div>

          <p className="font-['Effra',sans-serif] font-bold text-[13px] text-[#383838] mb-[8px]">Customer signature</p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setSigOpen(true)}
            className={`relative w-full flex flex-col items-center justify-center gap-[8px] h-[110px] rounded-[14px] border-2 overflow-hidden transition-all ${signature ? "border-[#16a34a] bg-white shadow-[0_0_0_4px_rgba(22,163,74,0.10)]" : "border-dashed border-[#cbd5e1] hover:border-[#94a3b8]"}`}
          >
            {signature ? (
              <>
                <img src={signature} alt="Customer signature" className="absolute inset-0 w-full h-full object-contain p-[8px]" />
                <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, stiffness: 260 }} className="absolute top-[6px] right-[6px]" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12.5l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
                <span className="absolute bottom-[6px] font-['Effra',sans-serif] font-medium text-[11px] text-[#16a34a]">Tap to redo</span>
              </>
            ) : (
              <>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M4 17c3-1 4-6 6-6s2 4 4 4 3-6 6-6" stroke="#64748b" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span className="font-['Effra',sans-serif] text-[12px] text-[#383838]">Capture signature</span>
              </>
            )}
          </motion.button>
        </div>

        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] p-[16px] z-20">
          <div className="max-w-[430px] mx-auto">
            <button onClick={submit} disabled={!ready || creating} className={`${ctaCls} ${ready && !creating ? ctaEnabled : ctaDisabled}`}>
              {creating ? "Creating account…" : "Create account"}
            </button>
          </div>
        </div>

        <SignatureModal isOpen={sigOpen} onClose={() => setSigOpen(false)} onSave={(sig) => { setSignature(sig); setSigOpen(false); }} />
      </div>
    </MobileLayout>
  );
}
