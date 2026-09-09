import { useEffect, useState } from "react";

export function calculateReadingProgress(scrollY: number, scrollHeight: number, viewportHeight: number) {
  const range = Math.max(scrollHeight - viewportHeight, 1);
  return Math.min(100, Math.max(0, Math.round((scrollY / range) * 100)));
}

export default function ArticleReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => setProgress(calculateReadingProgress(window.scrollY, document.documentElement.scrollHeight, window.innerHeight));
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  return <div className="pointer-events-none fixed inset-x-0 top-[4.45rem] z-30 h-0.5 bg-border/60" aria-label="Article reading progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${progress}%` }} /></div>;
}
