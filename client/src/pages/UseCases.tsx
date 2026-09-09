import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, BookOpenCheck, Bookmark, BookmarkCheck, CheckCircle2, Filter, GitPullRequest, ScanSearch, Share2, SlidersHorizontal, Sparkles, Waypoints } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCases30 as useCases, categories, complexityLevels } from "@/lib/useCases30";
import { useSavedUseCases } from "@/hooks/useSavedUseCases";
import IdentityMark from "@/components/IdentityMark";
import FeaturedKnowledgeInsights from "@/components/FeaturedKnowledgeInsights";
import PublicSiteHeader from "@/components/PublicSiteHeader";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { toastMessages } from "@/lib/toastMessages";
import { catalogSharePath, parseCatalogShareState } from "@/lib/useCaseCatalogUrl";

const categoryShortcuts = ["JML", "Compliance", "RBAC", "Workflows", "Governance", "Security"];
const conciseTaxonomyLabels: Record<string, { short: string; full: string }> = {
  JML: { short: "Lifecycle", full: "Identity lifecycle management" },
  Compliance: { short: "Compliance", full: "Access certification and compliance" },
  RBAC: { short: "Roles", full: "Role-based access control" },
  Workflows: { short: "Workflows", full: "Custom workflows and integrations" },
  Governance: { short: "Governance", full: "Advanced governance and intelligence" },
  Infrastructure: { short: "Platform", full: "Infrastructure and troubleshooting" },
  Security: { short: "Security", full: "Privileged and security controls" },
  Advanced: { short: "Advanced", full: "Advanced implementation scenarios" },
};
const popularPatternIds = [5, 7, 31] as const;
const taxonomyLabel = (id: string, fallback: string) => conciseTaxonomyLabels[id] ?? { short: fallback, full: fallback };
const discoverySteps = [
  { number: "01", title: "Frame the problem", emphasis: "Start with the outcome.", body: "Search the business control or technical challenge—not just a SailPoint object name.", icon: ScanSearch },
  { number: "02", title: "Select a fit", emphasis: "Use domain and complexity.", body: "Filter for the delivery discipline and implementation depth your team can support today.", icon: SlidersHorizontal },
  { number: "03", title: "Open the blueprint", emphasis: "Turn insight into delivery work.", body: "Each pattern leads to technical components, a build sequence, and evidence to retain.", icon: Waypoints },
];
const catalogSections = [
  { id: "catalog-discovery", label: "How to use the catalog" },
  { id: "catalog", label: "Browse patterns" },
];

function ComplexityMeter({ level, compact = false }: { level: string; compact?: boolean }) {
  const activeCount = level === "Advanced" ? 3 : level === "Intermediate" ? 2 : 1;
  const tone = level === "Advanced" ? "bg-rose-400" : level === "Intermediate" ? "bg-amber-300" : "bg-emerald-400";
  return <span className="inline-flex items-center gap-1" aria-label={`${level} complexity`} title={`${level} complexity`}>
    {!compact && <span className="mr-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{level}</span>}
    {[1, 2, 3].map((dot) => <span key={dot} className={`h-1.5 w-1.5 rounded-full ${dot <= activeCount ? tone : "bg-muted"}`} />)}
  </span>;
}

export default function UseCases() {
  const [initialCatalogState] = useState(() => parseCatalogShareState(typeof window === "undefined" ? "" : window.location.search));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => categories.some((item) => item.id === initialCatalogState.category) ? initialCatalogState.category ?? null : null);
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(() => complexityLevels.some((item) => item.id === initialCatalogState.complexity) ? initialCatalogState.complexity ?? null : null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [activeSection, setActiveSection] = useState(catalogSections[0].id);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [aiResultIds, setAiResultIds] = useState<number[] | null>(() => initialCatalogState.aiResultIds?.filter((id) => useCases.some((useCase) => useCase.id === id)) ?? null);
  const [, setLocation] = useLocation();
  const { savedIds, isSaved, toggleSaved, clearSaved } = useSavedUseCases();

  const filteredUseCases = useMemo(() => useCases.filter((useCase) => {
    const matchesAi = !aiResultIds || aiResultIds.includes(useCase.id);
    const matchesSaved = !showSavedOnly || savedIds.includes(useCase.id);
    return matchesAi && matchesSaved && (!selectedCategory || useCase.category === selectedCategory) && (!selectedComplexity || useCase.complexity === selectedComplexity);
  }), [aiResultIds, savedIds, selectedCategory, selectedComplexity, showSavedOnly]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cards = document.querySelectorAll<HTMLElement>("#catalog [class~='hover:-translate-y-1']");
    cards.forEach((card) => {
      card.classList.remove("catalog-result-refresh");
      void card.offsetWidth;
      card.classList.add("catalog-result-refresh");
    });
  }, [aiResultIds, filteredUseCases, selectedCategory, selectedComplexity, showSavedOnly]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedComplexity(null);
    setShowSavedOnly(false);
    setAiResultIds(null);
    toast.success(toastMessages.catalogFiltersCleared);
  };
  const handleToggleSaved = (id: number) => {
    const wasSaved = isSaved(id);
    toggleSaved(id);
    toast.success(wasSaved ? toastMessages.removedPattern : toastMessages.savedPattern);
  };
  const categoryFor = (id: string) => categories.find((category) => category.id === id);
  const hasFilters = Boolean(selectedCategory || selectedComplexity || showSavedOnly || aiResultIds);
  const savedUseCases = useMemo(() => useCases.filter((useCase) => savedIds.includes(useCase.id)), [savedIds]);
  const comparedUseCases = useMemo(() => savedUseCases.filter((useCase) => compareIds.includes(useCase.id)), [compareIds, savedUseCases]);
  const sharePath = catalogSharePath({ category: selectedCategory, complexity: selectedComplexity, aiResultIds });
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (`${window.location.pathname}${window.location.search}` !== sharePath) window.history.replaceState(null, "", sharePath);
  }, [sharePath]);
  useEffect(() => {
    const nodes = catalogSections.map(({ id }) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: "-18% 0px -58% 0px", threshold: [0.1, 0.35, 0.7] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  useEffect(() => setCompareIds((current) => current.filter((id) => savedIds.includes(id))), [savedIds]);
  const copySharedView = async () => {
    const url = `${window.location.origin}${sharePath}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Filtered catalog link copied!", { description: "Share this view to reopen the same public filters." });
    } catch {
      toast.error("Could not copy the filtered catalog link.", { description: "Use the URL in your browser to share this view." });
    }
  };
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const openCompare = () => {
    if (savedUseCases.length < 2) {
      toast.info("Save at least two patterns to compare them side by side.");
      return;
    }
    setCompareIds((current) => current.length >= 2 ? current.slice(0, 3) : savedUseCases.slice(0, Math.min(3, savedUseCases.length)).map((useCase) => useCase.id));
    setCompareOpen(true);
  };
  const toggleCompare = (id: number) => setCompareIds((current) => {
    if (current.includes(id)) return current.filter((item) => item !== id);
    if (current.length === 3) {
      toast.info("You can compare up to three patterns at a time.");
      return current;
    }
    return [...current, id];
  });
  const popularPatterns = useCases.filter((useCase) => popularPatternIds.includes(useCase.id as (typeof popularPatternIds)[number]));

  return <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
    <PublicSiteHeader currentPath="/use-cases" />
    <main>
      <section className="relative isolate overflow-hidden border-b border-border/70 bg-[linear-gradient(105deg,oklch(0.07_0.03_260),oklch(0.10_0.03_255),oklch(0.11_0.04_210))]">
        <div className="absolute inset-0 -z-10 opacity-55 [background-image:linear-gradient(to_right,oklch(0.76_0.14_202_/_0.07)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.76_0.14_202_/_0.07)_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="absolute -left-28 top-24 -z-10 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -right-20 -top-24 -z-10 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="container py-16 md:py-24">
          <div className="max-w-4xl"><p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[.2em] text-accent"><Sparkles className="h-4 w-4" /> myIAM implementation studio</p><h1 className="mt-6 max-w-4xl text-5xl leading-[1.02] text-white md:text-7xl">Find the <span className="text-accent">right IdentityIQ pattern</span> before you start building.</h1><p className="mt-7 max-w-2xl text-base leading-8 text-slate-200 md:text-xl">Use this field guide to turn an IAM problem into a practical implementation starting point—then open a blueprint with delivery steps and release evidence.</p><div className="mt-9 flex flex-wrap gap-3"><Button onClick={() => scrollTo("catalog")} className="gap-2 bg-accent text-accent-foreground shadow-lg shadow-cyan-950/30 hover:bg-accent/90">Explore implementation patterns <ArrowRight className="h-4 w-4" /></Button><Button onClick={() => setLocation("/")} variant="outline" className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10"><ArrowUpRight className="h-4 w-4" /> Return to Architecture</Button></div></div>
          <div className="mt-14 grid gap-3 sm:grid-cols-3">{[{ number: "01", value: useCases.length, label: "Implementation patterns", detail: "Evidence-led references for controlled identity delivery.", tone: "text-cyan-200" }, { number: "02", value: categories.length, label: "Delivery domains", detail: "From lifecycle and access reviews to integrations and controls.", tone: "text-blue-200" }, { number: "03", value: savedIds.length, label: "Saved patterns", detail: "Your device-local shortlist for comparison and return visits.", tone: "text-violet-200" }].map((item) => <div key={item.label} className="rounded-2xl border border-white/15 bg-white/[.06] p-5 backdrop-blur"><p className={`font-mono text-2xl font-semibold ${item.tone}`}>{item.number}</p><div className="mt-3 flex items-baseline gap-2"><p className="text-2xl font-semibold text-white">{item.value}</p><p className="text-sm font-semibold text-white">{item.label}</p></div><p className="mt-2 text-xs leading-5 text-slate-300">{item.detail}</p></div>)}</div>
          <div className="mt-10 flex flex-wrap items-center gap-2"><span className="mr-1 py-1 font-mono text-[11px] uppercase tracking-wide text-slate-400">Quick filters</span>{categoryShortcuts.map((id) => { const category = categoryFor(id); const label = taxonomyLabel(id, category?.label ?? id); return <button key={id} onClick={() => setSelectedCategory(selectedCategory === id ? null : id)} aria-label={`Filter ${label.full}`} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${selectedCategory === id ? "border-accent/60 bg-accent/15 text-accent" : "border-white/15 bg-white/5 text-slate-300 hover:border-accent/35 hover:text-white"}`}><span className={`h-1.5 w-1.5 rounded-full ${category?.color}`} />{label.short}</button>; })}<span className="hidden rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[10px] text-slate-300 sm:inline">{useCases.length} VERIFIED PATTERNS</span><button type="button" onClick={clearFilters} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-accent/45 hover:text-accent">Reset all</button></div>
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[.035] px-4 py-3"><span className="mr-1 font-mono text-[10px] uppercase tracking-[.14em] text-cyan-200">Popular patterns</span>{popularPatterns.map((useCase) => <button key={useCase.id} type="button" onClick={() => setLocation(`/use-case/${useCase.id}`)} className="rounded-full border border-cyan-300/20 bg-slate-950/45 px-3 py-1.5 text-left text-xs font-semibold text-slate-100 transition hover:border-cyan-300/55 hover:text-cyan-200">{useCase.title}</button>)}</div>
        </div>
      </section>

      <nav className="sticky top-0 z-30 border-b border-border/70 bg-background/92 backdrop-blur" aria-label="Use-case catalog sections"><div className="container flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">{catalogSections.map((section) => <button key={section.id} onClick={() => scrollTo(section.id)} aria-current={activeSection === section.id ? "location" : undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${activeSection === section.id ? "border-accent/45 bg-accent/12 text-accent shadow-[0_0_20px_-10px_oklch(0.76_0.14_202)]" : "border-border bg-card text-muted-foreground hover:border-primary/45 hover:text-foreground"}`}>{section.label}</button>)}<button onClick={copySharedView} className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/45 hover:text-foreground"><Share2 className="mr-1.5 inline h-3.5 w-3.5" /> Share this view</button></div></nav>

      <section id="catalog-discovery" className="container scroll-mt-8 py-16 md:py-24"><div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-end"><div><p className="font-mono text-xs uppercase tracking-[.18em] text-accent">Implementation discovery</p><h2 className="mt-4 text-4xl leading-tight md:text-5xl">Move from a control problem to a buildable identity pattern.</h2><p className="mt-5 max-w-xl leading-7 text-muted-foreground">The catalog keeps the same architecture-first sequence as the Home page: begin with a defined outcome, select the delivery discipline, and open the blueprint when it is ready for implementation.</p></div><div className="grid gap-4 md:grid-cols-3">{discoverySteps.map((step) => { const Icon = step.icon; return <article key={step.number} className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/55 p-5 shadow-[0_20px_52px_-42px_oklch(0.65_0.15_200)]"><div className="absolute -right-3 -top-3 rounded-full border border-accent/15 bg-accent/6 p-5 text-accent/30 transition group-hover:scale-110 group-hover:text-accent/50"><Icon className="h-7 w-7" /></div><p className="relative font-mono text-sm text-accent">{step.number}</p><p className="relative mt-4 text-sm font-semibold">{step.emphasis}</p><p className="relative mt-2 text-xs leading-5 text-muted-foreground">{step.body}</p></article>; })}</div></div></section>

      <FeaturedKnowledgeInsights />

      <section id="catalog" className="scroll-mt-16 border-y border-border/70 bg-card/20"><div className="container py-16 md:py-20"><div className="mb-7 flex flex-wrap items-end justify-between gap-5"><div><p className="font-mono text-xs uppercase tracking-[.18em] text-accent">Catalog control plane</p><h2 className="mt-3 text-4xl md:text-5xl">Implementation patterns, ready to filter.</h2><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Curate the catalog with taxonomy, complexity, saved patterns, or shared links; every active public filter is reflected in the URL.</p></div><div className="flex flex-wrap gap-2"><Button onClick={() => { const next = !showSavedOnly; setShowSavedOnly(next); toast.info(next ? toastMessages.savedPatterns : toastMessages.fullCatalog); }} variant={showSavedOnly ? "default" : "outline"} className={`gap-2 ${showSavedOnly ? "bg-accent text-accent-foreground hover:bg-accent/90" : "border-border/80 bg-card/30 text-muted-foreground hover:text-foreground"}`}><BookmarkCheck className="h-4 w-4" />Shortlist <span className="rounded-sm bg-background/20 px-1.5 font-mono text-[10px]">{savedIds.length}</span></Button><Button onClick={openCompare} variant="outline" className="gap-2 border-primary/30 bg-primary/8 text-primary hover:border-primary/55 hover:bg-primary/12"><GitPullRequest className="h-4 w-4" />Compare saved</Button><Button onClick={copySharedView} variant="outline" className="gap-2 border-accent/25 bg-card/45 text-accent hover:border-accent/55 hover:bg-accent/10"><Share2 className="h-4 w-4" />Copy filtered view</Button></div></div><div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-border/70 bg-background/45 px-4 py-3"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Category legend</span>{categories.map((category) => <span key={category.id} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><span className={`h-2.5 w-2.5 rounded-full ${category.color}`} />{category.label}</span>)}</div>
        <div className="grid gap-8 lg:grid-cols-[17rem_1fr]"><aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit"><div className="rounded-[1.5rem] border border-border/70 bg-background/55 p-5"><div className="mb-4 flex items-center gap-2"><Filter className="h-4 w-4 text-accent" /><p className="font-mono text-xs uppercase tracking-[.16em] text-muted-foreground">Filter catalog</p></div><div className="space-y-1"><button onClick={() => setSelectedCategory(null)} className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${!selectedCategory ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>All domains <span className="float-right font-mono text-xs opacity-80">{useCases.length}</span></button>{categories.map((category) => <button key={category.id} onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)} className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${selectedCategory === category.id ? `${category.color} text-white font-medium shadow-sm` : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><span className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${selectedCategory === category.id ? "bg-white/80" : category.color}`} /><span className="block truncate">{category.label}</span></span></button>)}</div><div className="mt-5 border-t border-border/60 pt-5"><p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Complexity</p><div className="flex flex-wrap gap-2">{complexityLevels.map((level) => <button key={level.id} onClick={() => setSelectedComplexity(selectedComplexity === level.id ? null : level.id)} className={`rounded-md border px-2.5 py-1 text-xs transition ${selectedComplexity === level.id ? "border-accent/60 bg-accent/15 text-accent" : "border-border/80 text-muted-foreground hover:border-accent/35 hover:text-foreground"}`}><ComplexityMeter level={level.label} compact /></button>)}</div></div>{hasFilters && <button onClick={clearFilters} className="mt-5 text-xs font-medium text-accent hover:text-foreground">Clear active filters</button>}</div><div className="rounded-[1.5rem] border border-accent/25 bg-gradient-to-br from-accent/15 to-primary/20 p-5"><div className="flex items-center justify-between"><BookmarkCheck className="h-5 w-5 text-accent" /><span className="font-mono text-xs text-accent">{savedIds.length} SAVED</span></div><p className="mt-4 text-sm font-semibold text-foreground">Your shortlist</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Save patterns to compare or return to later on this device.</p><button onClick={() => { const next = !showSavedOnly; setShowSavedOnly(next); toast.info(next ? toastMessages.savedPatterns : toastMessages.fullCatalog); }} className="mt-4 text-xs font-semibold text-accent hover:text-foreground">{showSavedOnly ? "Show full catalog" : "View saved patterns"} →</button>{savedIds.length > 0 && <button onClick={clearSaved} className="ml-3 text-xs text-muted-foreground hover:text-foreground">Clear</button>}</div><button onClick={() => setLocation("/delivery-guide")} className="group w-full rounded-[1.5rem] border border-accent/25 bg-card/30 p-5 text-left transition hover:-translate-y-0.5 hover:border-accent/55"><GitPullRequest className="h-5 w-5 text-accent" /><p className="mt-4 text-sm font-semibold text-foreground">Build the release path</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Move configuration with validation, promotion gates, and release evidence.</p><p className="mt-4 flex items-center gap-1 text-xs font-semibold text-accent">Open delivery guide <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></p></button></aside>
          <div><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="font-mono text-xs uppercase tracking-[.18em] text-accent">{showSavedOnly ? "Shortlist" : aiResultIds ? "Curated catalog view" : "Catalog"}</p><h3 className="mt-2 text-3xl">{showSavedOnly ? "Saved implementation patterns" : "Implementation patterns"}</h3></div><p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{filteredUseCases.length}</span> of {showSavedOnly ? savedIds.length : useCases.length} references</p></div>{filteredUseCases.length > 0 ? <div className="grid gap-4 md:grid-cols-2">{filteredUseCases.map((useCase) => { const category = categoryFor(useCase.category); return <Card key={useCase.id} className="group relative h-full rounded-2xl border-border/75 bg-card/55 transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:bg-card hover:shadow-[0_24px_50px_-35px_oklch(0.65_0.15_200)]"><button onClick={() => handleToggleSaved(useCase.id)} className={`absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-md border transition ${isSaved(useCase.id) ? "border-accent/45 bg-accent/15 text-accent" : "border-border/70 bg-background/50 text-muted-foreground opacity-0 hover:text-accent group-hover:opacity-100"}`} aria-label={isSaved(useCase.id) ? `Remove ${useCase.title} from shortlist` : `Save ${useCase.title} to shortlist`}>{isSaved(useCase.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}</button><button onClick={() => setLocation(`/use-case/${useCase.id}`)} className="h-full w-full text-left"><CardHeader className="pb-3"><div className="flex items-center justify-between gap-3 pr-9"><Badge className={`${category?.color ?? "bg-slate-600"} border-0 px-2 py-0.5 text-[10px] font-medium text-white`}>{useCase.category}</Badge><span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground"><IdentityMark className="text-accent/65" size={15} /> UC-{String(useCase.id).padStart(2, "0")}</span></div><CardTitle className="mt-3 text-[1.05rem] leading-6 transition-colors group-hover:text-accent">{useCase.title}</CardTitle></CardHeader><CardContent><p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{useCase.businessRequirement}</p><div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4"><div className="space-y-1"><ComplexityMeter level={useCase.complexity} /><div className="flex flex-wrap gap-1.5">{useCase.keywords.slice(0, 2).map((keyword) => <span key={keyword} className="rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground">{keyword}</span>)}</div></div><span className="flex shrink-0 items-center gap-1 text-xs font-medium text-accent">Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span></div></CardContent></button></Card>; })}</div> : <div className="rounded-2xl border border-dashed border-border p-12 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-4 font-semibold">No implementation patterns found.</p><p className="mt-1 text-sm text-muted-foreground">Try changing your search or selected filters.</p><Button onClick={clearFilters} variant="outline" className="mt-5">Clear filters</Button></div>}</div></div></div></section>
    </main>
    <Sheet open={compareOpen} onOpenChange={setCompareOpen}><SheetContent side="right" className="w-[94vw] max-w-5xl overflow-y-auto border-l border-accent/25 bg-card p-0"><SheetHeader className="border-b border-border/70 bg-gradient-to-br from-accent/12 via-card to-primary/10 px-6 py-7 pr-14"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-accent">Pattern comparison</p><SheetTitle className="text-3xl">Compare shortlisted use cases</SheetTitle><SheetDescription className="text-sm leading-6">Choose two or three saved patterns. Compare their outcomes, complexity, technical signals, and implementation paths side by side.</SheetDescription></SheetHeader><div className="space-y-6 px-6 py-7"><div className="flex flex-wrap gap-2">{savedUseCases.map((useCase) => <button key={useCase.id} onClick={() => toggleCompare(useCase.id)} aria-pressed={compareIds.includes(useCase.id)} className={`rounded-full border px-3 py-2 text-xs transition ${compareIds.includes(useCase.id) ? "border-accent/55 bg-accent/15 text-accent" : "border-border bg-background/55 text-muted-foreground hover:border-accent/35 hover:text-foreground"}`}>{compareIds.includes(useCase.id) ? "✓ " : ""}UC-{String(useCase.id).padStart(2, "0")} · {useCase.title}</button>)}</div>{comparedUseCases.length < 2 ? <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Select one more saved pattern to begin comparing.</div> : <div className={`grid gap-4 ${comparedUseCases.length === 3 ? "xl:grid-cols-3" : "md:grid-cols-2"}`}>{comparedUseCases.map((useCase) => { const category = categoryFor(useCase.category); return <article key={useCase.id} className="rounded-2xl border border-border/80 bg-background/45 p-5"><div className="flex items-start justify-between gap-3"><Badge className={`${category?.color ?? "bg-slate-600"} border-0 text-[10px] text-white`}>{useCase.category}</Badge><ComplexityMeter level={useCase.complexity} compact /></div><p className="mt-5 font-mono text-[11px] text-accent">UC-{String(useCase.id).padStart(2, "0")}</p><h3 className="mt-2 text-lg font-semibold leading-6">{useCase.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{useCase.businessRequirement}</p><div className="mt-5 border-t border-border/70 pt-4"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-accent">Implementation signals</p><ul className="mt-2 space-y-2 text-xs leading-5 text-muted-foreground">{useCase.technicalSpecifications.slice(0, 3).map((specification) => <li key={specification}>• {specification}</li>)}</ul></div><Button onClick={() => { setCompareOpen(false); setLocation(`/use-case/${useCase.id}`); }} variant="outline" className="mt-5 w-full gap-2">Open blueprint <ArrowRight className="h-4 w-4" /></Button></article>; })}</div>}</div><SheetFooter className="border-t border-border/70 bg-background/75 px-6 py-5"><Button onClick={() => setCompareOpen(false)} variant="outline" className="w-full">Return to catalog</Button></SheetFooter></SheetContent></Sheet>
    <footer className="border-t border-border/60 bg-card/20"><div className="container flex flex-col gap-2 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p>SailPoint IdentityIQ Use Cases · Technical reference for controlled lab implementation.</p><div className="flex gap-4"><button onClick={() => setLocation("/knowledge")} className="text-left text-primary hover:text-accent">Knowledge archive →</button><button onClick={() => setLocation("/blog")} className="text-left text-primary hover:text-accent">Blog →</button><button onClick={() => setLocation("/expert")} className="text-left text-primary hover:text-accent">Talk to an Expert →</button><button onClick={() => setLocation("/delivery-guide")} className="text-left text-accent hover:text-foreground">CI/CD delivery playbook →</button><button onClick={() => setLocation("/privacy-policy")} className="text-left text-primary hover:text-accent">Privacy policy →</button></div></div></footer>
  </div>;
}
