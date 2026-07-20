import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, FloatingField, RoleBadge, StatusChip, CheckDraw, ConfettiBurst, cardCls, ctaCls, ctaEnabled, ctaDisabled, journeyLabels, bottomBarCls, bottomBarInner, sectionTitle, sectionDesc } from "./StaffComponents";
import BottomSheetSelector from "../../components/BottomSheetSelector";
import { getDraft, patchDraft, clearDraft, type RelationshipOfficer } from "./onboardingDraft";
import { nigerianStates, lgasByState } from "./nigeriaLocations";

type SubStep = "info" | "success";

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

export default function StaffCompletePage() {
  const navigate = useNavigate();
  const draft = getDraft();

  const [sub, setSub] = useState<SubStep>("info");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [street, setStreet] = useState("");
  const lgaOptions = state ? lgasByState[state] || [] : [];
  const selectState = (v: string) => { setState(v); setLga(""); };
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const ready = state.trim().length > 1 && lga.trim().length > 1 && street.trim().length > 4;

  const goBack = () => {
    if (sub === "info") navigate("/staff-rewards/verification");
  };

  const submit = () => {
    if (!ready || creating) return;
    setCreating(true);
    setTimeout(() => {
      const ro = roPool[Math.floor(Math.random() * roPool.length)];
      patchDraft({ state, lga, street, accountNumber: generateAccountNumber(), ro });
      setCreating(false);
      setSub("success");
    }, 1500);
  };

  const fullName = draft.profile ? `${draft.profile.firstName} ${draft.profile.lastName}` : "The customer";
  const accountNumber = draft.accountNumber || "—";
  const phone = draft.phone || "—";

  const copyAccountNumber = async () => {
    try { await navigator.clipboard.writeText(accountNumber); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* no-op */ }
  };

  const shareAccountDetails = async () => {
    const text = `${fullName}'s DiamondXtra account\nAccount number: ${accountNumber}\nAlternate (phone): ${phone}`;
    if (navigator.share) { try { await navigator.share({ text }); return; } catch { /* fall through */ } }
    copyAccountNumber();
  };

  const downloadDetails = () => {
    const lines = [
      `Onboard2Earn — Account Opened`,
      `Customer: ${fullName}`,
      `Account number: ${accountNumber}`,
      `Alternate number: ${phone}`,
      `Account type: DiamondXtra (Individual)`,
      `Email: ${draft.email || "—"} (verified)`,
      draft.ro ? `Relationship Officer: ${draft.ro.name} — ${draft.ro.email} — ${draft.ro.phone}` : "",
    ].filter(Boolean);
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `account-${accountNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onboardAnother = () => {
    clearDraft();
    navigate("/staff-rewards/account");
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col relative">
        {sub === "success" && <ConfettiBurst />}
        {sub === "info" && <StaffHeader title="Address & Create" onBack={goBack} />}
        {sub === "info" && <StaffProgressTracker currentStep={4} totalSteps={4} labels={journeyLabels} />}

        <div className={`flex-1 overflow-y-auto px-5 md:px-8 pt-2 pb-6 ${sub === "success" ? "pt-10 flex flex-col items-center" : ""}`}>
          <AnimatePresence mode="wait">
            {sub === "info" && (
              <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <h2 className={`${sectionTitle} mb-1`}>Residential address</h2>
                <div className="mb-3"><RoleBadge role="staff" /></div>
                <p className={`${sectionDesc} mb-5`}>
                  Enter the customer's residential address to complete the account setup.
                </p>

                <div className="mb-4">
                  <BottomSheetSelector label="State" value={state} onChange={selectState} options={nigerianStates} sheetTitle="Select State" />
                </div>
                <div className="mb-4">
                  <BottomSheetSelector label="LGA" value={lga} onChange={setLga} options={lgaOptions} disabled={!state} hint={!state ? "Select a state first" : undefined} sheetTitle="Select LGA" />
                </div>
                <div className="mb-4">
                  <FloatingField label="Street address" value={street} onChange={setStreet} />
                </div>
              </motion.div>
            )}

            {sub === "success" && (
              <motion.div key="success" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full">
                <div className="mb-5 flex justify-center">
                  <CheckDraw size={80} />
                </div>
                <h2 className={`${sectionTitle} text-center mb-1`}>Account created</h2>
                <p className="font-['Effra',sans-serif] text-sm md:text-[15px] text-[#707070] text-center leading-5 md:leading-6 mb-4 max-w-xs mx-auto">
                  {fullName}'s DiamondXtra account is ready.
                </p>

                <div className="flex items-center justify-center gap-2 mb-5">
                  <StatusChip label="Awaiting activation" tone="amber" />
                </div>

                {/* Account number card */}
                <div className={`${cardCls} w-full p-5 mb-4`}>
                  <p className="font-['Effra',sans-serif] text-xs text-[#9ca3af] mb-0.5">Account number</p>
                  <p className="font-['Effra',sans-serif] font-bold text-2xl md:text-3xl text-[#003883] tracking-wide mb-3">{accountNumber}</p>
                  <div className="flex gap-2.5">
                    <button onClick={copyAccountNumber} className="flex-1 flex items-center justify-center gap-1.5 bg-[#f4f6f8] hover:bg-[#eceef1] rounded-xl py-2.5 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="12" height="12" rx="2" stroke="#003883" strokeWidth="1.7" /><path d="M4 16V6a2 2 0 012-2h10" stroke="#003883" strokeWidth="1.7" /></svg>
                      <span className="font-['Effra',sans-serif] font-medium text-xs md:text-sm text-[#003883]">{copied ? "Copied!" : "Copy"}</span>
                    </button>
                    <button onClick={shareAccountDetails} className="flex-1 flex items-center justify-center gap-1.5 bg-[#f4f6f8] hover:bg-[#eceef1] rounded-xl py-2.5 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="2.4" stroke="#003883" strokeWidth="1.6" /><circle cx="6" cy="12" r="2.4" stroke="#003883" strokeWidth="1.6" /><circle cx="18" cy="19" r="2.4" stroke="#003883" strokeWidth="1.6" /><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" stroke="#003883" strokeWidth="1.6" /></svg>
                      <span className="font-['Effra',sans-serif] font-medium text-xs md:text-sm text-[#003883]">Share</span>
                    </button>
                    <button onClick={downloadDetails} className="flex-1 flex items-center justify-center gap-1.5 bg-[#f4f6f8] hover:bg-[#eceef1] rounded-xl py-2.5 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 4v11m0 0l-4-4m4 4l4-4" stroke="#003883" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 19h14" stroke="#003883" strokeWidth="1.7" strokeLinecap="round" /></svg>
                      <span className="font-['Effra',sans-serif] font-medium text-xs md:text-sm text-[#003883]">Download</span>
                    </button>
                  </div>
                </div>

                {/* Alternate account number */}
                <div className={`${cardCls} w-full p-4 mb-4`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#fff8f1] flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="5" y="1" width="14" height="22" rx="3" stroke="#FF8200" strokeWidth="1.7" />
                        <circle cx="12" cy="19" r="1.5" fill="#FF8200" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Effra',sans-serif] text-xs text-[#9ca3af]">Alternate account number</p>
                      <p className="font-['Effra',sans-serif] font-bold text-[15px] md:text-base text-[#26282b]">{phone}</p>
                    </div>
                  </div>
                </div>

                {/* Verified email contact */}
                <div className={`${cardCls} w-full p-4 mb-4`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#e8f8ee] flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="4" width="20" height="16" rx="3" stroke="#16a34a" strokeWidth="1.7" />
                        <path d="M2 7l10 6 10-6" stroke="#16a34a" strokeWidth="1.7" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-['Effra',sans-serif] text-xs text-[#9ca3af]">Verified email</p>
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#e8f8ee]">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12.5l2.5 2.5L16 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          <span className="font-['Effra',sans-serif] font-semibold text-[9px] text-[#16753a] uppercase">Verified</span>
                        </span>
                      </div>
                      <p className="font-['Effra',sans-serif] font-medium text-sm md:text-[15px] text-[#26282b] truncate">{draft.email || "—"}</p>
                    </div>
                  </div>
                </div>

                {draft.ro && (
                  <div className={`${cardCls} w-full p-4 mb-4 flex items-center gap-3`}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-['Effra',sans-serif] font-bold text-white text-sm" style={{ background: "linear-gradient(135deg,#5b8def,#003883)" }}>
                      {draft.ro.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Effra',sans-serif] text-[10.5px] text-[#9ca3af]">Relationship Officer</p>
                      <p className="font-['Effra',sans-serif] font-bold text-sm text-[#26282b] leading-tight">{draft.ro.name}</p>
                      <p className="font-['Effra',sans-serif] text-xs text-[#707070] leading-tight truncate">{draft.ro.email} · {draft.ro.phone}</p>
                    </div>
                  </div>
                )}

                {/* AccessMore registration instructions */}
                <div className="w-full bg-[#ebf3ff] rounded-2xl p-4 md:p-5 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-['Effra',sans-serif] font-bold text-sm md:text-[15px] text-[#003883]">Next: Register on AccessMore</p>
                    <RoleBadge role="customer" />
                  </div>
                  <p className="font-['Effra',sans-serif] text-xs md:text-sm text-[#4b5563] leading-5 md:leading-6 mb-3">
                    The customer should complete these steps on their phone:
                  </p>
                  <ol className="list-decimal pl-5 flex flex-col gap-1.5 mb-3">
                    {[
                      "Download the AccessMore app from the App Store or Google Play.",
                      "Open the app and select \"Register as existing customer\".",
                      "Enter the account number or phone number shown above.",
                      "Set a PIN and complete activation.",
                      "Start transacting — first qualifying transaction earns +30 pts for you.",
                    ].map((step, i) => (
                      <li key={i} className="font-['Effra',sans-serif] text-xs md:text-sm text-[#4b5563] leading-5 md:leading-6">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 220, delay: 0.4 }}
                  className="w-full bg-[#fff8f1] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_8px_24px_rgba(255,130,0,0.14)]"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-[0_5px_12px_rgba(255,130,0,0.35)]" style={{ background: "linear-gradient(135deg,#ffb03b,#FF8200)" }}>
                    <span className="font-['Effra',sans-serif] font-bold text-sm text-white">+5</span>
                  </div>
                  <p className="font-['Effra',sans-serif] text-sm text-[#8a5a12] leading-5 md:leading-6">
                    <span className="font-bold">+5 pts (provisional)</span><br />Finalises when the customer activates on AccessMore.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {sub === "info" && (
          <div className={bottomBarCls}>
            <div className={bottomBarInner}>
              <button onClick={submit} disabled={!ready || creating} className={`${ctaCls} ${ready && !creating ? ctaEnabled : ctaDisabled}`}>
                {creating ? "Creating account…" : "Create account"}
              </button>
            </div>
          </div>
        )}

        {sub === "success" && (
          <div className="p-4 flex flex-col gap-3">
            <button onClick={() => navigate("/rewards")} className={`${ctaCls} ${ctaEnabled}`}>
              View my leaderboard
            </button>
            <button onClick={onboardAnother} className="w-full bg-white border-2 border-[#003883] text-[#003883] font-['Effra',sans-serif] font-medium text-base py-4 rounded-[14px] hover:bg-[#f0f7ff] active:scale-[0.98] transition-all">
              Onboard another customer
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
