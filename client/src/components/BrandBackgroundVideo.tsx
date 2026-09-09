import { useEffect, useRef } from "react";
import { useVisualPreferences } from "@/contexts/VisualPreferencesContext";
import { headerLogoVideoSrc } from "@/lib/logoVideo";

export default function BrandBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isReducedMotion } = useVisualPreferences();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isReducedMotion) { video.pause(); return; }
    void video.play().catch(() => undefined);
  }, [isReducedMotion]);

  return <video ref={videoRef} autoPlay={!isReducedMotion} loop muted playsInline preload="metadata" className="absolute inset-0 -z-30 h-full w-full object-cover opacity-[0.22] mix-blend-screen" aria-hidden="true"><source src={headerLogoVideoSrc} type="video/mp4" /></video>;
}
