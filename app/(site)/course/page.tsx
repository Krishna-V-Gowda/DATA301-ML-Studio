import type { Metadata } from 'next';
import Link from 'next/link';
import { course, modules, outcomes } from '@/lib/course-data';
import { platform } from '@/lib/platform';
import { Icon } from '@/components/ui/Icon';

export const metadata: Metadata = { title: 'Course', description: 'DATA301 Machine Learning course overview, outcomes, structure, and instructor.' };

export default function CoursePage() {
  return <main id="main-content" className="d6-page d6-course">
    <section className="d6-course-hero"><div className="d6-shell">
      <div className="d6-course-hero__grid"><div><p className="d6-eyebrow">The course · DATA301</p><h1>Understand the model.<em>Defend the decision.</em></h1></div><div className="d6-course-hero__body"><p>{course.description}</p><div className="d6-home-actions"><Link className="d6-button d6-button--dark" href="/learn">Open the learning atlas <Icon name="arrow" size={15}/></Link><Link className="d6-button d6-button--light" href="/labs">Enter the laboratories <Icon name="arrow" size={15}/></Link></div></div></div>
      <div className="d6-course-facts">{[['Course',course.code],['Semester',course.semester],['Credits',String(course.credits)],['Duration',`${course.durationWeeks} weeks`],['Lecture',`${course.lectureHours} hours`],['Practice',`${course.practiceHours} hours`]].map(([label,value])=><div className="d6-course-fact" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    </div></section>

    <section className="d6-course-section"><div className="d6-shell d6-course-anatomy"><div><p className="d6-eyebrow">Course anatomy</p><h2>A connected sequence, from foundations to model building.</h2></div><div className="d6-course-anatomy__body"><p>DATA301 develops a practical and conceptual foundation across regression, classification, clustering, dimensionality reduction, evaluation, regularization and perceptron-based models.</p><p>Python practice accompanies the lecture sequence so students can move from understanding a method to inspecting what it actually does.</p><div className="d6-callout"><span>Prerequisite</span><strong>{course.prerequisite}</strong></div></div></div></section>

    <section className="d6-course-section d6-course-outcomes"><div className="d6-shell d6-course-outcomes"><p className="d6-eyebrow">Learning outcomes</p><h2>Four outcomes shape the work.</h2><div className="d6-outcome-list">{outcomes.map((item)=><div className="d6-outcome" key={item.code}><span className="d6-outcome__code">{item.code}</span><p>{item.description}</p><span className="d6-outcome__level">{item.level}</span></div>)}</div></div></section>

    <section className="d6-course-section"><div className="d6-shell d6-course-modules"><p className="d6-eyebrow">Course structure</p><h2>Four modules. Thirty sessions.</h2><div className="d6-module-rows">{modules.map((module)=><Link className="d6-module-row" href={`/learn/module/${module.slug}`} key={module.slug}><span className="d6-module-row__num">0{module.number}</span><div><h3>{module.shortTitle}</h3><p>{module.takeaway}</p></div><div className="d6-module-row__meta"><span>{module.lectureSessions} lecture</span><span>{module.practiceSessions} practice</span></div><span className="d6-module-row__arrow">→</span></Link>)}</div></div></section>

    <section className="d6-course-instructor"><div className="d6-shell d6-course-instructor__grid"><div className="d6-course-instructor__number">FACULTY<br/>01</div><div><p className="d6-eyebrow d6-eyebrow--light">Course instructor</p><h2>{platform.instructor.name}</h2><p>Associate Professor · School of Engineering &amp; Technology · Vidyashilp University</p></div><div className="d6-course-instructor__links"><Link href="/instructor">Academic profile <Icon name="arrow" size={15}/></Link><Link href={platform.instructor.github} target="_blank" rel="noreferrer">ML Lab repository <Icon name="external" size={14}/></Link></div></div></section>
  </main>;
}
