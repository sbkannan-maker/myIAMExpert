import { Volume2, VolumeX } from "lucide-react";
import { useLogoVideoAudio } from "@/contexts/LogoVideoAudioContext";
import { useVisualPreferences } from "@/contexts/VisualPreferencesContext";

export default function LogoSoundToggle({ label = false, className = "" }: { label?: boolean; className?: string }) {
  const { isSoundOn, toggleSound } = useLogoVideoAudio();
  const { isReducedMotion: reducedMotion } = useVisualPreferences();
  const action = isSoundOn ? "Mute logo audio" : "Play logo audio";
  const title = reducedMotion ? "Logo audio is unavailable while reduced motion is enabled" : action;
  return <button onClick={() => { void toggleSound(); }} disabled={reducedMotion} aria-label={title} aria-pressed={isSoundOn} title={title} className={`inline-flex items-center justify-center gap-2 rounded-full border border-border/80 bg-background/80 p-2.5 text-muted-foreground shadow-lg shadow-black/5 transition hover:-translate-y-0.5 hover:border-accent/55 hover:text-foreground active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${className}`}>{isSoundOn ? <Volume2 className="h-4 w-4 text-accent" /> : <VolumeX className="h-4 w-4 text-primary" />}{label && <span className="text-xs font-semibold">{reducedMotion ? "Logo audio off" : isSoundOn ? "Logo sound on" : "Logo sound"}</span>}</button>;
}
