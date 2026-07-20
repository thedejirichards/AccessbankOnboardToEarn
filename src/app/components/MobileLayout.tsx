import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
}

// Fully responsive layout — fills the viewport on all sizes.
// On md+ screens, content is capped at a comfortable reading width and centered.
// The decorative cover-image background is shown on lg+ for visual polish.
export default function MobileLayout({ children, className = "", overlayClassName = "bg-[#003883]/70" }: MobileLayoutProps) {
  return (
    <div className={`min-h-screen w-full bg-[#f5f7f8] flex items-center justify-center ${className}`}>
      <div className="relative overflow-hidden bg-cover bg-center w-full h-screen lg:shadow-2xl lg:rounded-[24px] lg:max-w-[min(48vw,520px)] lg:max-h-[92vh]" style={{ backgroundImage: "url(/coverImage.jpg)" }}>
        <div className={`absolute inset-0 ${overlayClassName} pointer-events-none`} />
        <div className="relative h-full w-full overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
