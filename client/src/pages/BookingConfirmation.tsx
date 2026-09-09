import { ArrowLeft, ArrowUpRight, BookOpenCheck, CalendarCheck2, CheckCircle2, Clock3, Download, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import BrandLockup from "@/components/BrandLockup";
import ThemeToggle from "@/components/ThemeToggle";
import { preCallPreparationItems } from "@/lib/bookingExperience";
import { consultingProfile } from "@/lib/consultingProfile";
import { postCallResourcesPath, preCallChecklistUrl } from "@/lib/bookingResources";
import { toast } from "sonner";
import { toastMessages } from "@/lib/toastMessages";

export default function BookingConfirmation() {
  const [, setLocation] = useLocation();
  const [isPreparingChecklist, setIsPreparingChecklist] = useState(false);
  useEffect(() => {
    toast.success(toastMessages.bookingConfirmed);
  }, []);
  const prepareChecklist = () => {
    setIsPreparingChecklist(true);
    toast.info(toastMessages.checklistPreparing);
    window.setTimeout(() => setIsPreparingChecklist(false), 900);
  };
  const openPostCallResources = () => {
    toast.info(toastMessages.resourcesOpening);
    setLocation(postCallResourcesPath);
  };
  const explorePatterns = () => {
    toast.info(toastMessages.patternsOpening);
    setLocation("/");
  };
  return <div className="min-h-screen bg-[#060b18] text-slate-100"><header className="sticky top-0 z-40 border-b border-white/8 bg-[#07101e]/86 backdrop-blur-xl"><div className="container flex items-center justify-between gap-4 py-3"><button onClick={() => setLocation("/")} className="text-left"><BrandLockup size={34} /></button><ThemeToggle className="hidden sm:inline-flex" /></div></header><main className="container grid min-h-[calc(100vh-6rem)] place-items-center py-12 sm:py-18"><section className="w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(21,33,59,.96),rgba(9,17,34,.96))] shadow-[0_38px_100px_-42px_rgba(29,139,245,.72)]"><div className="border-b border-white/8 bg-[radial-gradient(circle_at_82%_15%,rgba(47,191,222,.20),transparent_26rem)] px-6 py-9 sm:px-10"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-200"><CalendarCheck2 className="h-6 w-6" /></span><p className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[.16em] text-cyan-300">Booking confirmed</p><h1 className="mt-3 text-3xl font-extrabold tracking-[-.045em] text-white sm:text-5xl">Your conversation is on the calendar.</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Calendly will send the appointment details. Use the short preparation guide below to make the 30-minute architecture discussion useful from the start.</p></div><div className="grid gap-8 px-6 py-8 sm:grid-cols-[1.15fr_.85fr] sm:px-10 sm:py-10"><div><p className="font-mono text-[11px] font-semibold uppercase tracking-[.14em] text-cyan-300">Before the call</p><ul className="mt-5 space-y-4">{preCallPreparationItems.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />{item}</li>)}</ul><div className="mt-6 flex flex-wrap gap-3"><a href={preCallChecklistUrl} download onClick={prepareChecklist} className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-3.5 py-2.5 text-sm font-bold text-cyan-100 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200/50 hover:bg-cyan-300/18 active:scale-[.98]">{isPreparingChecklist ? <Download className="h-4 w-4 animate-bounce" /> : <Download className="h-4 w-4" />}{isPreparingChecklist ? "Preparing checklist…" : "Download pre-call checklist"}</a><button onClick={openPostCallResources} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2.5 text-sm font-bold text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-white/5 active:scale-[.98]"><BookOpenCheck className="h-4 w-4 text-cyan-300" /> Post-call resources</button></div><p className="mt-6 text-xs leading-5 text-slate-500">Please avoid sharing credentials, personal data, or other sensitive material in advance. We can discuss the appropriate secure route during the call.</p></div><aside className="rounded-2xl border border-white/9 bg-white/[.035] p-5"><p className="flex items-center gap-2 text-sm font-bold text-white"><Clock3 className="h-4 w-4 text-cyan-300" /> 30-minute architecture discussion</p><p className="mt-3 text-sm leading-6 text-slate-400">If you need to change the appointment, use the Calendly message in your calendar confirmation.</p><a href={`mailto:${consultingProfile.directInquiryEmail}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-100"><Mail className="h-4 w-4" /> Contact before the call <ArrowUpRight className="h-3.5 w-3.5" /></a><div className="mt-6 border-t border-white/8 pt-5"><p className="flex gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="h-4 w-4 shrink-0 text-cyan-300" /> The session is focused on architecture and delivery considerations, not a sales intake process.</p></div></aside></div><div className="flex flex-col gap-3 border-t border-white/8 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10"><button onClick={() => setLocation("/expert")} className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to booking</button><button onClick={explorePatterns} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4f89d9] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-950/30 hover:bg-[#619be5]">Explore implementation patterns <ArrowUpRight className="h-4 w-4" /></button></div></section></main></div>;
}
