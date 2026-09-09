import { Rss } from "lucide-react";
import { findBlogTopic } from "@/lib/blogDiscovery";

export default function TopicRssSubscribeLink({ slug }: { slug: string }) {
  const topic = findBlogTopic(slug);
  if (!topic) return null;
  return <section className="border-t border-border/70 bg-secondary/25"><div className="container py-10"><div className="flex flex-col justify-between gap-4 rounded-2xl border border-accent/25 bg-accent/7 p-5 sm:flex-row sm:items-center"><div><p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[.16em] text-accent"><Rss className="h-4 w-4" /> Topic RSS</p><h2 className="mt-2 text-xl">Subscribe to {topic}.</h2><p className="mt-2 text-sm text-muted-foreground">Open this feed in your RSS reader to follow new articles for this topic.</p></div><a href={`/rss/topics/${slug}.xml`} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Rss className="h-4 w-4" /> Subscribe by RSS</a></div></div></section>;
}
