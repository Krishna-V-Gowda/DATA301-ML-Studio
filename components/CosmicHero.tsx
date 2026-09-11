import Image from 'next/image';
import Link from 'next/link';
import { HeroDecisionField } from '@/components/HeroDecisionField';
import { Icon } from '@/components/ui/Icon';

export function CosmicHero() {
  return (
    <section className="cosmic-hero">
      <Image className="cosmic-hero__photo" src="/campus/vu-campus-hero.webp" alt="" fill priority sizes="100vw" />
      <div className="cosmic-hero__veil" aria-hidden="true" />
      <div className="cosmic-hero__gridlines" aria-hidden="true" />
      <div className="shell cosmic-hero__layout">
        <div className="cosmic-hero__copy">
          <div className="cosmic-hero__kicker"><span>Vidyashilp University</span><i /> DATA301 · Semester V</div>
          <h1>Machine Learning,<br /><em>made visible.</em></h1>
          <p>
            A rigorous, interactive course environment where students move from intuition to mathematics,
            implementation, evaluation, and independent judgement.
          </p>
          <div className="cosmic-hero__actions">
            <Link className="button button--light button--large" href="/course">Course overview <Icon name="arrow" /></Link>
            <Link className="button button--glass button--large" href="/labs">Enter the labs <Icon name="lab" /></Link>
          </div>
          <div className="cosmic-hero__proof">
            <span><strong>12</strong> live laboratories</span>
            <span><strong>30</strong> lecture sessions</span>
            <span><strong>4</strong> connected modules</span>
          </div>
        </div>
        <div className="cosmic-hero__instrument">
          <div className="cosmic-hero__instrument-label"><span>Live model field</span><strong>Change → Observe → Explain</strong></div>
          <HeroDecisionField />
        </div>
      </div>
      <div className="cosmic-hero__scroll" aria-hidden="true"><span>Explore</span><i /></div>
    </section>
  );
}
