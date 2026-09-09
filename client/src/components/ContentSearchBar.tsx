import { Search, X } from "lucide-react";

type ContentSearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  resultLabel?: string;
  className?: string;
};

export default function ContentSearchBar({ value, onValueChange, placeholder, resultLabel, className = "" }: ContentSearchBarProps) {
  return <div className={`content-search-bar relative ${className}`}><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" /><label className="sr-only" htmlFor="content-search">Search displayed content</label><input id="content-search" value={value} onChange={(event) => onValueChange(event.target.value)} type="search" placeholder={placeholder} className="h-12 w-full rounded-xl border border-border/85 bg-card/75 pl-11 pr-24 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-accent/60 focus:ring-2 focus:ring-accent/15" />{value && <button type="button" onClick={() => onValueChange("")} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Clear search"><X className="h-4 w-4" /></button>}{resultLabel && <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">{resultLabel}</p>}</div>;
}
