import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { currentStaff, avatarGradient, heroGrad } from "./StaffComponents";

const items = [
  {
    id: "home",
    label: "Home",
    route: "/home",
    d: "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5zM9 21V12h6v9",
  },
  {
    id: "loans",
    label: "My Loans",
    route: "/loans",
    d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 6v6l4 2",
  },
  {
    id: "device",
    label: "Device Finance",
    route: "/device-finance",
    d: "M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM8 2v4M16 2v4M8 13h8M8 17h4",
  },
  {
    id: "vehicle",
    label: "Vehicle Finance",
    route: "/vehicle-finance",
    d: "M3 13h18M5 9l2-4h10l2 4M5 9v6a2 2 0 002 2h1a1 1 0 001-1v-1M19 9v6a2 2 0 01-2 2h-1a1 1 0 01-1-1v-1M8 13h8",
  },
  {
    id: "quickbox",
    label: "Pay with Quickbox",
    route: "/pay-with-quickbox",
    d: "M20 12H4M12 4v16M4 8a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4V8z",
  },
  {
    id: "support",
    label: "Support",
    route: "/support",
    d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 16v.01M12 13a2 2 0 00.71-3.87A2 2 0 0010 11",
  },
];

export default function StaffDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  const go = (route: string) => {
    onClose();
    navigate(route);
  };

  const logOut = () => {
    onClose();
    navigate("/");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 z-30"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="absolute top-0 left-0 bottom-0 w-[80%] md:w-[75%] max-w-[320px] bg-white z-40 shadow-[8px_0_30px_rgba(16,24,40,0.18)] flex flex-col"
          >
            <div className={`${heroGrad} px-5 md:px-6 pt-8 pb-5`}>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 border-white/30"
                  style={{ background: avatarGradient(currentStaff.name) }}
                >
                  <span className="font-['Effra',sans-serif] font-bold text-lg text-white">
                    {currentStaff.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-['Effra',sans-serif] font-bold text-[15px] md:text-base text-white">{currentStaff.name}</p>
                  <p className="font-['Effra',sans-serif] text-xs text-white/70">
                    Rank #{currentStaff.rank} · {currentStaff.points.toLocaleString()} pts
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 py-[10px]">
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => go(it.route)}
                  className="w-full flex items-center gap-3.5 px-5 md:px-6 py-4 hover:bg-[#f4f6fa] active:bg-[#ebf3ff] transition-colors text-left"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d={it.d} stroke="#003883" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-['Effra',sans-serif] font-medium text-sm text-[#26282b]">{it.label}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-[#f0f0f0] py-[10px]">
              <button
                onClick={logOut}
                className="w-full flex items-center gap-3.5 px-5 md:px-6 py-4 hover:bg-[#fdeaea] active:bg-[#fbdcdc] transition-colors text-left"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                    stroke="#dc2626"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-['Effra',sans-serif] font-medium text-sm text-[#dc2626]">Log out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
