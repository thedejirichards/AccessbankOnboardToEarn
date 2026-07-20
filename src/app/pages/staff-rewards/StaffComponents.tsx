import { ReactNode, useEffect, useMemo, useState } from "react";
import { motion, animate } from "motion/react";

/* ---------- Design tokens (depth over borders) ---------- */
export const cardCls =
  "bg-white rounded-[20px] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_rgba(16,24,40,0.06)]";
export const glassCls = "bg-white/10 backdrop-blur-md border border-white/15";
export const heroGrad = "bg-gradient-to-b from-[#0a2f66] via-[#123f8c] to-[#1e5fc4]";
export const ctaCls =
  "w-full font-['Effra',sans-serif] font-medium text-[16px] py-[16px] rounded-[14px] transition-all";
export const ctaEnabled =
  "bg-[#FF8200] text-white shadow-[0_8px_20px_rgba(255,130,0,0.35)] hover:bg-[#e67500] active:scale-[0.98]";
export const ctaDisabled = "bg-[#f0f0f0] text-[#b0b0b0] cursor-not-allowed";

/* ---------- Role indicator badges (Staff assists / Customer verifies) ---------- */
type RoleType = "staff" | "customer";
const roleStyles: Record<RoleType, { bg: string; text: string; label: string }> = {
  staff: { bg: "#f0f4fa", text: "#3b5998", label: "Staff assists" },
  customer: { bg: "#e8f8ee", text: "#16753a", label: "Customer verifies" },
};
export function RoleBadge({ role }: { role: RoleType }) {
  const s = roleStyles[role];
  return (
    <span
      className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full font-['Effra',sans-serif] font-semibold text-[10px] tracking-wide uppercase"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      <span className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: s.text }} />
      {s.label}
    </span>
  );
}

/* ---------- Floating-label input (matches the auto-top-up pages' pattern) ---------- */
export function FloatingField({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  maxLength,
  hint,
  right,
  error = false,
  success = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: "text" | "numeric" | "tel";
  maxLength?: number;
  hint?: ReactNode;
  right?: ReactNode;
  error?: boolean;
  success?: boolean;
}) {
  const border = error
    ? "border-[#dc2626] focus:border-[#dc2626]"
    : success
      ? "border-[#16a34a] focus:border-[#16a34a]"
      : "border-[#E2E8F0] focus:border-[#003883]";
  const filled = value !== "";
  // Native date inputs always render their own dd/mm/yyyy placeholder segments — hide that
  // text until focused or filled, so it doesn't collide with the floating label at rest.
  const textColor = type === "date" && !filled ? "text-transparent focus:text-[#1E293B]" : "text-[#1E293B]";
  return (
    <div>
      <div className="relative">
        <input
          type={type}
          inputMode={inputMode}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`peer w-full bg-white border rounded-[8px] px-[16px] pt-[26px] pb-[10px] font-['Effra',sans-serif] text-[14px] ${textColor} outline-none focus:border-2 transition-colors ${right ? "pr-[48px]" : ""} ${border}`}
        />
        <label
          className={`absolute left-[16px] font-['Effra',sans-serif] text-[14px] text-[#64748B] pointer-events-none peer-focus:top-[10px] peer-focus:text-[10px] transition-all ${filled ? "top-[10px] text-[10px]" : "top-1/2 -translate-y-1/2"}`}
        >
          {label}
        </label>
        {right && <div className="absolute right-[14px] top-1/2 -translate-y-1/2">{right}</div>}
      </div>
      {hint && <div className="mt-[6px] font-['Effra',sans-serif] text-[11px] text-[#94A3B8]">{hint}</div>}
    </div>
  );
}

/* ---------- Floating-label select (dropdown variant of FloatingField) ---------- */
export function FloatingSelect({
  label,
  value,
  onChange,
  options,
  disabled = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
  hint?: ReactNode;
}) {
  const filled = value !== "";
  return (
    <div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`peer w-full bg-white border rounded-[8px] px-[16px] pt-[26px] pb-[10px] pr-[38px] font-['Effra',sans-serif] text-[14px] text-[#1E293B] outline-none focus:border-2 transition-colors appearance-none border-[#E2E8F0] focus:border-[#003883] ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <option value="" disabled hidden />
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <label
          className={`absolute left-[16px] font-['Effra',sans-serif] text-[#64748B] pointer-events-none transition-all ${filled ? "top-[10px] text-[10px]" : "top-1/2 -translate-y-1/2 text-[14px]"}`}
        >
          {label}
        </label>
        <svg
          className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {hint && <div className="mt-[6px] font-['Effra',sans-serif] text-[11px] text-[#94A3B8]">{hint}</div>}
    </div>
  );
}

/* ---------- Hero texture: dot grid + radial glows over the blue gradient ---------- */
export function HeroPattern({ id = "staffDots" }: { id?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg className="absolute inset-0 w-full h-full opacity-[0.10]">
        <defs>
          <pattern id={id} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      <div
        className="absolute -top-[70px] -right-[50px] w-[240px] h-[240px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,130,0,0.32), transparent 68%)" }}
      />
      <div
        className="absolute -bottom-[90px] -left-[70px] w-[280px] h-[280px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(91,141,239,0.38), transparent 70%)" }}
      />
    </div>
  );
}

/* ---------- Header (back chevron + centered title) ---------- */
export function StaffHeader({
  title,
  onBack,
  variant = "light",
  right,
}: {
  title: string;
  onBack?: () => void;
  variant?: "light" | "blue";
  right?: ReactNode;
}) {
  const blue = variant === "blue";
  const stroke = blue ? "white" : "#383838";
  return (
    <div className={`relative h-[64px] flex items-center px-[20px] shrink-0 ${blue ? "" : "border-b border-[#f0f0f0]"}`}>
      {onBack && (
        <motion.button whileTap={{ scale: 0.88 }} onClick={onBack} className={`w-[36px] h-[36px] flex items-center justify-center rounded-full ${blue ? "bg-white/10" : "bg-[#f4f6f8]"}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      )}
      <div className={`flex-1 text-center ${onBack ? "mr-[36px]" : ""}`}>
        <span className={`font-['Effra',sans-serif] font-bold text-[17px] ${blue ? "text-white" : "text-[#383838]"}`}>
          {title}
        </span>
      </div>
      {right && <div className="absolute right-[20px]">{right}</div>}
    </div>
  );
}

/* ---------- Wizard progress tracker (animated gradient segments) ---------- */
const staffLabels = ["Auth", "Capture", "Tier", "Credentials", "Send"];
export const activationLabels = ["Login", "Change Password", "PIN", "Done"];

/* ---------- Full customer onboarding journey step labels (4-screen flow) ---------- */
export const journeyLabels = [
  "Account & Consent",
  "Terms & Identity",
  "Verification",
  "Complete",
];

export function StaffProgressTracker({
  currentStep,
  totalSteps = 5,
  labels = staffLabels,
}: {
  currentStep: number;
  totalSteps?: number;
  labels?: string[];
}) {
  const label = labels[Math.min(currentStep - 1, labels.length - 1)] || "";
  const percentage = Math.round((currentStep / totalSteps) * 100);
  return (
    <div className="w-full px-[24px] py-[12px] bg-white">
      <div className="flex items-center justify-between mb-[8px]">
        <p className="font-['Effra',sans-serif] font-bold text-[13px] text-[#383838]">
          {label} — Step {currentStep} of {totalSteps}
        </p>
        <p className="font-['Effra',sans-serif] font-bold text-[13px] text-[#FF8200]">{percentage}%</p>
      </div>
      <div className="flex gap-[4px]">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="h-[5px] flex-1 rounded-[3px] bg-[#eceef1] overflow-hidden">
            {i < currentStep && (
              <motion.div
                initial={{ scaleX: i === currentStep - 1 ? 0 : 1 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full w-full origin-left rounded-[3px] bg-gradient-to-r from-[#FF8200] to-[#ffb03b]"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Toggle switch (consent / attestation controls) ---------- */
export function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`shrink-0 w-[46px] h-[26px] rounded-full p-[3px] transition-colors duration-200 ${checked ? "bg-[#003883]" : "bg-[#e2e5ea]"}`}
    >
      <motion.div
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="w-[20px] h-[20px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
      />
    </button>
  );
}

/* ---------- Radio option (single-choice questions) ---------- */
export function RadioOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button type="button" onClick={onSelect} className="flex items-center gap-[10px] py-[7px]">
      <span className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selected ? "border-[#003883]" : "border-[#c9cdd4]"}`}>
        {selected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 260 }}
            className="w-[10px] h-[10px] rounded-full bg-[#003883]"
          />
        )}
      </span>
      <span className="font-['Effra',sans-serif] text-[14px] text-[#26282b]">{label}</span>
    </button>
  );
}

/* ---------- Status chip (funding / transaction / activation) ---------- */
export type StatusTone = "green" | "amber" | "red" | "grey";

const toneMap: Record<StatusTone, { bg: string; text: string }> = {
  green: { bg: "#e6f7ee", text: "#16a34a" },
  amber: { bg: "#fff4e5", text: "#d97706" },
  red: { bg: "#fdeaea", text: "#dc2626" },
  grey: { bg: "#f0f1f3", text: "#6b7280" },
};

export function StatusChip({ label, tone }: { label: string; tone: StatusTone }) {
  const c = toneMap[tone];
  const pending = tone === "amber" || tone === "grey";
  return (
    <span
      className="inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full font-['Effra',sans-serif] font-medium text-[10.5px] whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <span className={`w-[6px] h-[6px] rounded-full ${pending ? "animate-pulse" : ""}`} style={{ backgroundColor: c.text }} />
      {label}
    </span>
  );
}

/* ---------- Count-up number ---------- */
export function AnimatedNumber({ value, duration = 1, delay = 0 }: { value: number; duration?: number; delay?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, duration, delay]);
  return <>{display.toLocaleString()}</>;
}

/* ---------- Radial tier-progress ring ---------- */
export function TierRing({
  progress,
  color,
  size = 66,
  track = "rgba(255,255,255,0.18)",
  children,
}: {
  progress: number; // 0..1
  color: string;
  size?: number;
  track?: string;
  children?: ReactNode;
}) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - clamped) }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/* ---------- Success check with draw-on animation ---------- */
export function CheckDraw({ size = 96 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full bg-[#e8f8ee]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
      />
      <motion.div
        className="absolute inset-[11%] rounded-full bg-[#34c759] shadow-[0_10px_26px_rgba(52,199,89,0.45)]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 13, stiffness: 220, delay: 0.08 }}
      />
      <svg viewBox="0 0 48 48" fill="none" className="relative" width={size * 0.52} height={size * 0.52}>
        <motion.path
          d="M10 25L20 35L38 15"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.35, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

/* ---------- Confetti burst (hand-rolled, brand colors) ---------- */
const confettiColors = ["#FF8200", "#003883", "#34c759", "#ffb703", "#5b8def", "#e6f0ff"];

export function ConfettiBurst({ count = 26 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 340,
        delay: Math.random() * 0.3,
        duration: 1.7 + Math.random() * 1.2,
        rotate: Math.random() * 760 - 380,
        color: confettiColors[i % confettiColors.length],
        w: 6 + Math.random() * 5,
        h: 9 + Math.random() * 6,
        round: Math.random() > 0.72,
      })),
    [count]
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10" aria-hidden>
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-[80px]"
          style={{
            width: p.w,
            height: p.round ? p.w : p.h,
            backgroundColor: p.color,
            borderRadius: p.round ? "50%" : 2,
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
          animate={{ x: p.x, y: 460, opacity: [1, 1, 0], rotate: p.rotate, scale: 1 }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.15, 0.6, 0.45, 1] }}
        />
      ))}
    </div>
  );
}

/* ---------- Avatar gradients ---------- */
const avatarGrads = [
  "linear-gradient(135deg,#5b8def,#003883)",
  "linear-gradient(135deg,#ffb03b,#ff6b35)",
  "linear-gradient(135deg,#34c759,#0e9f6e)",
  "linear-gradient(135deg,#8a94a6,#5b6b7b)",
  "linear-gradient(135deg,#c084fc,#7c3aed)",
];

export function avatarGradient(name: string): string {
  return avatarGrads[name.charCodeAt(0) % avatarGrads.length];
}

/* ---------- Reward tiers ---------- */
export interface RewardTier {
  name: string;
  range: string;
  min: number;
  max: number;
  perk: string;
  color: string;
  grad: string;
}

export const rewardTiers: RewardTier[] = [
  { name: "Bronze", range: "0 – 999 pts", min: 0, max: 999, perk: "Entry tier. Onboarding push cash.", color: "#b8763e", grad: "linear-gradient(135deg,#d9975c,#9c5f2c)" },
  { name: "Silver", range: "1,000 – 2,999 pts", min: 1000, max: 2999, perk: "Cash + quarterly bonus multiplier.", color: "#8a94a6", grad: "linear-gradient(135deg,#b3bcc9,#6f7b8e)" },
  { name: "Gold", range: "3,000 – 6,999 pts", min: 3000, max: 6999, perk: "Cash + regional recognition & perks.", color: "#d4a017", grad: "linear-gradient(135deg,#f0c14b,#b8860b)" },
  { name: "Platinum", range: "7,000+ pts", min: 7000, max: Infinity, perk: "Cash + national leaderboard status.", color: "#5b6b7b", grad: "linear-gradient(135deg,#8fa3b5,#43525f)" },
];

export function tierForPoints(pts: number): RewardTier {
  return rewardTiers.find((t) => pts >= t.min && pts <= t.max) ?? rewardTiers[0];
}

export function nextTier(pts: number): RewardTier | null {
  const idx = rewardTiers.findIndex((t) => pts >= t.min && pts <= t.max);
  return idx >= 0 && idx < rewardTiers.length - 1 ? rewardTiers[idx + 1] : null;
}

/* ---------- Gamification point-award moments ---------- */
export const pointMoments = [
  { id: "onboard", label: "Onboard", pts: 5, note: "Provisional, on KYC submission" },
  { id: "activate", label: "Activate", pts: 15, note: "When customer claims & sets PIN" },
  { id: "transact", label: "Transact", pts: 30, note: "On first qualifying transaction" },
];

/* ---------- Demo staff + customer data ---------- */
export const currentStaff = { name: "Tunde A.", rank: 4, points: 2340 };

export interface OnboardedCustomer {
  id: string;
  name: string;
  location: string;
  funding: { label: string; tone: StatusTone };
  transaction: { label: string; tone: StatusTone };
  activated: boolean;
}

export const demoCustomers: OnboardedCustomer[] = [
  { id: "c1", name: "Amaka O.", location: "Abeokuta", funding: { label: "Funded", tone: "green" }, transaction: { label: "Transacted", tone: "green" }, activated: true },
  { id: "c2", name: "Chinedu E.", location: "Onitsha", funding: { label: "Funded", tone: "green" }, transaction: { label: "No txn", tone: "amber" }, activated: true },
  { id: "c3", name: "Halima B.", location: "Kano", funding: { label: "Unfunded", tone: "amber" }, transaction: { label: "No txn", tone: "grey" }, activated: true },
  { id: "c4", name: "Segun A.", location: "Surulere", funding: { label: "Unfunded", tone: "grey" }, transaction: { label: "Awaiting activation", tone: "grey" }, activated: false },
];
