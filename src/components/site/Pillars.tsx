import { Reveal } from "@/components/ui/Reveal";

interface Pillar {
  readonly title: string;
  readonly body: string;
}

/** The three-up copy blocks used under The Vibe and Live Acts. */
export function Pillars({ pillars }: { pillars: readonly Pillar[] }) {
  return (
    <ul className="grid gap-10 text-center md:grid-cols-3 md:gap-8">
      {pillars.map((pillar, i) => (
        <Reveal key={pillar.title} as="li" delay={Math.min(i * 0.08, 0.3)}>
          <h3 className="font-display text-[1.275rem] text-gold">{pillar.title}</h3>
          <p className="mx-auto mt-3.5 max-w-xs text-[0.782rem] leading-relaxed text-muted">
            {pillar.body}
          </p>
        </Reveal>
      ))}
    </ul>
  );
}

/** "Nightlife metrics" — three headline figures on a hairline-divided row. */
export function Metrics({
  metrics,
}: {
  metrics: readonly { readonly value: string; readonly label: string }[];
}) {
  return (
    <div className="container-luxe">
      <p className="text-center font-ui text-[0.612rem] uppercase tracking-[0.42em] text-gold-gradient">
        Nightlife Metrics
      </p>

      <ul className="mt-12 grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {metrics.map((metric, i) => (
          <Reveal key={metric.label} as="li" delay={Math.min(i * 0.1, 0.3)}>
            <div className="px-6 py-10 text-center md:py-4">
              <p className="font-display text-[clamp(2.55rem,5.5vw,3.4rem)] italic leading-none text-gold-gradient">
                {metric.value}
              </p>
              <p className="mt-5 font-ui text-[0.629rem] uppercase tracking-[0.2em] text-muted">
                {metric.label}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
