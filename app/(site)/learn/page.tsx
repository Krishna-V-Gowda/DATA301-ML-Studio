import Link from 'next/link';
import { modules } from '@/lib/course-data';
import { platform } from '@/lib/platform';
import { Icon } from '@/components/ui/Icon';

export const metadata = { title: 'Learning Atlas', description: 'DATA301 learning roadmap with all thirty lecture sessions and connected practice.' };

export default function LearnPage() {
  return <main id="main-content" className="d6-page d6-learn">
    <section className="d6-learn-map"><div className="d6-shell"><div className="d6-learn-map__intro"><div><p className="d6-eyebrow">Learning atlas · DATA301</p><h1>See how the pieces <em>become a model.</em></h1></div><p>Thirty lectures form one sequence: foundations first, supervised learning next, then structure, evaluation, regularization and model building. Each module keeps its lectures, practice and related laboratories in view.</p></div><div className="d6-learn-summary"><div><strong>4</strong><span>modules</span></div><div><strong>30</strong><span>lecture sessions</span></div><div><strong>30</strong><span>practice sessions</span></div><div><strong>12</strong><span>connected labs</span></div></div></div></section>
    <section className="d6-learning-atlas"><div className="d6-shell">{modules.map((module)=><article className="d6-learning-module" key={module.slug}><div className="d6-learning-module__index"><strong>0{module.number}</strong><span>{module.level}</span></div><div><div className="d6-learning-module__head"><div><p className="d6-eyebrow">Module {module.number}</p><h2>{module.shortTitle}</h2></div><p>{module.description}</p></div><div className="d6-session-grid">{module.lectures.map((lecture)=><Link href={`/learn/module/${module.slug}`} className="d6-session" key={lecture.number}><span className="d6-session__num">{String(lecture.number).padStart(2,'0')}</span><h3>{lecture.title}</h3>{lecture.practice ? <p className="d6-session__practice">{lecture.practice.code} · {lecture.practice.title}</p> : null}</Link>)}</div><div style={{marginTop:'17px'}}><Link className="d6-text-link" href={`/learn/module/${module.slug}`}>Open module <span>→</span></Link></div></div></article>)}</div></section>
    <section className="d6-learn-bridge"><div className="d6-shell d6-learn-bridge__grid"><div><p className="d6-eyebrow d6-eyebrow--light">Implementation path</p><h2>Move from visual intuition to Python and Jupyter.</h2><p>The browser laboratories are the conceptual bridge. The instructor&apos;s official repository remains the practical notebook environment.</p></div><Link className="d6-button" href={platform.instructor.github} target="_blank" rel="noreferrer">Course ML Lab <Icon name="external" size={15}/></Link></div></section>
  </main>;
}
