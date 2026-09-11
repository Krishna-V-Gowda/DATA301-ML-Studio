import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { platform } from '@/lib/platform';

export function CampusStory() {
  return (
    <section className="campus-story" aria-labelledby="campus-story-title">
      <div className="campus-story__mosaic" aria-label="Vidyashilp University campus">
        <figure className="campus-story__main">
          <Image src="/campus/vu-campus-building.webp" alt="Vidyashilp University academic buildings and landscaped campus" fill sizes="(max-width: 900px) 92vw, 680px" />
        </figure>
        <figure className="campus-story__detail">
          <Image src="/campus/vu-campus-detail.webp" alt="Vidyashilp University campus architecture" fill sizes="(max-width: 900px) 44vw, 300px" />
        </figure>
        <div className="campus-story__coordinates"><span>Founding campus</span><i /> <span>Bengaluru</span></div>
      </div>
      <div className="campus-story__copy">
        <span className="eyebrow eyebrow--light">Built for the VU classroom</span>
        <h2 id="campus-story-title">A digital course space with the energy of the campus.</h2>
        <p>
          The platform is designed around Vidyashilp University&apos;s practice-led environment: concepts are
          introduced rigorously, explored visually, implemented in labs, and connected to real decisions.
        </p>
        <div className="campus-story__principles">
          <article><strong>01</strong><span>Domain depth</span><p>Build precise mental models before selecting tools.</p></article>
          <article><strong>02</strong><span>Experiential learning</span><p>Change parameters, observe outcomes, and explain why.</p></article>
          <article><strong>03</strong><span>Interdisciplinary judgement</span><p>Connect data, models, context, and consequences.</p></article>
        </div>
        <Link className="button button--light" href={platform.campusUrl} target="_blank" rel="noreferrer">
          Explore VU campus <Icon name="arrow" />
        </Link>
      </div>
    </section>
  );
}
