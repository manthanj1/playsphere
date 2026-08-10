import Link from "next/link";
import NavActions from "./NavActions";

interface NavbarProps {
  logoAsSpan?: boolean;
  showProfileIcon?: boolean;
  centerContent?: React.ReactNode;
}

export default function Navbar({ 
  logoAsSpan = false, 
  showProfileIcon = true,
  centerContent 
}: NavbarProps) {
  return (
    <header className="sticky w-full top-0 z-50 bg-[#f8f9ff] shadow-sm">
      <div className="flex items-center justify-between w-full px-4 md:px-12 py-4 max-w-[1280px] mx-auto relative">
        
        {logoAsSpan ? (
          <span className="text-3xl md:text-4xl italic font-black font-serif text-[#003ec7] tracking-tighter">
            PlaySphere
          </span>
        ) : (
          <span className="text-3xl md:text-4xl italic font-black font-serif text-[#003ec7] tracking-tighter">
            PlaySphere
          </span>
        )}

        {centerContent && (
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            {centerContent}
          </div>
        )}

        {showProfileIcon && (
          <NavActions />
        )}
      </div>
    </header>
  );
}