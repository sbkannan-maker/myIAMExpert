import { Bold, List, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";

type GuidanceDocument = {
  title: string;
  intro: string;
  rules: string[];
  privateContactNote: string;
};

function parseGuidance(document: string): GuidanceDocument {
  try {
    const parsed = JSON.parse(document) as Partial<GuidanceDocument>;
    return {
      title: typeof parsed.title === "string" ? parsed.title : "myIAM community guidance",
      intro: typeof parsed.intro === "string" ? parsed.intro : "",
      rules: Array.isArray(parsed.rules) ? parsed.rules.filter((rule): rule is string => typeof rule === "string") : [],
      privateContactNote: typeof parsed.privateContactNote === "string" ? parsed.privateContactNote : "",
    };
  } catch {
    return { title: "myIAM community guidance", intro: "", rules: [], privateContactNote: "" };
  }
}

export default function CommunityGuidanceEditor({ document, onChange }: { document: string; onChange: (document: string) => void }) {
  const guidance = useMemo(() => parseGuidance(document), [document]);
  const update = (patch: Partial<GuidanceDocument>) => onChange(JSON.stringify({ ...guidance, ...patch }, null, 2));
  const updateRule = (index: number, value: string) => update({ rules: guidance.rules.map((rule, ruleIndex) => ruleIndex === index ? value : rule) });
  const wrapSelection = (target: HTMLTextAreaElement | HTMLInputElement, value: string, setValue: (value: string) => void) => {
    const start = target.selectionStart ?? value.length;
    const end = target.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || "important text";
    const next = `${value.slice(0, start)}**${selected}**${value.slice(end)}`;
    setValue(next);
    requestAnimationFrame(() => { target.focus(); target.setSelectionRange(start + 2, end + 2); });
  };

  return <div className="space-y-5" aria-label="Community guidance rich text editor">
    <label className="grid gap-1.5 text-xs font-semibold text-slate-300">Guidance title<input value={guidance.title} onChange={(event) => update({ title: event.target.value })} className="rounded-lg border border-white/10 bg-[#050a14] px-3 py-2.5 text-sm font-normal text-white outline-none focus:border-cyan-300/60" /></label>
    <label className="grid gap-1.5 text-xs font-semibold text-slate-300">Introduction<div className="rounded-lg border border-white/10 bg-[#050a14] focus-within:border-cyan-300/60"><div className="flex border-b border-white/8 p-1.5"><button type="button" onClick={(event) => wrapSelection(event.currentTarget.closest("div")?.nextElementSibling as HTMLTextAreaElement, guidance.intro, (value) => update({ intro: value }))} className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-bold text-cyan-200 hover:bg-white/8" aria-label="Bold selected introduction text"><Bold className="h-3.5 w-3.5" />Bold</button></div><textarea value={guidance.intro} onChange={(event) => update({ intro: event.target.value })} rows={3} className="w-full resize-y bg-transparent p-3 text-sm font-normal leading-6 text-white outline-none" /></div></label>
    <section className="rounded-xl border border-white/10 bg-[#050a14] p-4" aria-labelledby="community-rules-heading"><div className="flex items-center justify-between gap-3"><div><h3 id="community-rules-heading" className="flex items-center gap-2 text-sm font-semibold text-white"><List className="h-4 w-4 text-cyan-300" /> Community rules</h3><p className="mt-1 text-[11px] text-slate-500">Each row is a list item. Use Bold to retain emphasis with Markdown markers.</p></div><button type="button" onClick={() => update({ rules: [...guidance.rules, "New community rule"] })} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/25 px-2.5 py-2 text-[11px] font-bold text-cyan-100 hover:bg-cyan-300/10"><Plus className="h-3.5 w-3.5" /> Add rule</button></div><div className="mt-4 space-y-3">{guidance.rules.map((rule, index) => <div key={`rule-${index}`} className="flex items-start gap-2"><span className="mt-2.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-300/10 font-mono text-[10px] text-cyan-200">{index + 1}</span><div className="flex min-w-0 flex-1 gap-1.5"><input value={rule} onChange={(event) => updateRule(index, event.target.value)} className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#07101e] px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60" aria-label={`Community rule ${index + 1}`} /><button type="button" onClick={(event) => wrapSelection(event.currentTarget.previousElementSibling as HTMLInputElement, rule, (value) => updateRule(index, value))} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-cyan-200 hover:bg-white/8" aria-label={`Bold community rule ${index + 1}`}><Bold className="h-3.5 w-3.5" /></button><button type="button" onClick={() => update({ rules: guidance.rules.filter((_, ruleIndex) => ruleIndex !== index) })} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-300/15 text-rose-200 hover:bg-rose-300/10" aria-label={`Remove community rule ${index + 1}`}><Trash2 className="h-3.5 w-3.5" /></button></div></div>)}</div></section>
    <label className="grid gap-1.5 text-xs font-semibold text-slate-300">Private-contact note<textarea value={guidance.privateContactNote} onChange={(event) => update({ privateContactNote: event.target.value })} rows={3} className="resize-y rounded-lg border border-white/10 bg-[#050a14] px-3 py-2.5 text-sm font-normal leading-6 text-white outline-none focus:border-cyan-300/60" /></label>
    <p className="rounded-lg border border-amber-300/15 bg-amber-300/[.04] px-3 py-2.5 text-[11px] leading-5 text-amber-100/80">Private owner content only. This guidance is stored with managed content but excluded from the public content feed.</p>
  </div>;
}
