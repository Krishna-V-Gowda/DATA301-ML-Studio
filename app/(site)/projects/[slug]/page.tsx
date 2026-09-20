import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { projectBriefBySlug, projectBriefs } from '@/lib/project-data';

export function generateStaticParams() {
  return projectBriefs.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBriefBySlug.get(slug);
  if (!project) return { title: 'Project' };
  return { title: project.title, description: project.objective };
}

export default async function ProjectBriefPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBriefBySlug.get(slug);
  if (!project) notFound();

  return (
    <main id="main-content" className="d6-page d6-project-brief">
      <section className="d6-project-brief__hero">
        <div className="d6-shell d6-project-brief__hero-grid">
          <div>
            <Link className="d6-back-link" href="/projects"><span>←</span> Projects</Link>
            <p className="d6-eyebrow">{project.level} · Project {project.number}</p>
            <h1>{project.title}</h1>
            <p className="d6-project-brief__objective">{project.objective}</p>
          </div>
          <div className="d6-project-brief__question">
            <p className="d6-eyebrow">Investigation question</p>
            <p>{project.question}</p>
          </div>
        </div>
      </section>

      <section className="d6-project-brief__body">
        <div className="d6-shell d6-project-brief__body-grid">
          <div>
            <p className="d6-eyebrow">A defensible route</p>
            <h2>Start with a question. Build the evidence around it.</h2>
          </div>
          <div>
            <ol className="d6-project-steps">
              {project.investigation.map((step, index) => (
                <li key={step}>
                  <span>0{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="d6-project-brief__details">
        <div className="d6-shell d6-project-brief__details-grid">
          <div className="d6-project-brief__detail-block">
            <p className="d6-eyebrow">Course concepts</p>
            <p>{project.concepts}</p>
          </div>
          <div className="d6-project-brief__detail-block">
            <p className="d6-eyebrow">Expected package</p>
            <p>{project.output}</p>
          </div>
          <div className="d6-project-brief__detail-block">
            <p className="d6-eyebrow">Connected laboratories</p>
            <div className="d6-project-labs">
              {project.connectedLabs.map((lab) => (
                <Link key={lab.href} href={lab.href}>
                  {lab.title}<Icon name="arrow" size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="d6-project-brief__close">
        <div className="d6-shell d6-project-brief__close-grid">
          <p className="d6-eyebrow d6-eyebrow--light">Project studio</p>
          <div>
            <h2>Make the claim no larger than the evidence.</h2>
            <Link className="d6-button" href="/projects">Back to project directions <Icon name="arrow" size={15} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
