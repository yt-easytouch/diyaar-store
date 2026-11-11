import icon from "@/assets/diyaar-icon.svg";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img src={icon} alt="" className={cn("shrink-0 rounded-[22%]", compact ? "h-8 w-8" : "h-9 w-9")} />
      <span className="leading-none">
        <span className={cn("block font-bold tracking-tight", compact ? "text-base" : "text-lg")}>Diyaar</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Business</span>
      </span>
    </div>
  );
}

/** The app icon: the green Diyaar mark on the deep-teal tile. */
export function LogoMark({ className }: { className?: string }) {
  return <img src={icon} alt="Diyaar" className={className} />;
}
