import Link from 'next/link';
import { labs } from '@/lib/labs-data';
import { Icon } from '@/components/ui/Icon';

export const metadata = { title: 'Laboratories', description: 'Twelve interactive DATA301 machine learning laboratories.' };

const groups = [
  { title: 'Regression & optimization', labIds: ['linear-regression','gradient-descent','overfitting'] },
  { title: 'Classification & evaluation', labIds: ['knn','confusion-matrix','logistic-regression','decision-tree','svm','roc-pr'] },
  { title: 'Structure & representation', labIds: ['kmeans','pca','ensemble'] },
];

function LabVisual({ index }: { index: number }) {
  const paths = [
    'M15 67 C55 58 85 46 120 36 C155 27 181 21 220 12',
    'M15 51 C50 36 81 29 115 31 C154 34 178 23 220 17',
    'M16 64 C59 64 77 36 111 50 C142 64 175 31 220 25',
    'M15 29 C49 31 68 58 102 52 C140 46 170 30 220 46',
  ];
  const p = paths[index % paths.length];
  return <svg viewBox="0 0 236 78" aria-hidden="true"><g stroke="rgba(19,32,42,.13)" strokeWidth="1"><path d="M18 8V70M68 8V70M118 8V70M168 8V70M218 8V70"/><path d="M8 20H228M8 44H228M8 68H228"/></g><path d={p} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/><circle cx="68" cy="39" r="4" fill="currentColor"/><circle cx="126" cy="31" r="4" fill="currentColor"/></svg>;
}

export default function LabsPage() {
  return <main id="main-content" className="d6-page d6-labs">
    <section className="d6-labs-hero"><div className="d6-shell d6-labs-hero__grid"><div><p className="d6-eyebrow d6-eyebrow--light">DATA301 interactive laboratory</p><h1>Change one thing.<em>Watch the model respond.</em></h1><p className="d6-labs-hero__lede">Twelve focused experiments make geometry, parameters, uncertainty, error and generalization inspectable. The point is not animation; it is explanation after the control changes.</p><div className="d6-labs-hero__stats"><span>12 live laboratories</span><span>4 course modules</span><span>1 connected sequence</span></div></div><div className="d6-lab-instrument"><div className="d6-lab-instrument__head"><span>LABORATORY FIELD</span><strong>12 LIVE</strong></div><div className="d6-lab-instrument__plot"><svg viewBox="0 0 720 360" role="img" aria-label="Illustrative interactive machine learning experiment"><g stroke="rgba(255,255,255,.12)" strokeWidth="1"><path d="M45 25V330M150 25V330M255 25V330M360 25V330M465 25V330M570 25V330M675 25V330"/><path d="M20 70H700M20 145H700M20 220H700M20 295H700"/></g><path d="M38 280 C128 265 188 247 257 222 C338 194 415 164 500 128 C577 96 625 66 681 36" fill="none" stroke="#77aee3" strokeWidth="7"/><path d="M38 298 C128 280 188 265 257 241 C338 211 415 181 500 145 C577 113 625 83 681 53" fill="none" stroke="#e6a158" strokeWidth="2" strokeDasharray="8 9"/><g fill="#f5f2e9">{[[110,256],[176,243],[238,226],[298,208],[357,184],[417,166],[482,139],[542,112],[608,79]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="7"/>)}</g><g fill="#b51e3b">{[[128,188],[189,172],[253,155],[317,137],[378,116],[444,97],[511,77],[576,60],[642,44]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="7"/>)}</g></svg></div><div className="d6-lab-instrument__note"><span>Experiment grammar</span><strong>Manipulate → observe → explain → implement</strong></div></div></div></section>

    <section className="d6-lab-directory"><div className="d6-shell">{groups.map((group,groupIndex)=>{const groupLabs=group.labIds.map((id)=>labs.find((lab)=>lab.id===id)).filter((lab): lab is (typeof labs)[number] => Boolean(lab)); return <section className="d6-lab-family" key={group.title}><div className="d6-lab-family__head"><span className="d6-number">0{groupIndex+1}</span><div><p className="d6-eyebrow">Laboratory family</p><h2>{group.title}</h2></div><p>{groupLabs.length} laboratories</p></div><div className="d6-lab-grid-full">{groupLabs.map((lab,index)=><Link className="d6-lab-item" href={lab.href} key={lab.id}><div className="d6-lab-item__top"><span className="d6-lab-item__num">{lab.index}</span><span className="d6-lab-item__state">Live</span></div><div className="d6-lab-item__visual" style={{color:lab.accent==='cobalt'?'#1f5cb6':lab.accent==='violet'?'#8c5a4d':lab.accent==='teal'?'#4e8f79':'#e6a158'}}><LabVisual index={index+groupIndex}/></div><h3>{lab.title}</h3><p>{lab.description}</p><div className="d6-lab-item__tags">{lab.tags.map((tag)=><span key={tag}>{tag}</span>)}</div></Link>)}</div></section>})}</div></section>

    <section className="d6-labs-close"><div className="d6-shell d6-labs-close__grid"><div><p className="d6-eyebrow">Course connection</p><h2>From experiment to implementation.</h2><p>Open a lab, change the control, inspect the response, and carry the explanation into code. Each experiment connects the concept to implementation.</p></div><Link className="d6-button d6-button--dark" href="/learn">Return to the learning atlas <Icon name="arrow" size={15}/></Link></div></section>
  </main>;
}
