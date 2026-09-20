import Image from 'next/image';
import Link from 'next/link';
import { course, modules } from '@/lib/course-data';
import { labs } from '@/lib/labs-data';
import { getPublishedMaterials } from '@/lib/supabase/queries';
import { Icon } from '@/components/ui/Icon';

const featuredLabIds = ['linear-regression', 'knn', 'kmeans', 'roc-pr'];

function orderedMaterials<T extends { title: string; moduleSlug?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const priority = (item: T) => item.title === 'DATA301 Course Overview' ? 0 : item.moduleSlug === 'supervised-learning' ? 1 : item.moduleSlug === 'introduction-and-data' ? 2 : 3;
    return priority(a) - priority(b);
  });
}

function LabGlyph({ index }: { index: number }) {
  const variants = [
    <><path d="M18 76 C58 62 82 56 118 45 C155 34 177 29 208 18"/><circle cx="54" cy="58" r="4"/><circle cx="88" cy="50" r="4"/><circle cx="126" cy="40" r="4"/></>,
    <><path d="M18 65 C62 45 104 36 150 28 C176 24 195 21 210 18"/><circle cx="66" cy="48" r="4"/><circle cx="108" cy="37" r="4"/><circle cx="162" cy="27" r="4"/></>,
    <><path d="M20 54 L74 40 L118 55 L168 28 L210 37"/><circle cx="20" cy="54" r="4"/><circle cx="74" cy="40" r="4"/><circle cx="118" cy="55" r="4"/><circle cx="168" cy="28" r="4"/></>,
    <><path d="M20 70 C62 58 90 50 118 46 C152 41 182 26 210 18"/><path d="M20 74 C62 62 90 54 118 50 C152 45 182 30 210 22" strokeDasharray="5 6"/><circle cx="74" cy="55" r="4"/><circle cx="156" cy="38" r="4"/></>,
  ];
  return <svg viewBox="0 0 228 95" aria-hidden="true"><g fill="none" stroke="rgba(19,32,42,.13)"><path d="M18 12V82M66 12V82M114 12V82M162 12V82M210 12V82"/><path d="M10 28H218M10 55H218M10 82H218"/></g><g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{variants[index % variants.length]}</g></svg>;
}

function ModuleSignal({ index }: { index: number }) {
  const common = { viewBox: '0 0 228 95', 'aria-hidden': true as const, className: 'd6-module__signal-svg' };
  if (index === 0) return <div className="d6-module__signal"><svg {...common}><g className="d6-module__grid"><path d="M18 18V80M66 18V80M114 18V80M162 18V80M210 18V80"/><path d="M18 28H210M18 52H210M18 76H210"/></g><g className="d6-module__points"><circle cx="42" cy="58" r="4"/><circle cx="72" cy="47" r="4"/><circle cx="104" cy="54" r="4"/><circle cx="138" cy="35" r="4"/><circle cx="170" cy="40" r="4"/></g><path className="d6-module__accent" d="M24 64 C74 56 116 52 164 34 C182 27 198 24 212 20"/></svg></div>;
  if (index === 1) return <div className="d6-module__signal"><svg {...common}><g className="d6-module__grid"><path d="M18 18V80M66 18V80M114 18V80M162 18V80M210 18V80"/><path d="M18 28H210M18 52H210M18 76H210"/></g><g className="d6-module__points"><circle cx="42" cy="68" r="4"/><circle cx="72" cy="59" r="4"/><circle cx="100" cy="50" r="4"/><circle cx="128" cy="40" r="4"/><circle cx="158" cy="31" r="4"/><circle cx="188" cy="22" r="4"/></g><path className="d6-module__accent" d="M24 76 C76 61 122 47 208 17"/></svg></div>;
  if (index === 2) return <div className="d6-module__signal"><svg {...common}><g className="d6-module__grid"><path d="M18 18V80M66 18V80M114 18V80M162 18V80M210 18V80"/><path d="M18 28H210M18 52H210M18 76H210"/></g><g className="d6-module__cluster"><circle cx="52" cy="36" r="4"/><circle cx="67" cy="44" r="4"/><circle cx="54" cy="53" r="4"/><circle cx="78" cy="53" r="4"/><circle cx="62" cy="61" r="4"/><circle cx="151" cy="31" r="4"/><circle cx="167" cy="39" r="4"/><circle cx="153" cy="49" r="4"/><circle cx="173" cy="52" r="4"/></g><path className="d6-module__accent" d="M92 24 L128 70"/></svg></div>;
  return <div className="d6-module__signal"><svg {...common}><g className="d6-module__grid"><path d="M18 18V80M66 18V80M114 18V80M162 18V80M210 18V80"/><path d="M18 28H210M18 52H210M18 76H210"/></g><path className="d6-module__accent" d="M24 68 C60 61 90 58 120 47 C152 36 176 26 208 18"/><path className="d6-module__compare" d="M24 75 C62 70 96 64 126 54 C158 43 184 34 208 26"/></svg></div>;
}

export default async function HomePage() {
  const materials = orderedMaterials(await getPublishedMaterials());
  const featuredLabs = featuredLabIds.map((id) => labs.find((lab) => lab.id === id)).filter((lab): lab is (typeof labs)[number] => Boolean(lab));
  const schema = { '@context': 'https://schema.org', '@type': 'Course', name: `${course.code}: ${course.title}`, description: course.description, provider: { '@type': 'CollegeOrUniversity', name: 'Vidyashilp University' }, educationalLevel: 'Undergraduate', numberOfCredits: course.credits };

  return <main id="main-content" className="d6-page d6-home">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

    <section className="d6-home-hero">
      <div className="d6-shell d6-home-hero__grid">
        <div className="d6-home-hero__copy">
          <p className="d6-eyebrow">Vidyashilp University · DATA301</p>
          <h1><span>Machine learning,</span><em>made visible.</em></h1>
          <p className="d6-home-hero__lede">A rigorous course environment where mathematical intuition, model behaviour, implementation, evaluation and independent judgement stay connected.</p>
          <div className="d6-home-actions">
            <Link className="d6-button d6-button--dark" href="/labs">Enter the laboratories <Icon name="arrow" size={16} /></Link>
            <Link className="d6-button d6-button--light" href="/course">Explore the course <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="d6-home-proof" aria-label="Course at a glance">
            <div><strong>12</strong><span>interactive labs</span></div><div><strong>30</strong><span>lecture sessions</span></div><div><strong>4</strong><span>connected modules</span></div>
          </div>
        </div>
        <div className="d6-home-hero__visual">
          <Link className="d6-model-card" href="/labs/linear-regression" aria-label="Open Linear Regression Studio">
            <div className="d6-model-card__head"><span>MODEL FIELD / LEARNED RESPONSE</span><strong>LIVE LAB</strong></div>
            <div className="d6-model-card__plot">
              <svg viewBox="0 0 720 460" role="img" aria-label="Illustrative machine learning decision boundary">
                <defs><linearGradient id="field" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f7f3e8"/><stop offset="1" stopColor="#dce9f3"/></linearGradient></defs>
                <rect width="720" height="460" fill="url(#field)"/>
                <g stroke="#c6ced3" strokeWidth="1" opacity=".55"><path d="M72 36V416M168 36V416M264 36V416M360 36V416M456 36V416M552 36V416M648 36V416"/><path d="M52 86H668M52 166H668M52 246H668M52 326H668M52 406H668"/></g>
                <path d="M62 355 C155 332 235 315 312 278 C385 242 426 213 496 185 C555 161 610 118 665 82" fill="none" stroke="#1e4f83" strokeWidth="7" strokeLinecap="round"/>
                <path d="M62 368 C155 345 235 328 312 291 C385 255 426 226 496 198 C555 174 610 131 665 95" fill="none" stroke="#b51e3b" strokeWidth="2" strokeDasharray="7 8"/>
                {[['#1e4f83',104,316],['#1e4f83',151,300],['#1e4f83',199,284],['#1e4f83',248,266],['#1e4f83',304,242],['#1e4f83',352,225],['#1e4f83',420,205],['#1e4f83',486,176],['#1e4f83',562,140],['#b51e3b',122,238],['#b51e3b',177,216],['#b51e3b',235,193],['#b51e3b',295,171],['#b51e3b',361,145],['#b51e3b',430,117],['#b51e3b',505,95],['#b51e3b',590,64]].map(([fill,cx,cy],i)=><circle key={i} cx={cx as number} cy={cy as number} r="7" fill={fill as string}/>)}
                <circle cx="420" cy="205" r="15" fill="none" stroke="#13202a" opacity=".25"/><circle cx="420" cy="205" r="4" fill="#13202a"/>
              </svg>
            </div>
            <div className="d6-model-card__foot"><div><span>FEATURE SPACE</span><strong>learning a boundary from examples</strong></div><div className="d6-model-card__arrow">↗</div></div>
          </Link>
        </div>
      </div>
    </section>

    {/* v51-thesis -> v51-module2-launchpad: preserved release markers */}
    <section className="d6-home-band"><div className="d6-shell d6-home-band__inner"><div><p className="d6-eyebrow d6-eyebrow--light">THE COURSE</p><h2>Learn the model.<br/>Explain the choice.</h2></div><p>DATA301 is built around a continuous loop: understand a concept, alter a model, observe what changes, inspect the mathematics and carry the reasoning into implementation.</p></div></section>

    <section className="d6-home-section"><div className="d6-shell"><div className="d6-section-head"><div><p className="d6-eyebrow">THE LEARNING JOURNEY</p><h2>Four modules. One connected progression.</h2></div><Link className="d6-text-link" href="/learn">Open the learning atlas <span>→</span></Link></div>
      <div className="d6-module-grid">{modules.map((module,index)=><Link className="d6-module" href={`/learn/module/${module.slug}`} key={module.slug}><span className="d6-module__number">0{index+1}</span><ModuleSignal index={index} /><h3>{module.shortTitle}</h3><p>{module.description}</p><span className="d6-module__meta">{module.lectureSessions} lectures · {module.practiceSessions} practice</span></Link>)}</div>
    </div></section>

    <section className="d6-lab-feature"><div className="d6-shell"><div className="d6-section-head"><div><p className="d6-eyebrow d6-eyebrow--light">THE LABORATORY FLOOR</p><h2>Experiment before you implement.</h2></div><Link className="d6-text-link" href="/labs" style={{color:'#fbf9f3'}}>See all 12 <span>→</span></Link></div><div className="d6-lab-grid">{featuredLabs.map((lab,index)=><Link className="d6-lab-card" href={lab.href} key={lab.id}><span className="d6-lab-card__index">{lab.index}</span><div className="d6-lab-card__glyph" style={{color:index%2===0?'#76aee0':'#e6a158'}}><LabGlyph index={index}/></div><span className="d6-lab-card__eyebrow">{lab.tags.join(' · ')}</span><h3>{lab.title}</h3><p>{lab.description}</p></Link>)}</div></div></section>

    <section className="d6-campus-slice"><div className="d6-campus-slice__image"><Image src="/campus/vu-campus-building.webp" alt="Vidyashilp University academic buildings" fill sizes="(max-width: 1100px) 100vw, 58vw"/></div><div className="d6-campus-slice__copy"><p className="d6-eyebrow">VIDYASHILP UNIVERSITY</p><h2>A real place for serious learning.</h2><p>DATA301 belongs to a real school, a real campus and a real academic context. The platform keeps that identity visible without turning the course into a brochure.</p><Link className="d6-button d6-button--light" href="/about">Explore the setting <Icon name="arrow" size={16}/></Link></div></section>

    <section className="d6-materials"><div className="d6-shell"><div className="d6-section-head"><div><p className="d6-eyebrow">CURRENT MATERIALS</p><h2>The next useful document should be obvious.</h2></div><Link className="d6-text-link" href="/resources">Open the library <span>→</span></Link></div><div className="d6-material-list">{materials.slice(0,4).map((material,index)=><Link className="d6-material" href={material.id.startsWith("public-") ? `/resources/read/${material.id}` : "/resources"} key={material.id}><span className="d6-material__number">0{index+1}</span><div><h3>{material.title}</h3><p>{material.description}</p></div><span className="d6-material__meta">{material.format}<br/>{material.sizeLabel}</span><span>→</span></Link>)}</div></div></section>

    <section className="d6-home-close"><div className="d6-shell d6-home-close__inner"><div><p className="d6-eyebrow d6-eyebrow--light">READY TO BEGIN?</p><h2>Start with the course.<br/>Stay for the experiments.</h2></div><Link className="d6-button" href="/labs">Enter the laboratories <Icon name="arrow" size={16}/></Link></div></section>
  </main>;
}
