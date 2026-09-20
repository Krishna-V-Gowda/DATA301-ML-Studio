import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { projectBriefs } from '@/lib/project-data';
import { Icon } from '@/components/ui/Icon';

export const metadata: Metadata = { title: 'Projects', description: 'Project-based learning guidance for DATA301 Machine Learning.' };



export default function ProjectsPage() {
  return <main id="main-content" className="d6-page d6-projects">
    <section className="d6-project-hero"><div className="d6-shell d6-project-hero__grid"><div><p className="d6-eyebrow">Project studio · DATA301</p><h1>Start with a question.<em>End with evidence.</em></h1></div><div><p>Projects turn course ideas into a reproducible argument: define the problem, inspect the data, establish a baseline, test responsibly, and defend what the evidence supports.</p><ol className="d6-project-method">{['Question','Data','Baseline','Evidence','Defence'].map((item,i)=><li className="d6-project-method__step" key={item}><span>0{i+1}</span><strong>{item}</strong></li>)}</ol></div></div></section>
    <section className="d6-project-feature"><div className="d6-project-feature__image"><Image src="/campus/vu-campus-building.webp" alt="Vidyashilp University campus" fill sizes="(max-width: 1100px) 100vw, 53vw"/></div><div className="d6-project-feature__copy"><p className="d6-eyebrow">Applied at Vidyashilp</p><h2>Make the method visible, then make the claim defensible.</h2><p>A strong project is not defined by vocabulary or model complexity. It is defined by a clear question, an appropriate method, credible evidence, and an honest account of limitations.</p></div></section>
    <section className="d6-projects-list"><div className="d6-shell"><p className="d6-eyebrow">Project directions</p><h2 className="d6-serif" style={{margin:'12px 0 0',fontSize:'clamp(3.2rem,5vw,5.8rem)',lineHeight:'.88',fontWeight:400,letterSpacing:'-.06em'}}>Four starting points.<br/>Room to investigate.</h2><div className="d6-project-list">{projectBriefs.map((project,index)=><Link className="d6-project-row" href={`/projects/${project.slug}`} key={project.title} aria-label={`Open ${project.title} project brief`}><span className="d6-project-row__num">0{index+1}</span><div><span className="d6-project-row__level">{project.level}</span><h3>{project.title}</h3><p>{project.objective}</p></div><div className="d6-project-row__details"><span>{project.concepts}</span><strong><Icon name="file" size={13}/> {project.output}</strong></div><span className="d6-project-row__arrow">→</span></Link>)}</div></div></section>
    <section className="d6-project-expectations"><div className="d6-shell d6-project-expectations__grid"><div><p className="d6-eyebrow d6-eyebrow--light">Submission standard</p><h2>Build something you can explain under questioning.</h2><p>The course overview calls for a complete package: scope, data, literature review, baseline, preliminary results, final artifacts, source code and viva defence.</p></div><ol>{['Define title, inputs, outputs, dataset and scope.','Conduct literature survey and establish a baseline.','Present preliminary results and a credible further plan.','Submit report, presentation, source code and README.','Demonstrate code and defend decisions through viva.'].map((step,i)=><li key={step}><span>0{i+1}</span>{step}</li>)}</ol></div></section>
  </main>;
}
