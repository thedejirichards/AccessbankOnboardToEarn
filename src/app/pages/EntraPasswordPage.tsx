import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import MobileLayout from "../components/MobileLayout";

export default function EntraPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email || "testuser@accessbankplc.com";
  const [password, setPassword] = useState("");

  const signIn = () => {
    if (!password) return;
    navigate("/home");
  };

  return (
    <MobileLayout overlayClassName="bg-white">
      <div className="h-full w-full flex items-center justify-center px-[20px]">
        <div className="w-full max-w-[360px] bg-white rounded-[8px] shadow-[0_2px_12px_rgba(0,0,0,0.18)] overflow-hidden">
          <div className="px-[28px] pt-[32px] pb-[28px]">
            <button
              onClick={() => navigate("/login/entra")}
              className="flex items-center gap-[10px] mb-[22px] text-[#5e5e5e] hover:opacity-80 transition-opacity"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#5e5e5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-['Segoe_UI',sans-serif] text-[13.5px]">{email}</span>
            </button>

            <h1 className="font-['Segoe_UI',sans-serif] font-semibold text-[24px] text-[#1b1b1b] mb-[22px]">
              Enter password
            </h1>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && signIn()}
              placeholder="Password"
              autoFocus
              className="w-full border-0 border-b border-[#666] focus:border-b-2 focus:border-[#0067b8] outline-none font-['Segoe_UI',sans-serif] text-[14px] text-[#1b1b1b] placeholder-[#5e5e5e] py-[8px] mb-[14px] bg-transparent"
            />

            <button className="font-['Segoe_UI',sans-serif] text-[13.5px] text-[#0067b8] hover:underline">
              Forgot my password
            </button>

            <div className="flex justify-end mt-[36px]">
              <button
                onClick={signIn}
                disabled={!password}
                className={`font-['Segoe_UI',sans-serif] font-medium text-[15px] px-[28px] py-[9px] rounded-[2px] transition-colors ${password ? "bg-[#0067b8] hover:bg-[#005a9e] text-white" : "bg-[#f3f2f1] text-[#a19f9d] cursor-not-allowed"}`}
              >
                Sign in
              </button>
            </div>
          </div>

          <div className="bg-[#f3f2f1] px-[28px] py-[20px]">
            <p className="font-['Segoe_UI',sans-serif] font-semibold text-[13.5px] text-[#1b1b1b] mb-[8px]">
              Access Bank Secure login portal
            </p>
            <p className="font-['Segoe_UI',sans-serif] text-[13px] text-[#5e5e5e] leading-[18px]">
              This is restricted login. Please do not login if you are not from Access Bank IT Team.
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
