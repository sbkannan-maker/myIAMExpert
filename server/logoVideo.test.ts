import { describe, expect, it } from "vitest";
import { getHeaderLogoVideoClasses, headerLogoPosterSrc, headerLogoStaticHoldMs, headerLogoVideoCycleMs, headerLogoVideoSrc } from "../client/src/lib/logoVideo";

describe("shared header brand video", () => {
  it("uses the supplied managed MP4 with a matching static fallback and a thirty-second recurrence", () => {
    expect(headerLogoVideoSrc).toBe("/manus-storage/myiam-architecture-header_0b7d329b.mp4");
    expect(headerLogoPosterSrc).toBe("/manus-storage/myiam-static-lockup_86d411d0.png");
    expect(headerLogoStaticHoldMs).toBe(30_000);
    expect(headerLogoVideoCycleMs).toBe(30_000);
  });

  it("exposes a loading skeleton first, cross-fades a ready playing video, and retains the poster for static reduced-motion states", () => {
    expect(getHeaderLogoVideoClasses({ showVideo: true, reducedMotion: false, isVideoReady: false, isPosterReady: false })).toEqual({ stage: "brand-video-stage is-loading", video: "brand-logo-video is-playing" });
    expect(getHeaderLogoVideoClasses({ showVideo: true, reducedMotion: false, isVideoReady: true, isPosterReady: true })).toEqual({ stage: "brand-video-stage is-ready", video: "brand-logo-video is-playing is-ready" });
    expect(getHeaderLogoVideoClasses({ showVideo: false, reducedMotion: true, isVideoReady: true, isPosterReady: true })).toEqual({ stage: "brand-video-stage is-ready", video: "brand-logo-video is-static is-ready" });
  });
});
