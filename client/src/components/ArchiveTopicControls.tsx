import { Bookmark, BookmarkCheck, Check, Copy, Link2, Tags } from "lucide-react";
import { toast } from "sonner";
import { useSavedKnowledgeTopics } from "@/hooks/useSavedKnowledgeTopics";
import { knowledgeTopicPath, topicLinkCopyFailureMessage, topicLinkCopySuccessMessage, topicShareUrl } from "@/lib/legacyKnowledgeDiscovery";

type ArchiveTopicControlsProps = {
  topic: string | null;
  topics: string[];
  copyState: "idle" | "copied";
  onCopy: () => Promise<void>;
  onChooseTopic: (topic: string) => void;
  onClearFilters: () => void;
  showClear: boolean;
};

export default function ArchiveTopicControls({ topic, topics, copyState, onCopy, onChooseTopic, onClearFilters, showClear }: ArchiveTopicControlsProps) {
  const { savedTopics, isTopicSaved, toggleSavedTopic, clearSavedTopics } = useSavedKnowledgeTopics();
  const saveCurrentTopic = () => {
    if (!topic) return;
    const wasSaved = isTopicSaved(topic);
    toggleSavedTopic(topic);
    toast.success(wasSaved ? `Removed ${topic} from saved topics.` : `Saved ${topic} for quick revisit.`);
  };
  const copyCurrentTopic = async () => {
    if (!topic) return;
    try {
      await onCopy();
    } catch {
      toast.error(topicLinkCopyFailureMessage);
    }
  };

  return <div className="mt-4 border-b border-border/70 pb-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-accent"><Tags className="h-3.5 w-3.5" /> Browse by topic{topic ? ` · ${topic}` : ""}</p>{topic && <div className="flex flex-wrap items-center gap-2"><a href={knowledgeTopicPath(topic)} className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><Link2 className="h-3.5 w-3.5" /> Topic view</a><button onClick={saveCurrentTopic} aria-pressed={isTopicSaved(topic)} className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/5 px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:border-primary/55 hover:bg-primary/10">{isTopicSaved(topic) ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}{isTopicSaved(topic) ? "Saved" : "Save topic"}</button><button onClick={copyCurrentTopic} className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/5 px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:border-primary/55 hover:bg-primary/10">{copyState === "copied" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copyState === "copied" ? "Copied" : "Copy link"}</button></div>}</div>{savedTopics.length > 0 && <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-accent/20 bg-accent/6 p-3"><BookmarkCheck className="h-4 w-4 text-accent" /><span className="mr-1 text-xs font-semibold text-foreground">Saved topics</span>{savedTopics.map(savedTopic => <button key={savedTopic} onClick={() => onChooseTopic(savedTopic)} className="rounded-full border border-accent/30 bg-card px-2.5 py-1 text-[11px] font-medium text-primary hover:border-accent hover:text-accent">{savedTopic}</button>)}<button onClick={clearSavedTopics} className="ml-auto text-[11px] font-semibold text-muted-foreground hover:text-foreground">Clear</button></div>}<div className="mt-3 flex flex-wrap gap-2">{topics.map(value => <a key={value} href={knowledgeTopicPath(value)} onClick={event => { event.preventDefault(); onChooseTopic(value); }} aria-current={topic === value ? "page" : undefined} className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${topic === value ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground"}`}>{value}</a>)}{showClear && <button onClick={onClearFilters} className="rounded-full border border-primary/25 px-2.5 py-1 text-[11px] font-semibold text-primary">Clear all</button>}</div></div>;
}
