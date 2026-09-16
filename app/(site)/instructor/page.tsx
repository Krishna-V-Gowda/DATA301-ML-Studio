import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { platform } from '@/lib/platform';

export const metadata = {
  title: 'Course Instructor | DATA301 Machine Learning',
  description: 'Course instructor information for DATA301 Machine Learning at Vidyashilp University.',
};

export default function InstructorPage() {
  return (
    <main id="main-content" className="v51-inner-page">
      <section className="shell v51-inner-hero">
        <p className="v51-eyebrow">COURSE INSTRUCTOR</p>
        <div className="v51-instructor-hero">
          <div className="v51-instructor-identity">
            <div className="v51-initials" aria-hidden="true">SB</div>
            <div>
              <h1>Dr. Shabbeer Basha</h1>
              <p>Associate Professor · School of Engineering &amp; Technology</p>
              <p>Vidyashilp University, Bengaluru</p>
            </div>
          </div>
          <div className="v51-instructor-rule" />
          <p className="v51-instructor-intro">
            DATA301 connects rigorous Machine Learning foundations with
            interactive experimentation, implementation and evaluation.
          </p>
        </div>
      </section>

      <section className="v51-band">
        <div className="shell v51-instructor-layout">
          <div>
            <p className="v51-eyebrow">ACADEMIC BACKGROUND</p>
            <h2>Teaching grounded in research and applied practice.</h2>
          </div>
          <div className="v51-instructor-copy">
            <p>
              Dr. Basha is an Associate Professor at Vidyashilp University.
              His public academic profile also records previous academic and
              industry roles across machine learning and computer vision.
            </p>
            <p>
              He holds a PhD from IIIT Sri City. His research interests
              include Active Learning, Model Compression and Domain
              Adaptation.
            </p>
          </div>
        </div>
      </section>

      <section className="shell v51-section">
        <div className="v51-section-head">
          <div>
            <p className="v51-eyebrow">RESEARCH INTERESTS</p>
            <h2>Fields connected to the course.</h2>
          </div>
        </div>

        <div className="v51-interest-grid">
          {[
            'Machine Learning',
            'Computer Vision',
            'Deep Learning',
            'Transfer Learning',
            'Neural Network Compression',
            'Neural Architecture Search',
          ].map((item) => (
            <div className="v51-interest" key={item}>
              {item}
            </div>
          ))}
        </div>

        <div className="v51-instructor-actions">
          <Link className="v51-button v51-button--secondary" href="/labs">
            Explore DATA301
            <Icon name="arrow" size={17} />
          </Link>
          <a
            className="v51-text-link"
            href={platform.instructor.github}
            target="_blank"
            rel="noreferrer"
          >
            External academic resources <Icon name="external" size={15} />
          </a>
        </div>
      </section>
    </main>
  );
}
