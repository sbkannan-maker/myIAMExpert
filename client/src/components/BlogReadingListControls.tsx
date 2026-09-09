import { ArrowDownUp, BookmarkCheck, Rss, Search } from "lucide-react";
import { toast } from "sonner";
import { allSavedTopics } from "@/lib/savedReadingListFilter";
import { toastMessages } from "@/lib/toastMessages";
import type { SavedReadingListSortOrder } from "@/hooks/useSavedReadingListSortPreference";

type Props = {
  count: number;
  isActive: boolean;
  selectedTopic: string;
  topics: readonly string[];
  search: string;
  sortOrder: SavedReadingListSortOrder;
  onToggle: () => void;
  onTopicChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SavedReadingListSortOrder) => void;
  onClear: () => void;
  onClearAllPreferences: () => void;
};

export default function BlogReadingListControls({ count, isActive, selectedTopic, topics, search, sortOrder, onToggle, onTopicChange, onSearchChange, onSortChange, onClear, onClearAllPreferences }: Props) {
  const copyRssLink = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(new URL("/rss.xml", window.location.origin).toString());
      toast.success(toastMessages.rssLinkCopied);
    } catch {
      toast.error(toastMessages.rssLinkCopyFailure);
    }
  };

  return <div className="rounded-2xl border border-accent/25 bg-accent/7 p-5"><div className="flex items-center justify-between gap-3"><BookmarkCheck className="h-5 w-5 text-accent" /><span className="rounded-full bg-accent/13 px-2 py-1 font-mono text-[10px] font-semibold text-accent">{count}</span></div><p className="mt-4 text-sm font-semibold">Reading list</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Saved articles stay in this browser and remain available when you return.</p><button onClick={onToggle} aria-pressed={isActive} className={`mt-4 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold ${isActive ? "bg-primary text-primary-foreground" : "bg-card text-primary"}`}>{isActive ? "Showing saved articles" : "Show reading list"}</button><button type="button" onClick={copyRssLink} className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/25 bg-card px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/55 hover:bg-primary/5"><Rss className="h-3.5 w-3.5" /> Copy RSS link</button>{isActive && <div className="mt-4 space-y-3 border-t border-accent/20 pt-4"><label className="grid gap-1.5 text-[11px] font-semibold text-muted-foreground">Search saved articles<span className="relative"><Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-accent" /><input value={search} onChange={event => onSearchChange(event.target.value)} placeholder="Find a saved note" className="w-full rounded-lg border border-border bg-background py-2 pl-8 pr-2.5 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></span></label><label className="grid gap-1.5 text-[11px] font-semibold text-muted-foreground">Saved article topic<select value={selectedTopic} onChange={event => onTopicChange(event.target.value)} className="rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground"><option>{allSavedTopics}</option>{topics.map(topic => <option key={topic}>{topic}</option>)}</select></label><div><p className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground"><ArrowDownUp className="h-3.5 w-3.5 text-accent" /> Saved-list order</p><div className="mt-1.5 flex rounded-lg border border-border bg-background p-1">{(["newest", "oldest"] as SavedReadingListSortOrder[]).map(value => <button key={value} type="button" onClick={() => onSortChange(value)} aria-pressed={sortOrder === value} className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-semibold ${sortOrder === value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}>{value === "newest" ? "Newest" : "Oldest"}</button>)}</div><p className="mt-1.5 text-[10px] leading-4 text-muted-foreground">This order is saved in this browser.</p></div></div>}{count > 0 && <button onClick={onClear} className="mt-2 text-xs font-semibold text-primary hover:text-accent">Clear saved articles</button>}<button onClick={onClearAllPreferences} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-primary/45 hover:text-primary">Clear all local preferences</button><p className="mt-2 text-[10px] leading-4 text-muted-foreground">Resets saved articles, local sort order, and topic-alert choices in this browser.</p></div>;
}
