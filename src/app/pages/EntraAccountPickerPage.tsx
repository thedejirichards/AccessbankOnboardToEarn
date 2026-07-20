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
      <div className="h-full w-full flex items-center justify-center px-5">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.18)] px-7 md:px-8 py-9 md:py-10">
          <div className="flex items-center gap-2.5 mb-9">
            <MicrosoftLogo />
            <span className="font-['Segoe_UI',sans-serif] text-lg md:text-xl text-[#5e5e5e]">Microsoft</span>
          </div>

          <h1 className="font-['Segoe_UI',sans-serif] font-semibold text-2xl md:text-[26px] text-[#1b1b1b] mb-6 md:mb-7">
            Pick an account
          </h1>

          <button
            onClick={chooseAccount}
            className="w-full flex items-center gap-4 py-2.5 -mx-1.5 px-1.5 rounded hover:bg-[#f5f5f5] transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#e6e6e6] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3.4" stroke="#5e5e5e" strokeWidth="1.6" />
                <path d="M5 20a7 7 0 0114 0" stroke="#5e5e5e" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <span className="flex-1 font-['Segoe_UI',sans-serif] text-[15px] md:text-base text-[#1b1b1b]">{demoAccount}</span>
            <span className="text-[#5e5e5e] text-lg leading-none px-1.5">⋮</span>
          </button>

          <button
            onClick={useAnotherAccount}
            className="w-full flex items-center gap-4 py-2.5 -mx-1.5 px-1.5 rounded hover:bg-[#f5f5f5] transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#e6e6e6] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#5e5e5e" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-['Segoe_UI',sans-serif] text-[15px] md:text-base text-[#1b1b1b]">Use another account</span>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
