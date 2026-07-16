import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

// Phone-frame size (9:19.5 ratio), fixed to 48vw x 92vh and used everywhere in
// the app — identical on every screen/flow at a given viewport size.
const FRAME_WIDTH = "min(48vw, calc(92vh * 9 / 19.5))";
const FRAME_HEIGHT = "min(92vh, calc(48vw * 19.5 / 9))";

export default function MobileLayout({ children, className = "" }: MobileLayoutProps) {
  return (
    <div className={`min-h-screen w-full bg-[#f5f7f8] flex items-center justify-center ${className}`}>
      <div
        className="relative overflow-hidden bg-cover bg-center shadow-2xl"
        style={{
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          backgroundImage: "url(/coverImage.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-[#003883]/70 pointer-events-none" />
        <div className="relative h-full w-full overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
