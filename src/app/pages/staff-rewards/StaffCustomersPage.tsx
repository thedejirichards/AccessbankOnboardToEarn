import { useNavigate } from "react-router";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, StatusChip, cardCls, avatarGradient, demoCustomers } from "./StaffComponents";

export default function StaffCustomersPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="bg-white h-full flex flex-col">
        <StaffHeader title="My Customers" onBack={() => navigate("/staff-rewards")} />

        <div className="flex-1 overflow-y-auto px-[20px] pt-[16px] pb-[30px]">
          <p className="font-['Effra',sans-serif] text-[13px] text-[#9ca3af] mb-[14px]">
            {demoCustomers.length} customers onboarded
          </p>

          <div className={`${cardCls} overflow-hidden`}>
            {demoCustomers.map((c, i) => (
              <div
                key={c.id}
                className={`flex items-center gap-[12px] px-[16px] py-[14px] ${i < demoCustomers.length - 1 ? "border-b border-[#f4f5f7]" : ""}`}
              >
                <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0" style={{ background: avatarGradient(c.name) }}>
                  <span className="font-['Effra',sans-serif] font-bold text-[14px] text-white">{c.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Effra',sans-serif] font-bold text-[13.5px] text-[#26282b] leading-tight">{c.name}</p>
                  <p className="font-['Effra',sans-serif] text-[11px] text-[#9ca3af] leading-tight">{c.location}</p>
                  <div className="flex flex-wrap gap-[5px] mt-[5px]">
                    <StatusChip label={c.funding.label} tone={c.funding.tone} />
                    <StatusChip label={c.transaction.label} tone={c.transaction.tone} />
                    <StatusChip label={c.activated ? "Activated" : "Pending activation"} tone={c.activated ? "green" : "grey"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
