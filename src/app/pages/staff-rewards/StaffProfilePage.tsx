import { useNavigate } from "react-router";
import MobileLayout from "../../components/MobileLayout";
import {
  StaffHeader,
  HeroPattern,
  TierRing,
  AnimatedNumber,
  avatarGradient,
  cardCls,
  heroGrad,
  currentStaff,
  tierForPoints,
  nextTier,
} from "./StaffComponents";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-[18px] py-[13px]">
      <span className="font-['Effra',sans-serif] text-[13px] text-[#9ca3af]">{label}</span>
      <span className="font-['Effra',sans-serif] font-medium text-[13.5px] text-[#26282b]">{value}</span>
    </div>
  );
}

export default function StaffProfilePage() {
  const navigate = useNavigate();
  const tier = tierForPoints(currentStaff.points);
  const next = nextTier(currentStaff.points);
  const tierProgress = next ? (currentStaff.points - tier.min) / (next.min - tier.min) : 1;

  return (
    <MobileLayout>
      <div className="h-full flex flex-col bg-[#f4f6fa]">
        <div className={`relative ${heroGrad} pb-[30px] rounded-b-[28px] shadow-[0_12px_30px_rgba(10,47,102,0.25)]`}>
          <HeroPattern id="profileDots" />
          <div className="relative">
            <StaffHeader title="Staff Profile" onBack={() => navigate("/staff-rewards")} variant="blue" />
            <div className="flex flex-col items-center pt-[4px] pb-[8px]">
              <div
                className="w-[74px] h-[74px] rounded-full flex items-center justify-center border-4 border-white/25 shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
                style={{ background: avatarGradient(currentStaff.name) }}
              >
                <span className="font-['Effra',sans-serif] font-bold text-[26px] text-white">{currentStaff.name.charAt(0)}</span>
              </div>
              <p className="font-['Effra',sans-serif] font-bold text-[18px] text-white mt-[10px]">{currentStaff.name}</p>
              <p className="font-['Effra',sans-serif] text-[12px] text-white/70">Relationship Officer · Access Bank</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-[20px] pt-[20px] pb-[30px]">
          <div className={`${cardCls} p-[18px] mb-[16px] flex items-center gap-[16px]`}>
            <TierRing progress={tierProgress} color="#FF8200" size={64}>
              <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center" style={{ background: tier.grad }}>
                <span className="font-['Effra',sans-serif] font-bold text-[10px] text-white">{tier.name.slice(0, 3).toUpperCase()}</span>
              </div>
            </TierRing>
            <div className="flex-1">
              <p className="font-['Effra',sans-serif] font-bold text-[16px] text-[#26282b]">
                <AnimatedNumber value={currentStaff.points} /> pts
              </p>
              <p className="font-['Effra',sans-serif] text-[12px] text-[#9ca3af]">{tier.name} Tier · Rank #{currentStaff.rank}</p>
            </div>
          </div>

          <p className="font-['Effra',sans-serif] font-bold text-[13px] text-[#383838] mb-[8px]">Staff details</p>
          <div className={`${cardCls} divide-y divide-[#f4f5f7]`}>
            <Row label="Staff ID" value="DSA-10472" />
            <Row label="Branch" value="Victoria Island" />
            <Row label="Email" value="tunde.adeyemi@accessbankplc.com" />
            <Row label="Phone" value="0803 000 0000" />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
