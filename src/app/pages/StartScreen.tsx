import { useNavigate } from "react-router";
import MobileLayout from "../components/MobileLayout";

export default function StartScreen() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="relative h-full w-full flex flex-col">
        <div className="relative flex-1 flex flex-col items-center justify-center px-8">
          <img
            src="/Onboard2EarnLogo.svg"
            alt="Onboard2Earn"
            className="w-48 md:w-56 h-auto mb-6"
          />

          <button
            onClick={() => navigate("/login/entra")}
            className="w-full max-w-xs bg-[#F57E20] hover:bg-[#e06f14] text-white font-['Effra',sans-serif] font-bold text-base md:text-lg py-4 rounded-[14px] shadow-lg active:scale-[0.98] transition-all"
          >
            Log In with Entra
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
