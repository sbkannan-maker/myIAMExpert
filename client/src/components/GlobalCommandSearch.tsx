import { Command, FileCode2, FileText, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";
import { getGlobalSearchResults, globalSearchEntries, type GlobalSearchEntry } from "@/lib/globalSearch";

const iconFor = (kind: GlobalSearchEntry["kind"]) => kind === "Use cases" ? FileCode2 : kind === "Knowledge" ? FileText : Search;

export default function GlobalCommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const results = useMemo(() => getGlobalSearchResults(query, 9), [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen((value) => !value); }
      if (!isTyping && event.key === "/") { event.preventDefault(); setOpen(true); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const select = (entry: GlobalSearchEntry) => { setLocation(entry.href); setOpen(false); setQuery(""); };
  const grouped = ["Use cases", "Knowledge", "Articles"] as const;

  return <><Button type="button" onClick={() => setOpen(true)} variant="outline" className="fixed bottom-4 left-4 z-40 gap-2 rounded-full border-border/80 bg-background/90 px-3 shadow-xl shadow-black/20 backdrop-blur hover:border-accent/55 sm:bottom-5 sm:left-5"><Search className="h-4 w-4 text-accent" /><span className="hidden text-xs font-semibold sm:inline">Search everything</span><kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline">⌘ K</kbd></Button><CommandDialog open={open} onOpenChange={setOpen} title="Search myIAM" description="Search use cases, knowledge notes, and articles." className="max-w-2xl border-border bg-popover"><CommandInput value={query} onValueChange={setQuery} placeholder="Search use cases, knowledge, and articles…" /><CommandList className="max-h-[min(60vh,34rem)]"><CommandEmpty>No matching myIAM content found.</CommandEmpty>{grouped.map((kind, index) => { const entries = results.filter((entry) => entry.kind === kind); if (entries.length === 0) return null; return <div key={kind}>{index > 0 && <CommandSeparator />}<CommandGroup heading={kind}>{entries.map((entry) => { const Icon = iconFor(entry.kind); return <CommandItem key={entry.id} value={`${entry.title} ${entry.detail} ${entry.keywords.join(" ")}`} onSelect={() => select(entry)}><Icon className="h-4 w-4 text-accent" /><span className="min-w-0"><span className="block truncate font-medium">{entry.title}</span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{entry.detail}</span></span><CommandShortcut>Open</CommandShortcut></CommandItem>; })}</CommandGroup></div>; })}</CommandList><div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground"><span>Use arrow keys and Enter to navigate.</span><span className="inline-flex items-center gap-1"><Command className="h-3.5 w-3.5" />K</span></div></CommandDialog></>;
}
