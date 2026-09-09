import { ArrowDownUp, ArrowUpRight, BookOpenText, ChevronDown, ExternalLink, Filter, Landmark, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import ArchiveTopicControls from "@/components/ArchiveTopicControls";
import BrandLockup from "@/components/BrandLockup";
import ThemeToggle from "@/components/ThemeToggle";
import { consultingProfile } from "@/lib/consultingProfile";
import { getKnowledgeSuggestions, knowledgeTopicPath, nextSuggestionIndex, topicLinkCopyFailureMessage, topicLinkCopySuccessMessage, topicShareUrl, type KnowledgeSuggestion } from "@/lib/legacyKnowledgeDiscovery";
import { legacyKnowledgeArticles, legacyKnowledgeCategories, legacyKnowledgePublishedAt, legacyKnowledgeTopics } from "@/lib/legacyKnowledge";
import { toastMessages } from "@/lib/toastMessages";

type SortOrder = "relevance" | "newest" | "oldest";

const formatDate = (slug: string) => {
  const value = legacyKnowledgePublishedAt[slug];
  return value ? new Date(value).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" }) : "Date unavailable";
};

const copyText = async (value: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Copy is unavailable");
};

export default function LegacyKnowledge() {
  const [, setLocation] = useLocation();
  const [category, setCategory] = useState<(typeof legacyKnowledgeCategories)[number]>("All");
  const [topic, setTopic] = useState<string | null>(() => typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("topic"));
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("relevance");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const categoryCounts = useMemo(() => Object.fromEntries(legacyKnowledgeCategories.map(value => [value, value === "All" ? legacyKnowledgeArticles.length : legacyKnowledgeArticles.filter(item => item.category === value).length])), []);
  const topics = useMemo(() => Array.from(new Set(legacyKnowledgeArticles.flatMap(item => legacyKnowledgeTopics[item.slug] ?? []))).sort(), []);
  const newestInsights = useMemo(() => [...consultingProfile.linkedInFeed].sort((first, second) => Date.parse(second.publishedAt) - Date.parse(first.publishedAt)).slice(0, 3), []);
  const suggestions = useMemo(() => getKnowledgeSuggestions(query), [query]);
  const articles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = legacyKnowledgeArticles.filter(article => {
      const searchable = `${article.title} ${article.summary} ${article.category} ${(legacyKnowledgeTopics[article.slug] ?? []).join(" ")}`.toLowerCase();
      return (category === "All" || article.category === category) && (!topic || legacyKnowledgeTopics[article.slug]?.includes(topic)) && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
    const relevance = (article: (typeof legacyKnowledgeArticles)[number]) => (topic && legacyKnowledgeTopics[article.slug]?.includes(topic) ? 8 : 0) + (category !== "All" && article.category === category ? 4 : 0) + (normalizedQuery && article.title.toLowerCase().includes(normalizedQuery) ? 6 : 0) + (normalizedQuery && legacyKnowledgeTopics[article.slug]?.some(value => value.toLowerCase().includes(normalizedQuery)) ? 4 : 0);
    return [...filtered].sort((first, second) => {
      if (sortOrder === "relevance") return relevance(second) - relevance(first) || legacyKnowledgeArticles.indexOf(first) - legacyKnowledgeArticles.indexOf(second);
      const firstDate = legacyKnowledgePublishedAt[first.slug] ? Date.parse(legacyKnowledgePublishedAt[first.slug]!) : null;
      const secondDate = legacyKnowledgePublishedAt[second.slug] ? Date.parse(legacyKnowledgePublishedAt[second.slug]!) : null;
      if (firstDate === null) return 1;
      if (secondDate === null) return -1;
      return sortOrder === "newest" ? secondDate - firstDate : firstDate - secondDate;
    });
  }, [category, query, sortOrder, topic]);

  useEffect(() => {
    const hydrate = () => setTopic(new URLSearchParams(window.location.search).get("topic"));
    window.addEventListener("popstate", hydrate);
    return () => window.removeEventListener("popstate", hydrate);
  }, []);

  const setShareTopic = (value: string | null) => {
    const url = new URL(window.location.href);
    value ? url.searchParams.set("topic", value) : url.searchParams.delete("topic");
    window.history.pushState({}, "", `${url.pathname}${url.search}`);
    setTopic(value);
  };
  const chooseTopic = (value: string) => {
    setShareTopic(value);
    setCategory("All");
    setQuery("");
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    document.getElementById("archive-library")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setShareTopic(null);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };
  const chooseSuggestion = (suggestion: KnowledgeSuggestion) => {
    if (suggestion.kind === "topic") {
      chooseTopic(suggestion.label);
      return;
    }
    setCategory("All");
    setShareTopic(null);
    setQuery(suggestion.label);
    setExpandedSlug(suggestion.slug ?? null);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    window.setTimeout(() => document.getElementById(`archive-note-${suggestion.slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
  };
  const copyTopicLink = async () => {
    if (!topic) return;
    try {
      await copyText(topicShareUrl(window.location.origin, topic));
      setCopyState("copied");
      toast.success(topicLinkCopySuccessMessage, { description: toastMessages.copyLinkDescription });
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      toast.error(topicLinkCopyFailureMessage);
    }
  };
  const onSuggestionKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (event.key === "Escape") setShowSuggestions(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setActiveSuggestionIndex(current => nextSuggestionIndex(current, suggestions.length, event.key as "ArrowDown" | "ArrowUp" | "Home" | "End"));
      return;
    }
    if (event.key === "Enter" && activeSuggestionIndex >= 0) {
      event.preventDefault();
      chooseSuggestion(suggestions[activeSuggestionIndex]!);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="container flex items-center justify-between gap-4 py-3.5 max-[430px]:flex-col max-[430px]:items-start">
        <button onClick={() => setLocation("/")} className="text-left" aria-label="Return to the reference catalog"><BrandLockup /></button>
        <div className="flex items-center gap-2 max-[430px]:self-end"><ThemeToggle className="hidden sm:inline-flex" />
          <button onClick={() => setLocation("/blog")} className="hidden rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted sm:block">Blog</button>
          <button onClick={() => setLocation("/consulting")} className="rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground">Consulting</button>
        </div>
      </div>
    </header>
    <main>
      <section className="relative isolate overflow-hidden border-b border-border/70 bg-slate-950 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_83%_8%,oklch(0.75_0.14_210_/_0.28),transparent_28rem)]" />
        <div className="container grid gap-10 py-16 md:grid-cols-[1.12fr_.88fr] md:py-24">
          <div><p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[.18em] text-cyan-300"><Landmark className="h-4 w-4" /> Legacy learning archive</p><h1 className="mt-5 max-w-3xl text-4xl leading-[1.08] md:text-6xl">Share ideas. Keep the <span className="text-cyan-300">knowledge</span> accessible.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">A searchable preservation of Kannan’s public IAM, SailPoint, IBM Identity, and Java learning notes.</p><div className="mt-8 flex flex-wrap gap-3"><a href="https://sbkannan.wordpress.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-white">Visit original archive <ExternalLink className="h-4 w-4" /></a><button onClick={() => document.getElementById("archive-library")?.scrollIntoView({ behavior: "smooth" })} className="rounded-lg border border-white/25 px-4 py-3 text-sm font-semibold">Browse archive</button></div></div>
          <aside className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur"><p className="font-mono text-xs uppercase tracking-[.16em] text-cyan-300">Archive context</p><div className="mt-6 grid grid-cols-3 gap-3">{[[legacyKnowledgeArticles.length, "Notes"], [legacyKnowledgeCategories.length - 1, "Lenses"], ["2009+", "Sources"]].map(([value, label]) => <div key={String(label)} className="rounded-xl border border-white/10 bg-slate-950/45 p-3 text-center"><p className="font-mono text-xl font-semibold text-cyan-300">{value}</p><p className="mt-1 text-[10px] uppercase tracking-wide text-slate-300">{label}</p></div>)}</div><p className="mt-6 text-sm leading-6 text-slate-200">Preserved historical material should be validated against current vendor documentation before operational use.</p></aside>
        </div>
      </section>
      <section className="border-b border-border/70 bg-secondary/30"><div className="container py-12 md:py-16"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[.17em] text-accent"><Sparkles className="h-4 w-4" /> Current writing</p><h2 className="mt-3 text-3xl md:text-4xl">Newest insights</h2><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Current IAM architecture writing remains visible beside the historical learning archive.</p></div><button onClick={() => setLocation("/blog")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">All current articles <ArrowUpRight className="h-4 w-4" /></button></div><div className="mt-7 grid gap-4 md:grid-cols-3">{newestInsights.map((insight, index) => { const href = insight.href || `/blog/${insight.slug}`; return <article key={insight.slug} className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm"><div className="flex justify-between gap-3 font-mono text-[10px] uppercase tracking-wide text-accent"><span>New · {index + 1}</span><span className="text-muted-foreground">{insight.date}</span></div><h3 className="mt-5 text-xl leading-7">{insight.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{insight.excerpt}</p>{href.startsWith("/") ? <button onClick={() => setLocation(href)} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">Read insight <ArrowUpRight className="h-4 w-4" /></button> : <a href={href} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">Read original <ExternalLink className="h-4 w-4" /></a>}</article>; })}</div></div></section>
      <section id="archive-library" className="container py-12 md:py-16"><div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside className="space-y-5 lg:sticky lg:top-28 lg:h-fit"><div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm"><div className="flex items-center gap-2"><Filter className="h-4 w-4 text-accent" /><p className="font-mono text-xs uppercase tracking-[.16em] text-accent">Archive filters</p></div><div className="mt-5 space-y-1">{legacyKnowledgeCategories.map(value => <button key={value} onClick={() => { setCategory(value); setShareTopic(null); }} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${category === value && !topic ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>{value}<span className="float-right font-mono text-xs opacity-70">{categoryCounts[value]}</span></button>)}</div></div><div className="rounded-2xl border border-accent/25 bg-accent/7 p-5"><ShieldCheck className="h-5 w-5 text-accent" /><p className="mt-4 text-sm font-semibold">Read with context</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Switch reading modes at any time. Theme preference is saved on this device.</p><button onClick={() => setLocation("/")} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">Open patterns <ArrowUpRight className="h-3.5 w-3.5" /></button></div></aside>
        <div><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="font-mono text-xs uppercase tracking-[.18em] text-accent">Source-attributed collection</p><h2 className="mt-3 text-3xl md:text-4xl">Legacy knowledge library</h2><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Search by phrase or topic. Topic views retain a direct URL for sharing.</p></div><p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{articles.length}</span> of {legacyKnowledgeArticles.length} notes</p></div>
          <div className="relative mt-7"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" /><input aria-label="Search the knowledge archive" aria-autocomplete="list" aria-controls="knowledge-suggestions" aria-expanded={showSuggestions && suggestions.length > 0} aria-activedescendant={activeSuggestionIndex >= 0 ? `knowledge-suggestion-${activeSuggestionIndex}` : undefined} value={query} onFocus={() => { setShowSuggestions(true); setActiveSuggestionIndex(suggestions.length ? 0 : -1); }} onKeyDown={onSuggestionKeyDown} onChange={event => { setQuery(event.target.value); setShowSuggestions(true); setActiveSuggestionIndex(0); }} placeholder="Search SailPoint, reconciliations, Java, provisioning…" className="h-12 w-full rounded-xl border border-input bg-card pl-11 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />{query && <button type="button" onClick={() => { setQuery(""); setShowSuggestions(false); setActiveSuggestionIndex(-1); }} aria-label="Clear knowledge archive search" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground"><X className="h-4 w-4" /></button>}{showSuggestions && suggestions.length > 0 && <div id="knowledge-suggestions" role="listbox" className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl"><p className="px-3 py-2 font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground">Suggestions</p>{suggestions.map((suggestion, index) => <button id={`knowledge-suggestion-${index}`} key={suggestion.id} role="option" aria-selected={activeSuggestionIndex === index} onMouseDown={event => event.preventDefault()} onMouseEnter={() => setActiveSuggestionIndex(index)} onClick={() => chooseSuggestion(suggestion)} className={`flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition hover:bg-muted ${activeSuggestionIndex === index ? "bg-muted" : ""}`}><span className="min-w-0"><span className="block truncate text-sm font-semibold text-foreground">{suggestion.label}</span><span className="mt-0.5 block text-xs text-muted-foreground">{suggestion.detail}</span></span><span className="shrink-0 rounded-full border border-border px-2 py-1 font-mono text-[9px] uppercase text-accent">{suggestion.kind}</span></button>)}</div>}</div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4"><div className="flex flex-wrap gap-2" aria-label="Quick archive category filters">{legacyKnowledgeCategories.map(value => <button key={value} onClick={() => { setCategory(value); setShareTopic(null); }} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${category === value && !topic ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{value} {categoryCounts[value]}</button>)}</div><div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1" aria-label="Archive sort order"><ArrowDownUp className="ml-1 h-3.5 w-3.5 text-accent" />{(["relevance", "newest", "oldest"] as SortOrder[]).map(value => <button key={value} onClick={() => setSortOrder(value)} aria-pressed={sortOrder === value} className={`rounded-md px-2 py-1 text-[10px] font-semibold ${sortOrder === value ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{value === "relevance" ? "Relevant" : value === "newest" ? "Newest" : "Oldest"}</button>)}</div></div>
          <ArchiveTopicControls topic={topic} topics={topics} copyState={copyState} onCopy={copyTopicLink} onChooseTopic={chooseTopic} onClearFilters={clearFilters} showClear={Boolean(topic || category !== "All" || query)} />
          <div className="mt-6 space-y-4">{articles.map(article => <article id={`archive-note-${article.slug}`} key={article.slug} className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm"><button onClick={() => setExpandedSlug(expandedSlug === article.slug ? null : article.slug)} aria-expanded={expandedSlug === article.slug} className="group w-full p-5 text-left sm:p-6"><div className="flex justify-between gap-5"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-primary/8 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase text-primary">{article.category}</span><span className="font-mono text-[10px] uppercase text-muted-foreground">{formatDate(article.slug)}</span></div><h3 className="mt-4 text-xl leading-7 group-hover:text-accent">{article.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{article.summary}</p></div><ChevronDown className={`h-5 w-5 shrink-0 text-primary transition ${expandedSlug === article.slug ? "rotate-180" : ""}`} /></div></button><div className="flex flex-wrap gap-2 px-5 pb-5 sm:px-6">{(legacyKnowledgeTopics[article.slug] ?? []).map(value => <a key={value} href={knowledgeTopicPath(value)} onClick={event => { event.preventDefault(); chooseTopic(value); }} className="rounded-md border border-primary/15 bg-primary/5 px-2 py-1 text-[10px] font-semibold text-primary">#{value}</a>)}</div>{expandedSlug === article.slug && <div className="border-t border-border/70 bg-secondary/25 p-5 sm:p-6">{article.sections.map(section => <section key={section.heading} className="mb-6"><h4 className="font-semibold">{section.heading}</h4>{section.paragraphs?.map(paragraph => <p key={paragraph} className="mt-3 text-sm leading-7 text-muted-foreground">{paragraph}</p>)}{section.bullets && <ul className="mt-3 space-y-2 text-sm text-muted-foreground">{section.bullets.map(value => <li key={value}>• {value}</li>)}</ul>}{section.code && <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{section.code.join("\n")}</pre>}</section>)}<a href={article.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">Read original public post <ExternalLink className="h-4 w-4" /></a></div>}</article>)}</div>
          {articles.length === 0 && <div className="rounded-2xl border border-dashed border-border p-10 text-center"><BookOpenText className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-4 font-semibold">No archived note matched that search.</p><button onClick={clearFilters} className="mt-4 text-sm font-semibold text-primary">Clear archive filters</button></div>}
        </div>
      </div></section>
    </main>
    <footer className="border-t border-border/70 bg-secondary/25"><div className="container flex flex-col gap-3 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p>Source-attributed legacy content from sbkannan.wordpress.com.</p><div className="flex flex-wrap items-center gap-4"><a href="/privacy-policy" className="font-semibold text-primary hover:text-accent">Privacy policy</a><a href={consultingProfile.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary">Connect with Kannan on LinkedIn <ArrowUpRight className="h-3.5 w-3.5" /></a></div></div></footer>
  </div>;
}
