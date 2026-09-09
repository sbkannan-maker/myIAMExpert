import { CheckCircle2, Loader2, Mail } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { toastMessages } from "@/lib/toastMessages";

export function NewsletterSuccessMessage({ onSubscribeAnotherEmail }: { onSubscribeAnotherEmail: () => void }) {
  return <div role="status" aria-live="polite" className="animate-in fade-in zoom-in-95 duration-300 rounded-xl border border-emerald-600/20 bg-emerald-50 p-4 text-emerald-950"><div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-600 text-white shadow-sm shadow-emerald-600/25"><CheckCircle2 className="h-4 w-4" /></span><div><p className="text-sm font-semibold">Subscription confirmed.</p><p className="mt-1 text-xs leading-5 text-emerald-900/80">You’ll receive future IAM article updates when new notes are published.</p></div></div><button type="button" onClick={onSubscribeAnotherEmail} className="mt-4 text-xs font-semibold text-emerald-800 underline decoration-emerald-800/30 underline-offset-4 transition hover:text-emerald-950">Subscribe another email</button></div>;
}

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const subscription = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
      toast.success(toastMessages.newsletterSuccess);
    },
    onError: (error) => {
      toast.error(error.message || toastMessages.newsletterFailure);
    },
  });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(false);
    subscription.reset();
    toast.info(toastMessages.newsletterPending);
    subscription.mutate({ email, website });
  };

  return <aside className="h-fit rounded-2xl border border-primary/20 bg-card bg-[radial-gradient(circle_at_95%_0%,oklch(0.48_0.10_220_/_0.22),transparent_13rem)] p-6 shadow-[0_18px_45px_-38px_oklch(0.42_0.11_230)] md:sticky md:top-24"><div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Mail className="h-5 w-5" /></div><p className="mt-5 font-mono text-[11px] uppercase tracking-[.16em] text-primary">IAM article updates</p><h2 className="mt-2 text-2xl">Keep the next pattern close.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Join the article list for future IAM architecture notes, SailPoint delivery patterns, and governance updates.</p><form onSubmit={submit} className="mt-5"><input className="hidden" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} aria-hidden="true" />{subscribed ? <NewsletterSuccessMessage onSubscribeAnotherEmail={() => setSubscribed(false)} /> : <><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="h-11 w-full rounded-lg border border-input bg-background/80 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />{subscription.error && <p className="mt-3 text-xs leading-5 text-destructive">{subscription.error.message}</p>}<button disabled={subscription.isPending} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">{subscription.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}{subscription.isPending ? "Joining…" : "Subscribe to updates"}</button></>}</form><p className="mt-4 text-[11px] leading-5 text-muted-foreground">No advertising. Unsubscribe options will accompany any future newsletter delivery.</p></aside>;
}
