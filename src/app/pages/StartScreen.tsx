import { useNavigate } from "react-router";
import MobileLayout from "../components/MobileLayout";

export default function StartScreen() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="relative h-full w-full flex flex-col">
        <div className="relative flex-1 flex flex-col items-center justify-center px-[32px]">
          <img
            src="/Onboard2EarnLogo.svg"
            alt="Onboard2Earn"
            className="w-[220px] h-auto mb-[24px]"
          />

          <button
            onClick={() => navigate("/home")}
            className="w-full max-w-[280px] bg-gradient-to-b from-[#6DA0F2] to-[#4A7FE0] hover:from-[#7DAEF5] hover:to-[#5A8FE8] text-white font-['Effra',sans-serif] font-bold text-[16px] py-[14px] rounded-[14px] shadow-lg active:scale-[0.98] transition-all"
          >
            Log In
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
