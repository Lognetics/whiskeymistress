import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-ui text-[0.7rem] uppercase tracking-[0.42em] text-gold-gradient">
        Whiskey Mistress
      </p>
      <h1 className="mt-8 font-display text-[clamp(2.5rem,8vw,5rem)] leading-none text-warm">
        404
      </h1>
      <div className="rule-gold mt-8 w-24" aria-hidden />
      <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-muted">
        This table isn&apos;t set. The page you were looking for has moved or never
        existed.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-[linear-gradient(100deg,#a9862a,#d4af37,#a9862a)] bg-[length:200%_auto] px-9 py-4 font-ui text-[0.8rem] font-medium uppercase tracking-[0.2em] text-ink transition-all duration-500 hover:bg-[position:right_center]"
      >
        Return Home
      </Link>
    </main>
  );
}
