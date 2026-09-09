export const headerLogoVideoSrc = "/manus-storage/myiam-architecture-header_0b7d329b.mp4";
// Displayed immediately while the video loads and for a full 30-second hold after playback ends.
export const headerLogoStaticSrc = "/manus-storage/myiam-static-lockup_86d411d0.png";
export const headerLogoPosterSrc = headerLogoStaticSrc;
export const headerLogoStaticHoldMs = 30_000;
// Kept as an alias for existing consumers and test contracts.
export const headerLogoVideoCycleMs = headerLogoStaticHoldMs;

export type HeaderLogoVideoState = {
  showVideo: boolean;
  reducedMotion: boolean;
  isVideoReady: boolean;
  isPosterReady: boolean;
};

export function getHeaderLogoVideoClasses({ showVideo, reducedMotion, isVideoReady, isPosterReady }: HeaderLogoVideoState) {
  const isReady = isVideoReady || isPosterReady;
  return {
    stage: `brand-video-stage ${isReady ? "is-ready" : "is-loading"}`,
    video: `brand-logo-video ${showVideo && !reducedMotion ? "is-playing" : "is-static"} ${isVideoReady ? "is-ready" : ""}`.trim(),
  };
}
