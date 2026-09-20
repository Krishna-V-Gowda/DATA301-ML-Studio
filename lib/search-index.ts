import { modules } from './course-data.ts';
import { topics } from './topic-data.ts';
import { labs } from './labs-data.ts';
import { projectBriefs } from './project-data.ts';
import type { Material } from './types.ts';

export type SearchDocument = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: 'Topic' | 'Module' | 'Lab' | 'Material' | 'Project';
  keywords: string[];
};

const labDocuments: SearchDocument[] = labs.map((lab) => ({
  id: `lab-${lab.id}`,
  title: lab.title,
  description: lab.description,
  href: lab.href,
  type: 'Lab' as const,
  keywords: [...lab.tags, ...lab.keywords],
}));

const coreDocuments: SearchDocument[] = [
  ...topics.map((topic) => ({
    id: `topic-${topic.slug}`,
    title: topic.title,
    description: topic.oneLine,
    href: `/topics/${topic.slug}`,
    type: 'Topic' as const,
    keywords: [...topic.tags, ...topic.related, ...topic.learnNext],
  })),
  ...modules.map((module) => ({
    id: `module-${module.slug}`,
    title: `Module ${module.number}: ${module.shortTitle}`,
    description: module.description,
    href: `/learn/module/${module.slug}`,
    type: 'Module' as const,
    keywords: module.topics,
  })),
  ...labDocuments,
  ...projectBriefs.map((project) => ({
    id: `project-${project.slug}`,
    title: project.title,
    description: project.objective,
    href: `/projects/${project.slug}`,
    type: 'Project' as const,
    keywords: [project.level, project.concepts, project.output],
  })),
];

export function buildSearchDocuments(materials: Material[] = []): SearchDocument[] {
  return [
    ...coreDocuments,
    ...materials.map((material) => ({
      id: `material-${material.id}`,
      title: material.title,
      description: material.description,
      href: material.href,
      type: 'Material' as const,
      keywords: [material.kind, material.format, material.fileName, material.moduleSlug ?? '', material.sessionNumber ? `lecture ${material.sessionNumber}` : ''],
    })),
  ];
}
