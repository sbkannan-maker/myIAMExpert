import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import VisualPreferencesPanel from "@/components/VisualPreferencesPanel";

export default function ThemeToggle({ label = false, className = "", hidePreferencesOnMobile = false }: { label?: boolean; className?: string; hidePreferencesOnMobile?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const nextLabel = theme === "dark" ? "Light" : "Dark";
  return <span className={`inline-flex items-center gap-2 ${className}`}><button onClick={toggleTheme} aria-label={`Switch to ${nextLabel.toLowerCase()} mode`} aria-pressed={theme === "dark"} title={`Switch to ${nextLabel.toLowerCase()} mode`} className="inline-flex items-center justify-center gap-2 rounded-full border border-border/80 bg-background/80 p-2.5 text-muted-foreground shadow-lg shadow-black/5 transition hover:-translate-y-0.5 hover:border-accent/55 hover:text-foreground active:scale-[0.97]">{theme === "dark" ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-primary" />}{label && <span className="text-xs font-semibold">{nextLabel} mode</span>}</button><VisualPreferencesPanel className={hidePreferencesOnMobile ? "max-sm:hidden" : ""} /></span>;
}
