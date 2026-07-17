import { useNavigate } from "react-router";
import MobileLayout from "../components/MobileLayout";

const demoAccount = "testuser@accessbankplc.com";

function MicrosoftLogo() {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

export default function EntraAccountPickerPage() {
  const navigate = useNavigate();

  const chooseAccount = () => navigate("/login/entra/password", { state: { email: demoAccount } });
  const useAnotherAccount = () => navigate("/home");

  return (
    <MobileLayout overlayClassName="bg-white">
      <div className="h-full w-full flex items-center justify-center px-[20px]">
        <div className="w-full max-w-[360px] bg-white rounded-[8px] shadow-[0_2px_12px_rgba(0,0,0,0.18)] px-[28px] py-[36px]">
          <div className="flex items-center gap-[10px] mb-[36px]">
            <MicrosoftLogo />
            <span className="font-['Segoe_UI',sans-serif] text-[19px] text-[#5e5e5e]">Microsoft</span>
          </div>

          <h1 className="font-['Segoe_UI',sans-serif] font-semibold text-[24px] text-[#1b1b1b] mb-[26px]">
            Pick an account
          </h1>

          <button
            onClick={chooseAccount}
            className="w-full flex items-center gap-[16px] py-[10px] -mx-[6px] px-[6px] rounded-[4px] hover:bg-[#f5f5f5] transition-colors text-left"
          >
            <div className="w-[40px] h-[40px] rounded-full bg-[#e6e6e6] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3.4" stroke="#5e5e5e" strokeWidth="1.6" />
                <path d="M5 20a7 7 0 0114 0" stroke="#5e5e5e" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <span className="flex-1 font-['Segoe_UI',sans-serif] text-[15px] text-[#1b1b1b]">{demoAccount}</span>
            <span className="text-[#5e5e5e] text-[18px] leading-none px-[6px]">⋮</span>
          </button>

          <button
            onClick={useAnotherAccount}
            className="w-full flex items-center gap-[16px] py-[10px] -mx-[6px] px-[6px] rounded-[4px] hover:bg-[#f5f5f5] transition-colors text-left"
          >
            <div className="w-[40px] h-[40px] rounded-full bg-[#e6e6e6] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#5e5e5e" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-['Segoe_UI',sans-serif] text-[15px] text-[#1b1b1b]">Use another account</span>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
