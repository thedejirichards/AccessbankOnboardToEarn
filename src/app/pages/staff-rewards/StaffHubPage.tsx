import { useState } from "react";
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
  tierForPoints,
  nextTier,
} from "./StaffComponents";
import StaffDrawer from "./StaffDrawer";

const actions = [
  {
    id: "onboard",
    title: "Onboard a Customer",
    desc: "Capture KYC in the field — offline capable",
    route: "/staff-rewards/account",
    grad: "linear-gradient(135deg,#1e5fc4,#003883)",
    glow: "rgba(0,56,131,0.28)",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.2" stroke="white" strokeWidth="1.7" />
        <path d="M4 19a5 5 0 0110 0" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M17 8v6M14 11h6" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "rewards",
    title: "Leaderboard & Rewards",
    desc: "Your rank, points and tier standing",
    route: "/rewards",
    grad: "linear-gradient(135deg,#ffb03b,#FF8200)",
    glow: "rgba(255,130,0,0.30)",
    icon: (
      <>
        <path d="M6 9V4h12v5a6 6 0 01-12 0z" stroke="white" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M4 5h2M18 5h2M9 20h6M12 15v5" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
];

export default function StaffHubPage() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const tier = tierForPoints(currentStaff.points);
  const next = nextTier(currentStaff.points);
  const tierProgress = next ? (currentStaff.points - tier.min) / (next.min - tier.min) : 1;

  return (
    <MobileLayout>
      <div className="h-full flex flex-col bg-[#f4f6fa]">
        <div className={`relative ${heroGrad} pb-7 md:pb-8 rounded-b-3xl shadow-[0_12px_30px_rgba(10,47,102,0.25)]`}>
          <HeroPattern id="hubDots" />
          <div className="relative">
            <StaffHeader
              title="Onboard & Earn"
              variant="blue"
              right={
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h16M4 12h16M4 18h16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              }
            />
            <div className="px-5 md:px-8 pt-1">
              <p className="font-['Effra',sans-serif] text-xs md:text-sm text-white/65">Good afternoon,</p>
              <p className="font-['Effra',sans-serif] font-bold text-xl md:text-2xl text-white">{currentStaff.name}</p>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/rewards")}
                className={`mt-3 md:mt-4 w-full ${glassCls} rounded-2xl p-3.5 md:p-4 flex items-center gap-3.5 md:gap-4 text-left hover:bg-white/[0.16] transition-colors`}
              >
                <TierRing progress={tierProgress} color="#FF8200" size={62}>
                  <div className="text-center">
                    <p className="font-['Effra',sans-serif] text-[8.5px] text-white/60 leading-none">RANK</p>
                    <p className="font-['Effra',sans-serif] font-bold text-lg md:text-xl text-white leading-tight">#{currentStaff.rank}</p>
                  </div>
                </TierRing>
                <div className="flex-1">
                  <p className="font-['Effra',sans-serif] font-bold text-base md:text-lg text-white">
                    <AnimatedNumber value={currentStaff.points} /> pts · {tier.name} Tier
                  </p>
                  {next && (
                    <p className="font-['Effra',sans-serif] text-xs text-white/70 mt-0.5">
                      {(next.min - currentStaff.points).toLocaleString()} pts to {next.name}
                    </p>
                  )}
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="flex-1 px-5 md:px-8 pt-4 md:pt-5 pb-10">
          <div className="flex flex-col gap-3">
            {actions.map((a, i) => (
              <motion.button
                key={a.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.07, type: "spring", damping: 20, stiffness: 260 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(a.route)}
                className={`group w-full flex items-center gap-3.5 md:gap-4 ${cardCls} px-4 md:px-5 py-4 md:py-5 text-left`}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: a.grad, boxShadow: `0 6px 14px ${a.glow}` }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">{a.icon}</svg>
                </div>
                <div className="flex-1">
                  <p className="font-['Effra',sans-serif] font-bold text-[15px] md:text-base text-[#26282b] leading-tight">{a.title}</p>
                  <p className="font-['Effra',sans-serif] text-xs md:text-sm text-[#9ca3af] leading-tight mt-1">{a.desc}</p>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-[3px]">
                  <path d="M9 6l6 6-6 6" stroke="#c4c4c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            ))}
          </div>

          {/* My recent customers */}
          <div className="flex items-center justify-between mt-6 md:mt-7 mb-2.5">
            <p className="font-['Effra',sans-serif] font-bold text-sm md:text-[15px] text-[#26282b]">My recent customers</p>
            <button onClick={() => navigate("/rewards")} className="font-['Effra',sans-serif] font-medium text-xs md:text-sm text-[#003883]">
              See all
            </button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className={`${cardCls} overflow-hidden`}
          >
            {demoCustomers.map((c, i) => (
              <div key={c.id} className={`flex items-center gap-3 px-4 md:px-5 py-3.5 md:py-4 ${i < demoCustomers.length - 1 ? "border-b border-[#f4f5f7]" : ""}`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: avatarGradient(c.name) }}>
                  <span className="font-['Effra',sans-serif] font-bold text-sm text-white">{c.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Effra',sans-serif] font-bold text-sm text-[#26282b] leading-tight">{c.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <StatusChip label={c.funding.label} tone={c.funding.tone} />
                    <StatusChip label={c.transaction.label} tone={c.transaction.tone} />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <StaffDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </MobileLayout>
  );
}
