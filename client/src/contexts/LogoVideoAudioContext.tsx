import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useVisualPreferences } from "@/contexts/VisualPreferencesContext";

type LogoVideoAudioValue = {
  isSoundOn: boolean;
  registerVideo: (video: HTMLVideoElement | null) => () => void;
  toggleSound: () => Promise<void>;
};

const LogoVideoAudioContext = createContext<LogoVideoAudioValue | null>(null);
const preferenceKey = "myiam-header-video-sound";

export function LogoVideoAudioProvider({ children }: { children: ReactNode }) {
  const { isReducedMotion } = useVisualPreferences();
  const [isSoundOn, setIsSoundOn] = useState(() => typeof window !== "undefined" && window.sessionStorage.getItem(preferenceKey) === "on");
  const soundRef = useRef(isSoundOn);
  const videos = useRef(new Set<HTMLVideoElement>());
  const activeVideo = useRef<HTMLVideoElement | null>(null);

  useEffect(() => { soundRef.current = isSoundOn; }, [isSoundOn]);

  const registerVideo = useCallback((video: HTMLVideoElement | null) => {
    if (!video) return () => undefined;
    videos.current.add(video);
    activeVideo.current = video;
    video.muted = true;
    video.volume = 0.72;
    return () => {
      videos.current.delete(video);
      if (activeVideo.current === video) activeVideo.current = Array.from(videos.current).at(-1) ?? null;
    };
  }, []);

  const toggleSound = useCallback(async () => {
    if (isReducedMotion) {
      videos.current.forEach(video => { video.pause(); video.muted = true; });
      soundRef.current = false;
      window.sessionStorage.setItem(preferenceKey, "off");
      setIsSoundOn(false);
      return;
    }
    const next = !soundRef.current;
    soundRef.current = next;
    videos.current.forEach(video => { video.muted = true; });
    const video = activeVideo.current;
    if (video && next) {
      if (video.ended || video.currentTime >= Math.max(video.duration - 0.05, 0)) video.currentTime = 0;
      video.muted = false;
      video.volume = 0.72;
      try { await video.play(); } catch { video.muted = true; soundRef.current = false; setIsSoundOn(false); return; }
    }
    if (typeof window !== "undefined") window.sessionStorage.setItem(preferenceKey, next ? "on" : "off");
    setIsSoundOn(next);
  }, [isReducedMotion]);

  return <LogoVideoAudioContext.Provider value={{ isSoundOn, registerVideo, toggleSound }}>{children}</LogoVideoAudioContext.Provider>;
}

export function useLogoVideoAudio() {
  const context = useContext(LogoVideoAudioContext);
  if (!context) throw new Error("useLogoVideoAudio must be used within LogoVideoAudioProvider");
  return context;
}
