import { useNavigate } from "react-router";
import MobileLayout from "../../components/MobileLayout";
import { StaffHeader, heroGrad } from "./StaffComponents";

export default function PayWithQuickboxPage() {
  const navigate = useNavigate();
  return (
    <MobileLayout>
      <div className="h-full flex flex-col bg-[#f4f6fa]">
        <div className={`relative ${heroGrad} pb-[30px] rounded-b-[28px]`}>
          <StaffHeader title="Pay with Quickbox" onBack={() => navigate("/home")} variant="blue" />
        </div>
        <div className="flex-1 flex items-center justify-center px-5">
          <p className="font-['Effra',sans-serif] text-[#9ca3af]">Quickbox payment options coming soon</p>
        </div>
      </div>
    </MobileLayout>
  );
}
