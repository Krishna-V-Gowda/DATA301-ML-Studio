export type Difficulty = 'Foundation' | 'Intermediate' | 'Advanced';
export type PublicationStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type SessionStatus = 'planned' | 'ready' | 'published' | 'completed';
export type MaterialKind =
  | 'course-outline'
  | 'course-plan'
  | 'slides'
  | 'notes'
  | 'lab'
  | 'dataset'
  | 'assignment'
  | 'reference';

export type CourseOutcome = {
  code: string;
  description: string;
  level: string;
};

export type PracticeSession = {
  code: string;
  title: string;
};

export type LectureSession = {
  number: number;
  title: string;
  practice?: PracticeSession;
};

export type CourseModule = {
  number: number;
  slug: string;
  title: string;
  shortTitle: string;
  level: Difficulty;
  lectureSessions: number;
  practiceSessions: number;
  lectureHours: number;
  practiceHours: number;
  takeaway: string;
  outcomes: string[];
  description: string;
  topics: string[];
  lectures: LectureSession[];
  accent: string;
};

export type Material = {
  id: string;
  title: string;
  description: string;
  kind: MaterialKind;
  moduleSlug?: string;
  sessionNumber?: number;
  href: string;
  fileName: string;
  format: string;
  sizeLabel: string;
  status: PublicationStatus;
  publishedAt?: string;
  version: number;
  thumbnail?: string;
};

export type TopicSection = {
  id: string;
  title: string;
  body: string[];
  formula?: string;
  code?: string;
  callout?: string;
};

export type Topic = {
  slug: string;
  title: string;
  eyebrow: string;
  oneLine: string;
  summary: string;
  difficulty: Difficulty;
  moduleSlug: string;
  estimatedMinutes: number;
  prerequisites: string[];
  learnNext: string[];
  related: string[];
  tags: string[];
  sections: TopicSection[];
  labHref?: string;
  sourceNote: string;
};
