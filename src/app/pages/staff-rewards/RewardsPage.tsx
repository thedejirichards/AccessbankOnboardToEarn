import { useNavigate } from "react-router";
import { motion } from "motion/react";
import MobileLayout from "../../components/MobileLayout";
import {
  StaffHeader,
  StatusChip,
  HeroPattern,
  TierRing,
  AnimatedNumber,
  avatarGradient,
  cardCls,
  glassCls,
  heroGrad,
  currentStaff,
  demoCustomers,
  rewardTiers,
  tierForPoints,
  nextTier,
  pointMoments,
} from "./StaffComponents";

const podium = [
  { rank: 2, name: "Emeka N.", pts: 3480, height: 74, medal: "linear-gradient(135deg,#b3bcc9,#6f7b8e)" },
  { rank: 1, name: "Adaeze O.", pts: 4120, height: 98, medal: "linear-gradient(135deg,#f0c14b,#b8860b)" },
  { rank: 3, name: "Ibrahim S.", pts: 2950, height: 58, medal: "linear-gradient(135deg,#d9975c,#9c5f2c)" },
];

const sectionAnim = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { type: "spring" as const, damping: 22, stiffness: 220 },
};

function BottomNav() {
  const navigate = useNavigate();
  const tabs = [
    { id: "home", label: "Home", route: "/home", d: "M3 11l9-8 9 8M5 10v10h14V10" },
    { id: "rewards", label: "Rewards", route: "/rewards", active: true, d: "M6 9V4h12v5a6 6 0 01-12 0zM9 20h6M12 15v5" },
    { id: "scan", label: "Scan", route: "/home", d: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
    { id: "support", label: "Support", route: "/home", d: "M12 3a9 9 0 100 18 9 9 0 000-18zM9.5 9a2.5 2.5 0 013.5 2c0 1.5-2 1.8-2 3M12 17h.01" },
    { id: "profile", label: "Profile", route: "/home", d: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-2.7 5.3-4 8-4s8 1.3 8 4" },
  ];
  return (
    <div className="shrink-0 w-full bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(16,24,40,0.06)] flex items-center justify-around py-[8px] z-20">
      {tabs.map((t) => (
        <motion.button
          key={t.id}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(t.route)}
          className={`relative flex flex-col items-center gap-[3px] px-[10px] pt-[6px] pb-[2px] ${t.active ? "text-[#003883]" : "text-[#878787]"} hover:text-[#003883] transition-colors`}
        >
          {t.active && (
            <motion.span layoutId="navPill" className="absolute -top-[2px] w-[22px] h-[3px] rounded-full bg-[#FF8200]" />
          )}
          <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none">
            <path d={t.d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`font-['Effra',sans-serif] text-[10px] ${t.active ? "font-bold" : "font-medium"}`}>{t.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

export default function RewardsPage() {
  const navigate = useNavigate();
  const tier = tierForPoints(currentStaff.points);
  const next = nextTier(currentStaff.points);
  const toGo = next ? next.min - currentStaff.points : 0;
  const progress = next ? ((currentStaff.points - tier.min) / (next.min - tier.min)) * 100 : 100;
  const tierProgress = progress / 100;

  return (
    <MobileLayout>
      <div className="h-full flex flex-col bg-white overflow-hidden">
        {/* Rank hero — fixed, does not scroll */}
        <div className={`relative shrink-0 ${heroGrad} pb-[26px] rounded-b-[28px] shadow-[0_12px_30px_rgba(10,47,102,0.25)]`}>
          <HeroPattern id="rewardsDots" />
          <div className="relative">
            <StaffHeader title="My Leaderboard" onBack={() => navigate("/staff-rewards")} variant="blue" />
            <div className="px-[20px] pt-[4px]">
              <div className={`${glassCls} rounded-[20px] p-[18px]`}>
                <div className="flex items-center justify-between mb-[14px]">
                  <div>
                    <p className="font-['Effra',sans-serif] text-[11px] text-white/60">Your rank</p>
                    <p className="font-['Effra',sans-serif] font-bold text-[36px] text-white leading-none">
                      #<AnimatedNumber value={currentStaff.rank} duration={0.7} />
                    </p>
                    <p className="font-['Effra',sans-serif] text-[12px] text-white/80 mt-[5px]">
                      <AnimatedNumber value={currentStaff.points} /> pts · {tier.name} Tier
                    </p>
                  </div>
                  <TierRing progress={tierProgress} color="#FF8200" size={72}>
                    <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center" style={{ background: tier.grad }}>
                      <span className="font-['Effra',sans-serif] font-bold text-[11px] text-white">{tier.name.slice(0, 3).toUpperCase()}</span>
                    </div>
                  </TierRing>
                </div>
                {next && (
                  <>
                    <div className="flex items-center justify-between mb-[6px]">
                      <span className="font-['Effra',sans-serif] text-[11px] text-white/70">Next: {next.name}</span>
                      <span className="font-['Effra',sans-serif] font-bold text-[11px] text-[#ffb03b]">{toGo.toLocaleString()} PTS TO GO</span>
                    </div>
                    <div className="h-[7px] bg-white/15 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#FF8200] to-[#ffb03b]"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content — hero stays fixed above this */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white px-[20px] pt-[20px] pb-[24px]">
          {/* Top performers — podium */}
          <p className="font-['Effra',sans-serif] font-bold text-[15px] text-[#26282b] mb-[12px]">Top performers</p>
          <motion.div {...sectionAnim} className={`${cardCls} px-[18px] pt-[22px] pb-[16px] mb-[24px]`}>
            <div className="flex items-end justify-center gap-[10px]">
              {podium.map((p) => (
                <div key={p.rank} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0, y: 10 }}
                    whileInView={{ scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", damping: 14, stiffness: 240, delay: 0.15 + p.rank * 0.08 }}
                    className="relative mb-[8px]"
                  >
                    <div
                      className="w-[46px] h-[46px] rounded-full flex items-center justify-center shadow-[0_6px_14px_rgba(16,24,40,0.14)]"
                      style={{ background: avatarGradient(p.name) }}
                    >
                      <span className="font-['Effra',sans-serif] font-bold text-[15px] text-white">{p.name.charAt(0)}</span>
                    </div>
                    <span
                      className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-[20px] h-[20px] rounded-full flex items-center justify-center border-2 border-white"
                      style={{ background: p.medal }}
                    >
                      <span className="font-['Effra',sans-serif] font-bold text-[10px] text-white">{p.rank}</span>
                    </span>
                    {p.rank === 1 && (
                      <motion.svg
                        initial={{ y: -6, opacity: 0, rotate: -12 }}
                        whileInView={{ y: 0, opacity: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, type: "spring", damping: 10 }}
                        className="absolute -top-[16px] left-1/2 -translate-x-1/2"
                        width="20" height="14" viewBox="0 0 24 16" fill="none"
                      >
                        <path d="M2 14L4 4l5 5 3-8 3 8 5-5 2 10H2z" fill="#f0c14b" stroke="#b8860b" strokeWidth="1" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </motion.div>
                  <p className="font-['Effra',sans-serif] font-bold text-[11.5px] text-[#26282b] mt-[6px] text-center leading-tight">{p.name}</p>
                  <p className="font-['Effra',sans-serif] text-[10.5px] text-[#9ca3af] mb-[8px]">{p.pts.toLocaleString()} pts</p>
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: p.height }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 + p.rank * 0.06 }}
                    className="w-full rounded-t-[10px]"
                    style={{
                      background: p.rank === 1 ? "linear-gradient(180deg,#ffb03b,#FF8200)" : "linear-gradient(180deg,#dce6f5,#c3d4ec)",
                    }}
                  />
                </div>
              ))}
            </div>
            {/* You row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55 }}
              className="mt-[2px] flex items-center gap-[12px] bg-[#fff8f1] rounded-[14px] px-[14px] py-[11px] border border-[#ffe2c2]"
            >
              <span className="w-[26px] h-[26px] rounded-full bg-[#FF8200] flex items-center justify-center font-['Effra',sans-serif] font-bold text-[12px] text-white shadow-[0_4px_10px_rgba(255,130,0,0.35)]">4</span>
              <span className="flex-1 font-['Effra',sans-serif] font-bold text-[13.5px] text-[#003883]">You · {currentStaff.name}</span>
              <span className="font-['Effra',sans-serif] font-bold text-[13.5px] text-[#26282b]">{currentStaff.points.toLocaleString()} pts</span>
            </motion.div>
          </motion.div>

          {/* Points loop — connected journey */}
          <p className="font-['Effra',sans-serif] font-bold text-[15px] text-[#26282b] mb-[12px]">How you earn</p>
          <motion.div {...sectionAnim} className={`${cardCls} p-[16px] mb-[10px]`}>
            <div className="relative flex items-start justify-between">
              <div className="absolute top-[21px] left-[36px] right-[36px] h-[2px] bg-gradient-to-r from-[#dce6f5] via-[#ffd9ad] to-[#c9ecd6]" />
              {pointMoments.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.14 }}
                  className="relative z-10 flex-1 flex flex-col items-center text-center"
                >
                  <div
                    className="w-[44px] h-[44px] rounded-full flex items-center justify-center border-4 border-white shadow-[0_5px_14px_rgba(16,24,40,0.12)]"
                    style={{
                      background: i === 0 ? "linear-gradient(135deg,#5b8def,#003883)" : i === 1 ? "linear-gradient(135deg,#ffb03b,#FF8200)" : "linear-gradient(135deg,#34c759,#0e9f6e)",
                    }}
                  >
                    <span className="font-['Effra',sans-serif] font-bold text-[12px] text-white">+{m.pts}</span>
                  </div>
                  <p className="font-['Effra',sans-serif] font-bold text-[12px] text-[#26282b] mt-[8px]">{m.label}</p>
                  <p className="font-['Effra',sans-serif] text-[9.5px] text-[#9ca3af] leading-[13px] mt-[3px] px-[4px]">{m.note}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <p className="font-['Effra',sans-serif] text-[11px] text-[#9ca3af] leading-[16px] mb-[24px]">
            Points finalise only when the loop completes — not at submission. 90-day dormancy clawback applies if a customer goes inactive.
          </p>

          {/* My customers with funding + transaction status */}
          <p className="font-['Effra',sans-serif] font-bold text-[15px] text-[#26282b] mb-[12px]">My customers</p>
          <motion.div {...sectionAnim} className={`${cardCls} overflow-hidden mb-[24px]`}>
            {demoCustomers.map((c, i) => (
              <div key={c.id} className={`flex items-center gap-[12px] px-[16px] py-[12px] ${i < demoCustomers.length - 1 ? "border-b border-[#f4f5f7]" : ""}`}>
                <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0" style={{ background: avatarGradient(c.name) }}>
                  <span className="font-['Effra',sans-serif] font-bold text-[13px] text-white">{c.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Effra',sans-serif] font-bold text-[13px] text-[#26282b] leading-tight">{c.name}</p>
                  <p className="font-['Effra',sans-serif] text-[10.5px] text-[#9ca3af] leading-tight">{c.location}</p>
                  <div className="flex flex-wrap gap-[5px] mt-[5px]">
                    <StatusChip label={c.funding.label} tone={c.funding.tone} />
                    <StatusChip label={c.transaction.label} tone={c.transaction.tone} />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Tier system */}
          <p className="font-['Effra',sans-serif] font-bold text-[15px] text-[#26282b] mb-[12px]">Tier system</p>
          <div className="flex flex-col gap-[10px]">
            {rewardTiers.map((t, i) => {
              const isCurrent = t.name === tier.name;
              return (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.06, type: "spring", damping: 22, stiffness: 240 }}
                  className={`flex items-center gap-[12px] rounded-[18px] px-[14px] py-[13px] ${isCurrent ? "bg-[#fff8f1] shadow-[0_0_0_2px_#FF8200,0_8px_24px_rgba(255,130,0,0.14)]" : cardCls}`}
                >
                  <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-[0_4px_10px_rgba(16,24,40,0.14)]" style={{ background: t.grad }}>
                    <span className="font-['Effra',sans-serif] font-bold text-[9.5px] text-white">{t.name.slice(0, 3).toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-[8px]">
                      <p className="font-['Effra',sans-serif] font-bold text-[14px] text-[#26282b]">{t.name}</p>
                      {isCurrent && (
                        <span className="font-['Effra',sans-serif] font-bold text-[9px] text-white bg-[#FF8200] px-[7px] py-[2px] rounded-full shadow-[0_3px_8px_rgba(255,130,0,0.35)]">YOU</span>
                      )}
                    </div>
                    <p className="font-['Effra',sans-serif] text-[11px] text-[#9ca3af]">{t.range}</p>
                    <p className="font-['Effra',sans-serif] text-[11px] text-[#4b5563] mt-[2px]">{t.perk}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="font-['Effra',sans-serif] text-[11px] text-[#9ca3af] leading-[16px] mt-[14px]">
            Every rank shift is tied to a real, activated customer — never to a submitted form.
          </p>
        </div>

        <BottomNav />
      </div>
    </MobileLayout>
  );
}
