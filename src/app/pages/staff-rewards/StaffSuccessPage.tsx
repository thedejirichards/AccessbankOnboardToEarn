import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import MobileLayout from "../../components/MobileLayout";
import { StatusChip, CheckDraw, ConfettiBurst, cardCls, ctaCls, ctaEnabled } from "./StaffComponents";
import { getDraft, clearDraft } from "./onboardingDraft";

export default function StaffSuccessPage() {
  const navigate = useNavigate();
  const draft = getDraft();
  const [copied, setCopied] = useState(false);

  const fullName = draft.profile ? `${draft.profile.firstName} ${draft.profile.lastName}` : "The customer";
  const accountNumber = draft.accountNumber || "—";

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  const shareAccountDetails = async () => {
    const text = `${fullName}'s Onboard2Earn DiamondXtra account\nAccount number: ${accountNumber}`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        /* user cancelled or share unsupported — fall through to clipboard */
      }
    }
    copyAccountNumber();
  };

  const downloadDetails = () => {
    const lines = [
      `Onboard2Earn — Account Opened`,
      `Customer: ${fullName}`,
      `Account number: ${accountNumber}`,
      `Account type: DiamondXtra (Individual)`,
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
    navigate("/staff-rewards/auth");
  };

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col relative">
        <ConfettiBurst />
        <div className="flex-1 overflow-y-auto px-[24px] pt-[40px] pb-[24px] flex flex-col items-center">
          <div className="mb-[18px]">
            <CheckDraw size={76} />
          </div>
          <h2 className="font-['Effra',sans-serif] font-bold text-[20px] text-[#383838] text-center mb-[6px]">Account created</h2>
          <p className="font-['Effra',sans-serif] text-[13.5px] text-[#707070] text-center leading-[19px] mb-[16px] max-w-[300px]">
            {fullName}'s DiamondXtra account is ready.
          </p>

          <div className="flex items-center gap-[8px] mb-[18px]">
            <StatusChip label="Awaiting activation" tone="amber" />
          </div>

          {/* Account details card */}
          <div className={`${cardCls} w-full p-[18px] mb-[14px]`}>
            <p className="font-['Effra',sans-serif] text-[11px] text-[#9ca3af] mb-[2px]">Account number</p>
            <p className="font-['Effra',sans-serif] font-bold text-[24px] text-[#003883] tracking-wide mb-[12px]">{accountNumber}</p>
            <div className="flex gap-[10px]">
              <button
                onClick={copyAccountNumber}
                className="flex-1 flex items-center justify-center gap-[6px] bg-[#f4f6f8] hover:bg-[#eceef1] rounded-[10px] py-[10px] transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="12" height="12" rx="2" stroke="#003883" strokeWidth="1.7" /><path d="M4 16V6a2 2 0 012-2h10" stroke="#003883" strokeWidth="1.7" /></svg>
                <span className="font-['Effra',sans-serif] font-medium text-[12.5px] text-[#003883]">{copied ? "Copied!" : "Copy"}</span>
              </button>
              <button
                onClick={shareAccountDetails}
                className="flex-1 flex items-center justify-center gap-[6px] bg-[#f4f6f8] hover:bg-[#eceef1] rounded-[10px] py-[10px] transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="2.4" stroke="#003883" strokeWidth="1.6" /><circle cx="6" cy="12" r="2.4" stroke="#003883" strokeWidth="1.6" /><circle cx="18" cy="19" r="2.4" stroke="#003883" strokeWidth="1.6" /><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" stroke="#003883" strokeWidth="1.6" /></svg>
                <span className="font-['Effra',sans-serif] font-medium text-[12.5px] text-[#003883]">Share</span>
              </button>
              <button
                onClick={downloadDetails}
                className="flex-1 flex items-center justify-center gap-[6px] bg-[#f4f6f8] hover:bg-[#eceef1] rounded-[10px] py-[10px] transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 4v11m0 0l-4-4m4 4l4-4" stroke="#003883" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 19h14" stroke="#003883" strokeWidth="1.7" strokeLinecap="round" /></svg>
                <span className="font-['Effra',sans-serif] font-medium text-[12.5px] text-[#003883]">Download</span>
              </button>
            </div>
          </div>

          {/* Relationship officer */}
          {draft.ro && (
            <div className={`${cardCls} w-full p-[16px] mb-[14px] flex items-center gap-[12px]`}>
              <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center shrink-0 font-['Effra',sans-serif] font-bold text-white text-[14px]" style={{ background: "linear-gradient(135deg,#5b8def,#003883)" }}>
                {draft.ro.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Effra',sans-serif] text-[10.5px] text-[#9ca3af]">Relationship Officer</p>
                <p className="font-['Effra',sans-serif] font-bold text-[13px] text-[#26282b] leading-tight">{draft.ro.name}</p>
                <p className="font-['Effra',sans-serif] text-[11px] text-[#707070] leading-tight truncate">{draft.ro.email} · {draft.ro.phone}</p>
              </div>
            </div>
          )}

          {/* AccessMore prompt */}
          <div className="w-full bg-[#ebf3ff] rounded-[16px] p-[16px] mb-[14px]">
            <p className="font-['Effra',sans-serif] font-bold text-[13.5px] text-[#003883] mb-[4px]">Get the Onboard2Earn app</p>
            <p className="font-['Effra',sans-serif] text-[12px] text-[#4b5563] leading-[17px] mb-[10px]">
              Ask the customer to download the app and sign in as an existing account holder to manage their new account.
            </p>
            <button className="w-full bg-white border-2 border-[#003883] text-[#003883] font-['Effra',sans-serif] font-medium text-[13.5px] py-[10px] rounded-[10px] hover:bg-[#f0f7ff] active:scale-[0.98] transition-all">
              Download AccessMore
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 220, delay: 0.4 }}
            className="w-full bg-[#fff8f1] rounded-[16px] px-[16px] py-[12px] flex items-center gap-[10px] shadow-[0_8px_24px_rgba(255,130,0,0.14)]"
          >
            <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 shadow-[0_5px_12px_rgba(255,130,0,0.35)]" style={{ background: "linear-gradient(135deg,#ffb03b,#FF8200)" }}>
              <span className="font-['Effra',sans-serif] font-bold text-[13px] text-white">+5</span>
            </div>
            <p className="font-['Effra',sans-serif] text-[13px] text-[#8a5a12] leading-[18px]">
              <span className="font-bold">+5 pts (provisional)</span><br />Finalises when the customer activates.
            </p>
          </motion.div>
        </div>

        <div className="p-[16px] flex flex-col gap-[12px]">
          <button onClick={() => navigate("/rewards")} className={`${ctaCls} ${ctaEnabled}`}>
            View my leaderboard
          </button>
          <button onClick={onboardAnother} className="w-full bg-white border-2 border-[#003883] text-[#003883] font-['Effra',sans-serif] font-medium text-[16px] py-[16px] rounded-[14px] hover:bg-[#f0f7ff] active:scale-[0.98] transition-all">
            Onboard another
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
