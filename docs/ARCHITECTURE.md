# Technical Architecture

## 1. System boundary

The platform has two explicit product surfaces:

1. **Student surface** — public learning content, roadmap, labs, projects, search, and released resources.
2. **Instructor surface** — authenticated administration for semester-by-semester publishing.

The student experience must remain fast even when the administration service is temporarily unavailable. Verified course structure and core lessons therefore ship with the application, while time-sensitive semester materials are read from Supabase.

## 2. Architecture diagram

```text
Student browser
   |
   | HTTPS
   v
Next.js on Vercel
   |-- Static/server-rendered lessons and module pages
   |-- Browser-side interactive ML labs
   |-- Public metadata query
   |-- Signed-download API route
   |
   +-----------------------+
                           |
Instructor browser        |
   |                      |
   | Authenticated HTTPS  |
   v                      v
Next.js admin routes --> Supabase Auth
                       --> PostgreSQL + RLS
                       --> Private Storage
```

## 3. Rendering strategy

- Homepage, roadmap, modules, topics, projects, and core labs are suitable for static or server rendering.
- Browser-only interactivity is isolated in client components.
- Administrative pages are server protected and read staff identity before rendering.
- Large files are never passed through a Server Action. The authenticated browser uploads directly to the private Supabase bucket, and then writes validated metadata.
- Student downloads pass through `/api/materials/[id]`, which verifies effective publication (immediate or matured scheduled release) and returns a 90-second signed object URL.

## 4. Domain layers

### Course domain

`lib/course-data.ts` is the verified initial course map: code, duration, outcomes, modules, lectures, practice pairings, references, and initial assets.

### Educational content

`lib/topic-data.ts` provides reusable topic documents. Each topic can contain:

- One-line intuition
- Summary and learning position
- Progressive sections
- Mathematical formulae
- Python implementation
- Callouts
- Prerequisites, related ideas, and next steps
- Optional interactive-lab link
- Explicit provenance note

### Interactive computation

`lib/ml` contains framework-independent algorithms used by browser labs and tests:

- Ordinary least-squares fit and MSE
- K-nearest-neighbour voting
- K-means assignment and centroid update
- Classification metrics

The UI does not duplicate those calculations.

### Persistence

Supabase stores operational content, not the whole frontend:

- Staff profile and role
- Course/module/session state
- Material metadata, validated course/module/session placement, versions, and publication state
- Private binary objects

## 5. Why PostgreSQL/Supabase instead of MongoDB

This product has stable relationships:

```text
Course -> Module -> Session -> Material
```

It also needs role-based access, transactional metadata, filtered publication queries, scheduling, and strong row-level authorization. A relational model is the simpler default. Supabase additionally combines Auth and object storage with PostgreSQL, reducing integration surface.

MongoDB would remain viable for highly irregular user-generated lesson documents, but it would require separate decisions for authentication, object storage, and authorization. The current requirements do not justify that added surface.

## 6. Content evolution

### Phase A — current repository

- Four reference modules
- Thirty lecture sessions
- Eleven rich concept pages
- Four interactive labs
- Author-created public fallback resources
- Instructor publication workflow

### Phase B — semester progression

- Add notes/slides after each class
- Add assignments, datasets, and lab notebooks
- Publish more concept pages from the official schedule
- Introduce practice questions and instructor-approved solutions

### Phase C — advanced learning layer

- SVM, PCA, decision-tree, gradient-descent, overfitting, ROC/PR, and ensemble labs
- Progress persistence for opted-in students
- Semantic content search
- Dataset explorer and algorithm comparison lab

Phase C should not be started until Phase A is academically reviewed and used by real students.

## 7. Failure modes and graceful behaviour

| Failure | Behaviour |
|---|---|
| Supabase is not configured | Public verified fallback site remains usable; login shows setup instructions |
| Storage upload fails | No metadata record is created |
| Metadata insert fails after upload | Uploaded object is removed as compensation |
| Scheduled material is requested early | API returns not found; it becomes available automatically at `publish_at` |
| Unauthenticated admin request | Redirect to login with safe `next` target |
| Staff profile lacks role | Session is signed out/refused |
| Conflicting source information | Item is placed in review queue rather than guessed |

## 8. Accessibility and performance

- Semantic navigation and headings
- Keyboard-visible focus
- Skip link
- Reduced-motion support
- Touch-sized controls
- Responsive charts and scroll-safe code/math
- No animation needed to understand core content
- Browser-side labs use small deterministic datasets
- Images and large documents are separated from route code
