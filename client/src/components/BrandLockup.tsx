import { useEffect, useRef, useState } from "react";
import { useLogoVideoAudio } from "@/contexts/LogoVideoAudioContext";
import { useVisualPreferences } from "@/contexts/VisualPreferencesContext";
import { getHeaderLogoVideoClasses, headerLogoPosterSrc, headerLogoStaticHoldMs, headerLogoVideoSrc } from "@/lib/logoVideo";

type BrandLockupProps = {
  size?: number;
  markClassName?: string;
  className?: string;
};

export default function BrandLockup({ size = 58, className = "" }: BrandLockupProps) {
  const displayedHeight = Math.max(size * 1.42, 82);
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundOnRef = useRef(false);
  const [showVideo, setShowVideo] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPosterReady, setIsPosterReady] = useState(false);
  const { isSoundOn, registerVideo } = useLogoVideoAudio();
  const { isReducedMotion: reducedMotion } = useVisualPreferences();

  useEffect(() => registerVideo(videoRef.current), [registerVideo]);

  useEffect(() => { soundOnRef.current = isSoundOn; }, [isSoundOn]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isSoundOn;
    if (isSoundOn && !reducedMotion) {
      if (video.ended || video.currentTime >= Math.max(video.duration - 0.05, 0)) video.currentTime = 0;
      setShowVideo(true);
      void video.play().catch(() => undefined);
    }
  }, [isSoundOn, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      const video = videoRef.current;
      if (video) { video.pause(); video.muted = true; }
      setShowVideo(false);
      return;
    }
    let mounted = true;
    let replayTimeout: number | undefined;
    const clearReplay = () => {
      if (replayTimeout !== undefined) window.clearTimeout(replayTimeout);
      replayTimeout = undefined;
    };
    const playClip = () => {
      const video = videoRef.current;
      if (!mounted || !video) return;
      clearReplay();
      setShowVideo(true);
      video.currentTime = 0;
      video.muted = !soundOnRef.current;
      void video.play().catch(() => { if (mounted) scheduleReplay(); });
    };
    const scheduleReplay = () => {
      if (!mounted) return;
      setShowVideo(false);
      clearReplay();
      replayTimeout = window.setTimeout(playClip, headerLogoStaticHoldMs);
    };
    const video = videoRef.current;
    video?.addEventListener("ended", scheduleReplay);
    playClip();
    return () => { mounted = false; clearReplay(); video?.removeEventListener("ended", scheduleReplay); };
  }, [reducedMotion]);

  const isReady = isVideoReady || isPosterReady;
  const videoClasses = getHeaderLogoVideoClasses({ showVideo, reducedMotion, isVideoReady, isPosterReady });
  return <span className={`brand-video-lockup inline-flex min-w-0 flex-col items-start ${className}`}><span className={videoClasses.stage} style={{ height: displayedHeight, width: displayedHeight * (16 / 9) }} role="img" aria-label="myIAM brand animation"><span className="brand-video-skeleton" aria-hidden="true"><span className="brand-video-skeleton-orbit" /></span><img src={headerLogoPosterSrc} alt="" aria-hidden="true" onLoad={() => setIsPosterReady(true)} className="brand-video-poster" /><video ref={videoRef} src={headerLogoVideoSrc} poster={headerLogoPosterSrc} playsInline preload="metadata" className={videoClasses.video} onLoadedData={() => setIsVideoReady(true)} onCanPlay={() => setIsVideoReady(true)} onError={() => setShowVideo(false)} aria-hidden="true" /></span><span className="brand-caption mt-1 max-w-full font-mono text-[9px] font-semibold leading-none tracking-[.08em] sm:text-[10px] sm:tracking-[.1em]">Enrich Your Innovation &amp; Elevate Your Identity</span></span>;
}
