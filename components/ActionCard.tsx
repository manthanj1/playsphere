import Link from "next/link";
import type { ReactNode } from "react";

interface ActionCardProps {
  href: string;
  title: string;
  description: string;
  image: string;
  icon: ReactNode;
  buttonText: string;
}

export default function ActionCard({
  href,
  title,
  description,
  image,
  icon,
  buttonText,
}: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group relative rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(11,28,48,0.05)] hover:shadow-[0_12px_32px_rgba(11,28,48,0.12)] transition-all duration-300 cursor-pointer h-[400px] md:h-[500px] block"
    >
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={title}
          src={image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/90 via-[#0b1c30]/40 to-transparent"></div>
      </div>
      <div className="absolute inset-0 z-10 p-8 md:p-10 flex flex-col justify-end">
        <div className="w-16 h-16 bg-[#003ec7] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:-translate-y-2 transition-transform duration-300">
          {icon}
        </div>
        <h2 className="text-3xl font-bold font-serif text-white mb-2">{title}</h2>
        <p className="text-base text-[#dce9ff] mb-6 opacity-90">{description}</p>
        <div className="self-start px-6 py-3 bg-[#003ec7] text-white text-sm font-semibold tracking-wide rounded-lg flex items-center gap-2 group-hover:bg-[#0052ff] group-hover:text-[#dfe3ff] transition-colors">
          {buttonText}
        </div>
      </div>
    </Link>
  );
}
