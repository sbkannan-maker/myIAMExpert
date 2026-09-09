import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { BarChart3, CalendarRange, Download, LockKeyhole, LogIn, RefreshCw, ShieldAlert } from "lucide-react";
import { FormEvent, useState } from "react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import BrandLockup from "@/components/BrandLockup";
import ThemeToggle from "@/components/ThemeToggle";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { bookingMetricsToCsv, createBookingMetricRange, formatMetricDate, normalizeBookingMetricRange } from "@/lib/bookingMetrics";
import { trpc } from "@/lib/trpc";

const chartConfig = { started: { label: "Booking starts", color: "#55d8e8" }, completed: { label: "Booking completions", color: "#6599f3" } } satisfies ChartConfig;

export default function BookingMetrics() {
  const [range, setRange] = useState(() => createBookingMetricRange(14));
  const [appliedRange, setAppliedRange] = useState(() => createBookingMetricRange(14));
  const [rangeError, setRangeError] = useState<string | null>(null);
  const { loading, user } = useAuth();
  const isOwner = user?.role === "admin";
  const metrics = trpc.booking.dailyMetrics.useQuery(appliedRange, { enabled: isOwner, refetchOnWindowFocus: false });
  const data = (metrics.data ?? []).map(metric => ({ ...metric, label: formatMetricDate(metric.date) }));
  const started = data.reduce((total, item) => total + item.started, 0);
  const completed = data.reduce((total, item) => total + item.completed, 0);

  const applyRange = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setAppliedRange(normalizeBookingMetricRange(range));
      setRangeError(null);
    } catch (error) {
      setRangeError(error instanceof Error ? error.message : "Choose a valid date range.");
    }
  };
  const useQuickRange = (days: number) => {
    const next = createBookingMetricRange(days);
    setRange(next);
    setAppliedRange(next);
    setRangeError(null);
  };
  const exportCsv = () => {
    const csv = bookingMetricsToCsv(metrics.data ?? []);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `myiam-booking-metrics-${appliedRange.startDate}-to-${appliedRange.endDate}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return <div className="min-h-screen bg-[#060b18] text-slate-100"><header className="sticky top-0 z-40 border-b border-white/8 bg-[#07101e]/86 backdrop-blur-xl"><div className="container flex items-center justify-between gap-4 py-3"><BrandLockup size={34} /><div className="flex items-center gap-2"><ThemeToggle className="hidden sm:inline-flex" /></div></div></header><main className="container py-10 sm:py-14">{loading ? <div className="grid min-h-[50vh] place-items-center text-sm text-slate-400">Loading owner dashboard…</div> : !user ? <AccessGate icon={<LockKeyhole className="mx-auto h-9 w-9 text-cyan-300" />} title="Owner access required" body="Sign in with the myIAM owner account to view aggregate booking metrics." action={<button onClick={() => startLogin()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#4f89d9] px-4 py-3 text-sm font-bold text-white"><LogIn className="h-4 w-4" /> Sign in</button>} /> : !isOwner ? <AccessGate icon={<ShieldAlert className="mx-auto h-9 w-9 text-amber-300" />} title="Access restricted" body="This dashboard is available only to the myIAM project owner." /> : <><section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[.16em] text-cyan-300"><BarChart3 className="h-4 w-4" /> Owner analytics</p><h1 className="mt-4 text-4xl font-extrabold tracking-[-.055em] text-white sm:text-5xl">Booking conversion signals.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">Anonymous aggregate counts in UTC. This dashboard never stores invitee identity, appointment information, or meeting details.</p></div><button onClick={exportCsv} disabled={metrics.isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-2.5 text-sm font-bold text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-300/15 disabled:opacity-50"><Download className="h-4 w-4" /> Export CSV</button></section><section className="mt-8 rounded-2xl border border-white/9 bg-white/[.035] p-4 sm:p-5"><div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><form onSubmit={applyRange} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><label className="grid gap-1.5 text-xs font-semibold text-slate-300">Start date<input type="date" value={range.startDate} onChange={(event) => setRange({ ...range, startDate: event.target.value })} className="rounded-lg border border-white/10 bg-[#081123] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300" /></label><label className="grid gap-1.5 text-xs font-semibold text-slate-300">End date<input type="date" value={range.endDate} onChange={(event) => setRange({ ...range, endDate: event.target.value })} className="rounded-lg border border-white/10 bg-[#081123] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300" /></label><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4f89d9] px-3.5 py-2.5 text-sm font-bold text-white hover:bg-[#619be5]"><CalendarRange className="h-4 w-4" /> Apply range</button></form><div className="flex gap-2"><button onClick={() => useQuickRange(7)} className="rounded-lg px-3 py-2 text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white">7 days</button><button onClick={() => useQuickRange(14)} className="rounded-lg px-3 py-2 text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white">14 days</button><button onClick={() => useQuickRange(30)} className="rounded-lg px-3 py-2 text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white">30 days</button></div></div>{rangeError && <p role="alert" className="mt-3 text-xs text-amber-200">{rangeError}</p>}</section><section className="mt-6 grid gap-4 sm:grid-cols-3"><Metric label="Booking starts" value={started} detail={`${appliedRange.startDate} to ${appliedRange.endDate}`} /><Metric label="Booking completions" value={completed} detail={`${appliedRange.startDate} to ${appliedRange.endDate}`} /><Metric label="Completion rate" value={started ? `${Math.round((completed / started) * 100)}%` : "—"} detail="Completions ÷ starts" /></section><section className="mt-6 rounded-[1.7rem] border border-white/9 bg-[linear-gradient(145deg,rgba(21,33,59,.9),rgba(9,17,34,.9))] p-5 sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-white">Daily booking activity</h2><p className="mt-1 text-xs text-slate-500">UTC dates · interaction signals only</p></div><button onClick={() => metrics.refetch()} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/5"><RefreshCw className={`h-3.5 w-3.5 ${metrics.isFetching ? "animate-spin" : ""}`} /> Refresh</button></div>{metrics.isLoading ? <div className="grid h-72 place-items-center text-sm text-slate-400">Loading aggregate metrics…</div> : metrics.error ? <div className="grid h-72 place-items-center text-sm text-red-300">Metrics could not be loaded. Please retry.</div> : <ChartContainer config={chartConfig} className="mt-6 h-72 w-full aspect-auto"><BarChart data={data} margin={{ left: -18, right: 8, top: 10 }}><CartesianGrid vertical={false} stroke="rgba(148,163,184,.15)" /><XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="started" fill="var(--color-started)" radius={[5, 5, 0, 0]} /><Bar dataKey="completed" fill="var(--color-completed)" radius={[5, 5, 0, 0]} /></BarChart></ChartContainer>}</section></>}</main></div>;
}

function AccessGate({ icon, title, body, action }: { icon: React.ReactNode; title: string; body: string; action?: React.ReactNode }) {
  return <section className="mx-auto grid min-h-[50vh] max-w-md place-items-center text-center"><div>{icon}<h1 className="mt-5 text-3xl font-extrabold text-white">{title}</h1><p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>{action}</div></section>;
}

function Metric({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return <div className="rounded-2xl border border-white/9 bg-white/[.035] p-5"><p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-500">{label}</p><p className="mt-3 text-3xl font-extrabold tracking-[-.04em] text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>;
}
