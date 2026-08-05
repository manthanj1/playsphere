import type { LucideIcon } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  icon: Icon,
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {Icon ? (
          <Icon className="h-5 w-5 text-[#737688]" />
        ) : (
          <span className="text-[#737688] text-base">🔎</span>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2.5 border border-[#c3c5d9] rounded-xl leading-5 bg-white placeholder-[#737688] focus:outline-none focus:ring-2 focus:ring-[#003ec7] focus:border-[#003ec7] sm:text-sm transition-all"
      />
    </div>
  );
}
