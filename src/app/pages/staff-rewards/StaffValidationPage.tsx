import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StaffProgressTracker, cardCls, ctaCls, ctaEnabled, journeyLabels } from "./StaffComponents";

type CheckStatus = "pending" | "checking" | "passed" | "failed";
type Check = { id: string; label: string; status: CheckStatus };

const initialChecks: Check[] = [
  { id: "duplicate", label: "Duplicate customer check", status: "pending" },
  { id: "aml", label: "AML screening", status: "pending" },
  { id: "fraud", label: "Fraud screening", status: "pending" },
];

function CheckRow({ check }: { check: Check }) {
  return (
    <div className="flex items-center gap-[12px] py-[12px]">
      <div className="w-[28px] h-[28px] rounded-full flex items-center justify-center shrink-0">
        {check.status === "pending" && <div className="w-[10px] h-[10px] rounded-full bg-[#e6e8ec]" />}
        {check.status === "checking" && (
          <div className="w-[20px] h-[20px] border-[3px] border-[#e6e8ec] border-t-[#003883] rounded-full animate-spin" />
        )}
        {check.status === "passed" && (
          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, stiffness: 260 }} width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="#16a34a" />
            <path d="M7.5 12.5l3 3L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        )}
        {check.status === "failed" && (
          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, stiffness: 260 }} width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="#dc2626" />
            <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </motion.svg>
        )}
      </div>
      <p className={`font-['Effra',sans-serif] text-[14px] ${check.status === "pending" ? "text-[#9ca3af]" : "text-[#26282b]"}`}>
        {check.label}
      </p>
    </div>
  );
}

export default function StaffValidationPage() {
  const navigate = useNavigate();
  const [checks, setChecks] = useState<Check[]>(initialChecks);
  const [failed, setFailed] = useState(false);
  const [runId, setRunId] = useState(0);

  const allPassed = checks.every((c) => c.status === "passed");

  useEffect(() => {
    setFailed(false);
    setChecks(initialChecks.map((c) => ({ ...c, status: "pending" })));

    const timers: ReturnType<typeof setTimeout>[] = [];
    initialChecks.forEach((c, i) => {
      timers.push(
        setTimeout(() => {
          setChecks((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: "checking" } : x)));
        }, i * 650)
      );
      timers.push(
        setTimeout(() => {
          // Simulated: always resolves successfully so the demo flow can be driven end-to-end.
          setChecks((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: "passed" } : x)));
        }, i * 650 + 550)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [runId]);

  useEffect(() => {
    if (allPassed) {
      const t = setTimeout(() => navigate("/staff-rewards/liveness"), 500);
      return () => clearTimeout(t);
    }
  }, [allPassed, navigate]);

  const retry = () => setRunId((n) => n + 1);

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title="Background Validation" onBack={() => navigate("/staff-rewards/identity")} />
        <StaffProgressTracker currentStep={6} totalSteps={11} labels={journeyLabels} />

        <div className="flex-1 overflow-y-auto px-[24px] pt-[10px] pb-[40px]">
          <h2 className="font-['Effra',sans-serif] font-bold text-[20px] text-[#383838] mb-[6px]">Running checks…</h2>
          <p className="font-['Effra',sans-serif] text-[14px] text-[#707070] leading-[20px] mb-[20px]">
            This runs automatically in the background — no action needed.
          </p>

          <div className={`${cardCls} px-[18px] divide-y divide-[#f4f5f7]`}>
            {checks.map((c) => (
              <CheckRow key={c.id} check={c} />
            ))}
          </div>

          {failed && (
            <div className="mt-[20px] bg-[#fdeaea] rounded-[14px] p-[16px]">
              <p className="font-['Effra',sans-serif] font-bold text-[13.5px] text-[#dc2626] mb-[4px]">Validation failed</p>
              <p className="font-['Effra',sans-serif] text-[12.5px] text-[#a83232] leading-[18px] mb-[14px]">
                We couldn't clear this customer for onboarding. Please check the details entered and try again, or cancel and escalate to compliance.
              </p>
              <div className="flex gap-[10px]">
                <button onClick={retry} className={`flex-1 ${ctaCls} ${ctaEnabled} !py-[12px] !text-[13px]`}>
                  Try again
                </button>
                <button
                  onClick={() => navigate("/staff-rewards")}
                  className="flex-1 bg-white border-2 border-[#e6e8ec] text-[#707070] font-['Effra',sans-serif] font-medium text-[13px] py-[12px] rounded-[14px] hover:bg-[#f7f9fc] active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
