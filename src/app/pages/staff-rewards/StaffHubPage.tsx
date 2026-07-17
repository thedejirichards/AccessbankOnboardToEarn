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

const actions = [
  {
    id: "onboard",
    title: "Onboard a Customer",
    desc: "Capture KYC in the field — offline capable",
    route: "/staff-rewards/category",
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
  const tier = tierForPoints(currentStaff.points);
  const next = nextTier(currentStaff.points);
  const tierProgress = next ? (currentStaff.points - tier.min) / (next.min - tier.min) : 1;

  return (
    <MobileLayout>
      <div className="h-full flex flex-col bg-[#f4f6fa]">
        <div className={`relative ${heroGrad} pb-[26px] rounded-b-[28px] shadow-[0_12px_30px_rgba(10,47,102,0.25)]`}>
          <HeroPattern id="hubDots" />
          <div className="relative">
            <StaffHeader title="Onboard & Earn" onBack={() => navigate("/")} variant="blue" />
            <div className="px-[20px] pt-[4px]">
              <p className="font-['Effra',sans-serif] text-[12px] text-white/65">Good afternoon,</p>
              <p className="font-['Effra',sans-serif] font-bold text-[21px] text-white">{currentStaff.name}</p>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/rewards")}
                className={`mt-[14px] w-full ${glassCls} rounded-[18px] p-[14px] flex items-center gap-[14px] text-left hover:bg-white/[0.16] transition-colors`}
              >
                <TierRing progress={tierProgress} color="#FF8200" size={62}>
                  <div className="text-center">
                    <p className="font-['Effra',sans-serif] text-[8.5px] text-white/60 leading-none">RANK</p>
                    <p className="font-['Effra',sans-serif] font-bold text-[19px] text-white leading-tight">#{currentStaff.rank}</p>
                  </div>
                </TierRing>
                <div className="flex-1">
                  <p className="font-['Effra',sans-serif] font-bold text-[16px] text-white">
                    <AnimatedNumber value={currentStaff.points} /> pts · {tier.name} Tier
                  </p>
                  {next && (
                    <p className="font-['Effra',sans-serif] text-[11px] text-white/70 mt-[2px]">
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

        <div className="flex-1 px-[20px] pt-[18px] pb-[40px]">
          <div className="flex flex-col gap-[12px]">
            {actions.map((a, i) => (
              <motion.button
                key={a.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.07, type: "spring", damping: 20, stiffness: 260 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(a.route)}
                className={`group w-full flex items-center gap-[14px] ${cardCls} px-[16px] py-[16px] text-left`}
              >
                <div
                  className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center shrink-0"
                  style={{ background: a.grad, boxShadow: `0 6px 14px ${a.glow}` }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">{a.icon}</svg>
                </div>
                <div className="flex-1">
                  <p className="font-['Effra',sans-serif] font-bold text-[15px] text-[#26282b] leading-tight">{a.title}</p>
                  <p className="font-['Effra',sans-serif] text-[12px] text-[#9ca3af] leading-tight mt-[3px]">{a.desc}</p>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-[3px]">
                  <path d="M9 6l6 6-6 6" stroke="#c4c4c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            ))}
          </div>

          {/* My recent customers */}
          <div className="flex items-center justify-between mt-[26px] mb-[10px]">
            <p className="font-['Effra',sans-serif] font-bold text-[14px] text-[#26282b]">My recent customers</p>
            <button onClick={() => navigate("/rewards")} className="font-['Effra',sans-serif] font-medium text-[12px] text-[#003883]">
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
              <div key={c.id} className={`flex items-center gap-[12px] px-[16px] py-[13px] ${i < demoCustomers.length - 1 ? "border-b border-[#f4f5f7]" : ""}`}>
                <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0" style={{ background: avatarGradient(c.name) }}>
                  <span className="font-['Effra',sans-serif] font-bold text-[13px] text-white">{c.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Effra',sans-serif] font-bold text-[13px] text-[#26282b] leading-tight">{c.name}</p>
                  <div className="flex flex-wrap gap-[5px] mt-[4px]">
                    <StatusChip label={c.funding.label} tone={c.funding.tone} />
                    <StatusChip label={c.transaction.label} tone={c.transaction.tone} />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </MobileLayout>
  );
}
