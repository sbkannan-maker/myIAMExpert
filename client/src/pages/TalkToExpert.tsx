import { ArrowUpRight, CalendarDays, Check, CheckCircle2, Clock3, Copy, Linkedin, Loader2, LockKeyhole, QrCode, Send, ShieldCheck, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import PublicSiteHeader from "@/components/PublicSiteHeader";
import ExpertConsultingContext from "@/components/ExpertConsultingContext";
import { bookingSecureLoadingCopy, getBookingTrackingEvent, getVisitorTimezoneContext } from "@/lib/bookingExperience";
import { calendlyUnavailableMessage, getCalendlyEmbedUrl } from "@/lib/calendlyEmbed";
import { getConsultationChannelState, type ConsultationChannel } from "@/lib/consultationChannel";
import { consultingProfile } from "@/lib/consultingProfile";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import QRCode from "qrcode";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const engagementSteps = [
  ["01", "Select your preferred channel", "Book a direct 30-minute discussion or frame your architecture context in writing first."],
  ["02", "30-minute architecture discovery", "Map the current environment, integration constraints, delivery controls, and decision points."],
  ["03", "Targeted next-step guidance", "Receive a practical response centered on the relevant architecture and delivery considerations."],
] as const;
const whatsappCommunityHref = "https://chat.whatsapp.com/KdaifKJ9LMc5j8eM5Ow6el";
const whatsappCommunityIcon = "/manus-storage/whatsapp-community-icon_6871e592.png";

export default function TalkToExpert() {
  const [, setLocation] = useLocation();
  const [channel, setChannel] = useState<ConsultationChannel>("booking");
  const [form, setForm] = useState({ name: "", email: "", organization: "", topic: "Identity governance architecture", message: "", website: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isCalendlyLoading, setIsCalendlyLoading] = useState(true);
  const [isCalendlyUnavailable, setIsCalendlyUnavailable] = useState(false);
  const [calendarAttempt, setCalendarAttempt] = useState(0);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [communityCopyState, setCommunityCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [communityQrCode, setCommunityQrCode] = useState<string | null>(null);
  const [timezoneContext, setTimezoneContext] = useState(() => getVisitorTimezoneContext());
  const calendlyHostRef = useRef<HTMLDivElement>(null);
  const trackedBookingEvents = useRef(new Set<string>());
  const inquiry = trpc.consulting.submitInquiry.useMutation({ onSuccess: () => setSubmitted(true) });
  const { mutate: trackBookingEvent } = trpc.booking.track.useMutation();
  const calendlyEmbedUrl = getCalendlyEmbedUrl(consultingProfile.calendlyUrl);

  useEffect(() => {
    setTimezoneContext(getVisitorTimezoneContext());
    let active = true;
    QRCode.toDataURL(whatsappCommunityHref, { width: 240, margin: 2, errorCorrectionLevel: "M", color: { dark: "#0b1220", light: "#ffffff" } }).then((dataUrl) => {
      if (active) setCommunityQrCode(dataUrl);
    }).catch(() => {
      if (active) setCommunityQrCode(null);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (channel !== "booking") return;
    const host = calendlyHostRef.current;
    if (!host) return;
    let active = true;
    let calendarRendered = false;
    setIsCalendlyLoading(true);
    setIsCalendlyUnavailable(false);
    setCopyStatus("idle");

    const frame = document.createElement("iframe");
    frame.src = calendlyEmbedUrl;
    frame.title = "Book a 30-minute consultation with Kannan Sriniyappan Balakrishnan";
    frame.loading = "eager";
    frame.allow = "fullscreen";
    frame.className = "h-[500px] w-full rounded-[1rem] border-0 bg-white sm:h-[540px]";
    frame.addEventListener("load", () => {
      if (!active) return;
      calendarRendered = true;
      setIsCalendlyLoading(false);
    });
    frame.addEventListener("error", () => {
      if (!active) return;
      setIsCalendlyLoading(false);
      setIsCalendlyUnavailable(true);
    });
    host.innerHTML = "";
    host.appendChild(frame);

    const handleBookingMessage = (event: MessageEvent) => {
      const trackingEvent = getBookingTrackingEvent(event.data?.event);
      if (!trackingEvent || trackedBookingEvents.current.has(trackingEvent)) return;
      trackedBookingEvents.current.add(trackingEvent);
      trackBookingEvent({ eventType: trackingEvent });
      if (trackingEvent === "booking_completed") setLocation("/booking-confirmed");
    };
    window.addEventListener("message", handleBookingMessage);
    const recoveryTimer = window.setTimeout(() => {
      if (active && !calendarRendered) {
        setIsCalendlyLoading(false);
        setIsCalendlyUnavailable(true);
      }
    }, 10_000);

    return () => {
      active = false;
      window.clearTimeout(recoveryTimer);
      window.removeEventListener("message", handleBookingMessage);
    };
  }, [calendarAttempt, calendlyEmbedUrl, channel, setLocation, trackBookingEvent]);

  const activate = (next: ConsultationChannel) => {
    setChannel(next);
    const { panelId } = getConsultationChannelState(next);
    window.setTimeout(() => document.getElementById(panelId)?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
  };

  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);
    inquiry.mutate(form);
  };

  const copyInquiryEmail = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(consultingProfile.directInquiryEmail);
      setCopyStatus("copied");
      toast.success("Email copied!");
    } catch {
      setCopyStatus("error");
    }
  };
  const copyCommunityInvite = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(whatsappCommunityHref);
      setCommunityCopyState("copied");
      toast.success("Link copied", { description: "The WhatsApp community invite is ready to share.", duration: 2200 });
      window.setTimeout(() => setCommunityCopyState("idle"), 1800);
    } catch {
      setCommunityCopyState("error");
      toast.error("Could not copy the community invite.");
    }
  };

  const tabClass = (active: boolean) => `flex-1 rounded-xl px-3 py-3 text-[11px] font-bold uppercase tracking-[.1em] transition ${active ? "bg-[#6194dc] text-white shadow-[0_10px_24px_-13px_rgba(86,157,255,.95)]" : "text-slate-400 hover:bg-white/5 hover:text-white"}`;

  return <div className="expert-page min-h-screen bg-[#060b18] text-slate-100 selection:bg-cyan-300/30">
    <PublicSiteHeader currentPath="/expert" />
    <main>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_74%_28%,rgba(26,97,169,.22),transparent_30%),radial-gradient(circle_at_22%_76%,rgba(31,192,221,.12),transparent_36%),#060b18]" />
        <div className="container grid gap-9 py-12 lg:min-h-[760px] lg:grid-cols-[.83fr_1.17fr] lg:items-start lg:py-18">
          <div className="lg:pr-4">
            <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[.18em] text-cyan-300"><Sparkles className="h-4 w-4" /> Direct identity advisory</p>
            <h1 className="mt-5 max-w-xl text-[clamp(3.15rem,6vw,5.9rem)] font-extrabold leading-[.96] tracking-[-.07em] text-white">Let’s master your <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-[#4a9ce5] bg-clip-text text-transparent">identity security.</span></h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-slate-300">Connect directly with a recognised SailPoint Ambassador. No sales layers or delegated intake—just focused technical advisory tailored to your identity environment.</p>
            <div className="mt-9 rounded-[1.8rem] border border-white/9 bg-[linear-gradient(145deg,rgba(24,38,67,.76),rgba(10,18,37,.76))] p-6 shadow-[0_24px_70px_-46px_rgba(64,155,255,.72)] backdrop-blur sm:p-7">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[.14em] text-slate-100">What to expect</p>
              <div className="mt-6 space-y-5">{engagementSteps.map(([number, title, detail]) => <div key={number} className="grid grid-cols-[34px_1fr] gap-3"><span className="grid h-8 w-8 place-items-center rounded-full border border-cyan-200/20 bg-cyan-300/7 font-mono text-[10px] text-cyan-200">{number}</span><div><h2 className="text-[15px] font-bold tracking-[-.02em] text-white">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-400">{detail}</p></div></div>)}</div>
            </div>
            <div className="mt-7 rounded-2xl border border-emerald-300/16 bg-emerald-400/[.045] p-4"><p className="text-xs text-slate-400">Prefer direct email? Reach out at <a href={`mailto:${consultingProfile.directInquiryEmail}`} className="font-semibold text-cyan-300 hover:text-cyan-100">{consultingProfile.directInquiryEmail}</a></p><div className="community-contact-pulse mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-300/18 bg-emerald-300/[.035] p-2.5"><span className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-emerald-400/10"><img src={whatsappCommunityIcon} alt="" className="h-5 w-5 object-contain" /></span><p className="min-w-40 flex-1 text-xs leading-5 text-slate-300">Prefer peer discussion? <a href={whatsappCommunityHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-200 hover:text-emerald-100">Join the WhatsApp Community</a>.</p><button type="button" onClick={copyCommunityInvite} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-2 text-[11px] font-bold text-emerald-100 outline-none transition hover:bg-emerald-400/18 focus-visible:ring-2 focus-visible:ring-emerald-300" aria-live="polite">{communityCopyState === "copied" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{communityCopyState === "copied" ? "Invite copied" : "Share this community"}</button><Dialog><DialogTrigger asChild><button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-2 text-[11px] font-bold text-cyan-100 outline-none transition hover:bg-cyan-300/18 focus-visible:ring-2 focus-visible:ring-cyan-300" aria-label="Show QR code to join the WhatsApp community"><QrCode className="h-3.5 w-3.5" />Scan to join</button></DialogTrigger><DialogContent className="border-white/10 bg-[#0b1426] text-white sm:max-w-sm"><DialogHeader><DialogTitle>Scan to join the WhatsApp community</DialogTitle><DialogDescription className="text-slate-400">Open your phone camera and scan this code to open the myIAM community invite.</DialogDescription></DialogHeader><div className="mx-auto mt-2 rounded-2xl bg-white p-4">{communityQrCode ? <img src={communityQrCode} alt="QR code for the myIAM WhatsApp community invite" className="h-52 w-52" /> : <div className="grid h-52 w-52 place-items-center text-center text-xs text-slate-700">QR code unavailable. Use the community link instead.</div>}</div><button type="button" onClick={copyCommunityInvite} className="mx-auto inline-flex items-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-100 outline-none transition hover:bg-cyan-300/18 focus-visible:ring-2 focus-visible:ring-cyan-300" aria-live="polite"><Copy className="h-3.5 w-3.5" />{communityCopyState === "copied" ? "Link copied" : "Copy Link"}</button><a href={whatsappCommunityHref} target="_blank" rel="noopener noreferrer" className="mx-auto inline-flex items-center gap-2 text-xs font-semibold text-emerald-200 hover:text-emerald-100">Open invite directly <ArrowUpRight className="h-3.5 w-3.5" /></a></DialogContent></Dialog>{communityCopyState === "error" && <p role="status" className="w-full text-[11px] text-rose-200">Copy was unavailable. Select the invite link manually.</p>}</div></div>
          </div>
          <div id="consultation-panel" className="rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(21,33,59,.94),rgba(9,17,34,.94))] p-3 shadow-[0_36px_90px_-42px_rgba(24,112,225,.7)] backdrop-blur-xl sm:p-5">
            <div className="flex gap-1 rounded-2xl border border-black/20 bg-[#07101f]/85 p-1.5" role="tablist" aria-label="Contact method">
              <button onClick={() => activate("booking")} className={tabClass(channel === "booking")} role="tab" aria-selected={channel === "booking"}>Schedule direct call</button>
              <button onClick={() => activate("inquiry")} className={tabClass(channel === "inquiry")} role="tab" aria-selected={channel === "inquiry"}>Send inquiry message</button>
            </div>
            {channel === "booking" ? <div className="mt-4">
              <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-50 p-2 shadow-inner">
                <div className="pointer-events-none absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/92 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur" aria-live="polite"><span className={`h-2 w-2 rounded-full ${isCalendlyUnavailable ? "bg-amber-500" : "bg-cyan-500"} ${isCalendlyLoading ? "animate-pulse" : ""}`} />{isCalendlyLoading ? "Verifying live booking availability" : isCalendlyUnavailable ? "Calendly event unavailable" : "Direct availability"}</div>
                <div ref={calendlyHostRef} className="min-h-[500px] rounded-[1rem] bg-white sm:min-h-[540px]" />
                {isCalendlyLoading && <div className="absolute inset-0 grid place-items-center bg-white/90 p-8 pt-20 text-center text-slate-600 backdrop-blur-[2px]"><div><Loader2 className="mx-auto h-7 w-7 animate-spin text-[#4f89d9]" /><p className="mt-4 text-sm font-bold text-slate-900">Loading consultation times</p><p className="mt-1 text-xs leading-5">{bookingSecureLoadingCopy}</p></div></div>}
                {isCalendlyUnavailable && <div className="absolute inset-0 grid place-items-center bg-white/98 p-6 text-center sm:p-8"><div className="max-w-sm"><CalendarDays className="mx-auto h-7 w-7 text-[#4f89d9]" /><p className="mt-4 text-base font-bold text-slate-900">The configured Calendly event is unavailable.</p><p className="mt-2 text-sm leading-6 text-slate-600">{calendlyUnavailableMessage}</p><div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-slate-500">Direct inquiry email</p><div className="mt-2 flex items-center justify-between gap-2"><a href={`mailto:${consultingProfile.directInquiryEmail}`} className="min-w-0 truncate text-sm font-semibold text-slate-900">{consultingProfile.directInquiryEmail}</a><button type="button" onClick={copyInquiryEmail} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-bold text-[#2f6fc4]">{copyStatus === "copied" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copyStatus === "copied" ? "Copied" : "Copy"}</button></div>{copyStatus === "error" && <p role="status" className="mt-2 text-xs text-red-600">Copy was unavailable. Select the address manually.</p>}</div><div className="mt-5 flex flex-wrap justify-center gap-3"><button onClick={() => activate("inquiry")} className="rounded-xl bg-[#4f89d9] px-4 py-2.5 text-sm font-bold text-white">Send an inquiry</button><button onClick={() => setCalendarAttempt(attempt => attempt + 1)} className="text-sm font-bold text-[#2f6fc4]">Retry calendar</button></div></div></div>}
              </div>
              <div className="mt-3 grid gap-3 rounded-2xl border border-cyan-300/14 bg-cyan-300/[.045] p-4 text-sm sm:grid-cols-[1.2fr_.8fr] sm:items-center">
                <p className="flex gap-2 leading-6 text-slate-200"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />{bookingSecureLoadingCopy}</p>
                <div className="border-t border-white/8 pt-3 text-xs leading-5 text-slate-400 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0"><p className="flex items-center gap-2 font-semibold text-slate-200"><Clock3 className="h-3.5 w-3.5 text-cyan-300" /> Your local time</p><p className="mt-1">{timezoneContext.localTime} · {timezoneContext.zone}</p><p className="mt-1 text-slate-500">Calendly displays each available slot in the event’s selected time zone.</p></div>
              </div>
            </div> : <form id="inquiry-form" onSubmit={submitInquiry} className="mt-4 rounded-[1.4rem] border border-white/9 bg-[#0a1427]/72 p-5 sm:p-7">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[.16em] text-cyan-300">Frame the architecture challenge</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Share enough context to make the initial response useful. This sends a direct owner notification.</p>
              <input className="hidden" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} aria-hidden="true" />
              <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-[11px] font-bold uppercase tracking-[.1em] text-slate-400">Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-xl border border-white/11 bg-white/5 px-3.5 py-3 text-sm normal-case tracking-normal text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/15" placeholder="Your name" /></label><label className="grid gap-2 text-[11px] font-bold uppercase tracking-[.1em] text-slate-400">Work email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="rounded-xl border border-white/11 bg-white/5 px-3.5 py-3 text-sm normal-case tracking-normal text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/15" placeholder="you@company.com" /></label></div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-[11px] font-bold uppercase tracking-[.1em] text-slate-400">Company<input value={form.organization} onChange={(event) => setForm({ ...form, organization: event.target.value })} className="rounded-xl border border-white/11 bg-white/5 px-3.5 py-3 text-sm normal-case tracking-normal text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/15" placeholder="Company or team" /></label><label className="grid gap-2 text-[11px] font-bold uppercase tracking-[.1em] text-slate-400">Product focus<select value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} className="rounded-xl border border-white/11 bg-white/5 px-3.5 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/15">{consultingProfile.consultationThemes.map(theme => <option key={theme.title} className="bg-slate-900">{theme.title}</option>)}</select></label></div>
              <label className="mt-4 grid gap-2 text-[11px] font-bold uppercase tracking-[.1em] text-slate-400">What is your main IAM challenge?<textarea required value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} minLength={20} maxLength={2000} rows={5} className="resize-y rounded-xl border border-white/11 bg-white/5 px-3.5 py-3 text-sm normal-case tracking-normal text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/15" placeholder="Describe the current challenge, project timeline, or system constraints…" /></label>
              {inquiry.error && <p className="mt-4 text-sm text-red-300">{inquiry.error.message}</p>}
              {submitted && <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-300"><CheckCircle2 className="h-4 w-4" /> Your inquiry was sent. Kannan will review the context.</p>}
              <button disabled={inquiry.isPending} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#548bd2] to-[#6aa5e7] px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_32px_-12px_rgba(67,147,245,.92)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">{inquiry.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{inquiry.isPending ? "Sending inquiry…" : "Submit inquiry"}</button>
            </form>}
          </div>
        </div>
      </section><ExpertConsultingContext />
      <section className="border-y border-white/8 bg-[#081123]"><div className="container grid gap-4 py-8 sm:grid-cols-3">{consultingProfile.focusAreas.map(focus => <div key={focus} className="flex gap-3 rounded-2xl border border-white/8 bg-white/[.025] p-4"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" /><p className="text-sm font-medium leading-6 text-slate-300">{focus}</p></div>)}</div></section>
    </main>
  </div>;
}
