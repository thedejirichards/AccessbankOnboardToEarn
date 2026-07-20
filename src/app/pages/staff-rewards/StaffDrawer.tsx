import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { currentStaff, avatarGradient, heroGrad } from "./StaffComponents";

const items = [
  {
    id: "profile",
    label: "Staff Profile",
    route: "/staff-rewards/profile",
    d: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-2.7 5.3-4 8-4s8 1.3 8 4",
  },
  {
    id: "customers",
    label: "Customers",
    route: "/staff-rewards/customers",
    d: "M16 21v-2a4 4 0 00-3-3.87M8.5 21v-2a4 4 0 013-3.87M12.5 7a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM20 21v-2a4 4 0 00-2.5-3.7M16.5 3.7a3.5 3.5 0 010 6.6",
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    route: "/rewards",
    d: "M6 9V4h12v5a6 6 0 01-12 0zM9 20h6M12 15v5",
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
