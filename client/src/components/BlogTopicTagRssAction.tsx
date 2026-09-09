import { Copy, Rss, Tag } from "lucide-react";
import { toast } from "sonner";
import { blogTopicPath, toBlogDiscoverySlug } from "@/lib/blogDiscovery";
import { toastMessages } from "@/lib/toastMessages";

export default function BlogTopicTagRssAction({ topic, category = false }: { topic: string; category?: boolean }) {
  const copyFeedLink = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      const feedUrl = new URL(`/rss/topics/${toBlogDiscoverySlug(topic)}.xml`, window.location.origin).toString();
      await navigator.clipboard.writeText(feedUrl);
      toast.success(toastMessages.rssLinkCopied);
    } catch {
      toast.error(toastMessages.rssLinkCopyFailure);
    }
  };

  return <span className={`inline-flex items-center overflow-hidden rounded-full border ${category ? "border-primary/20 bg-primary/8 text-primary" : "border-border bg-card text-muted-foreground"}`}><a href={blogTopicPath(topic)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold hover:opacity-80">{category ? <Tag className="h-3.5 w-3.5" /> : null}{category ? topic : `#${topic}`}</a><button type="button" onClick={copyFeedLink} aria-label={`Copy RSS link for ${topic}`} title={`Copy ${topic} RSS link`} className="border-l border-current/15 px-2 py-1.5 transition hover:bg-current/10"><Rss className="h-3.5 w-3.5" /></button></span>;
}
