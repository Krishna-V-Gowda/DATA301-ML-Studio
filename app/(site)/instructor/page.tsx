import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { platform } from '@/lib/platform';

export const metadata = { title: 'Course Instructor | DATA301 Machine Learning', description: 'Course instructor information for DATA301 Machine Learning at Vidyashilp University.' };

const interests = [
  ['01','Machine Learning','Core field'], ['02','Computer Vision','Core field'], ['03','Deep Learning','Research area'], ['04','Transfer Learning','Research area'], ['05','Neural Network Compression','Research area'], ['06','Neural Architecture Search','Research area'],
];

export default function InstructorPage() {
  return <main id="main-content" className="d6-page d6-instructor">
    <section className="d6-instructor-hero"><div className="d6-shell"><div className="d6-instructor-hero__top"><p className="d6-eyebrow">DATA301 · Course instructor</p><span className="d6-smallcaps">ML / 301</span></div><div className="d6-instructor-hero__grid"><div><h1><small>Dr.</small>Shabbeer<br/>Basha</h1></div><div className="d6-instructor-identity"><strong>Associate Professor</strong><p>School of Engineering &amp; Technology<br/>Vidyashilp University · Bengaluru</p><p style={{marginTop:18}}>Machine learning · computer vision · model efficiency</p></div><div className="d6-instructor-links"><Link href="/admin/login">Instructor portal <Icon name="arrow" size={15}/></Link><Link href={platform.instructor.github} target="_blank" rel="noreferrer">ML Lab repository <Icon name="external" size={14}/></Link><Link href={platform.instructor.portfolio} target="_blank" rel="noreferrer">Academic profile <Icon name="external" size={14}/></Link></div></div></div></section>
    <section className="d6-instructor-profile"><div><p className="d6-eyebrow">Academic profile</p></div><div className="d6-instructor-profile__main"><h2>Teaching grounded in research, industry experience and applied practice.</h2><div className="d6-instructor-profile__copy"><p>Dr. Basha is an Associate Professor at Vidyashilp University. His academic profile records work across machine learning and computer vision, including low-compute vision models and neural architecture search.</p><p>He holds a PhD from IIIT Sri City. His published research includes model compression, active learning, transfer learning and domain adaptation.</p></div></div></section>
    <section className="d6-instructor-research"><div className="d6-shell"><div className="d6-instructor-research__intro"><div><p className="d6-eyebrow d6-eyebrow--light">Research interests</p><h2>Research beyond the syllabus.</h2></div><p>These areas connect directly to the course&apos;s emphasis on models, representations, generalization and evaluation.</p></div><div className="d6-interest-list">{interests.map(([n,t,sub])=><div className="d6-interest" key={n}><span>{n}</span><strong>{t}</strong><small>{sub}</small></div>)}</div><div className="d6-instructor-research__links"><Link href="/course">DATA301 course <Icon name="arrow" size={14}/></Link><Link href={platform.instructor.portfolio} target="_blank" rel="noreferrer">Academic profile <Icon name="external" size={13}/></Link><Link href={platform.instructor.github} target="_blank" rel="noreferrer">ML Lab repository <Icon name="github" size={14}/></Link></div></div></section>
  </main>;
}
