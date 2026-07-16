import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

// On mobile viewports the app fills the whole device screen. From the `md`
// breakpoint up (tablet/desktop) it renders inside a fixed phone-frame
// (9:19.5 ratio, bounded to 48vw x 92vh) so the app can be previewed like a
// phone on a larger screen.
const DESKTOP_FRAME_WIDTH = "md:w-[min(48vw,calc(92vh*9/19.5))]";
const DESKTOP_FRAME_HEIGHT = "md:h-[min(92vh,calc(48vw*19.5/9))]";

export default function MobileLayout({ children, className = "" }: MobileLayoutProps) {
  return (
    <div className={`min-h-screen w-full bg-[#f5f7f8] flex items-center justify-center ${className}`}>
      <div
        className={`relative overflow-hidden bg-cover bg-center w-screen h-screen md:shadow-2xl ${DESKTOP_FRAME_WIDTH} ${DESKTOP_FRAME_HEIGHT}`}
        style={{ backgroundImage: "url(/coverImage.jpg)" }}
      >
        <div className="absolute inset-0 bg-[#003883]/70 pointer-events-none" />
        <div className="relative h-full w-full overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
