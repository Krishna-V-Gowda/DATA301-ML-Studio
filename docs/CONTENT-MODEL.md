# Content Model

## Content authority

The platform distinguishes three levels of content authority.

### 1. Verified course facts

Derived directly from supplied course documents and kept in version control:

- Course code, title, program, school, semester, credits, LTP, duration, and prerequisite
- Four course outcomes
- Four modules and their scheduled lecture/practice sequence
- Course bibliography
- Supported instructor role/research information

### 2. Instructor-published semester content

Managed through the administration dashboard:

- Slides
- Notes
- Labs and notebooks
- Datasets
- Assignments
- Reference files

### 3. Educational expansion

Explanations, examples, visualizations, and practice content created to help learning. These must be academically reviewed before they are presented as instructor-approved course content.

## Relational model

```text
profiles
  id -> auth.users.id
  role: viewer | editor | admin

courses
  id
  code (unique)

modules
  course_id -> courses.id
  number / slug / position (unique within course)

sessions
  course_id -> courses.id
  module_slug
  number (1..30, unique within course)
  optional paired practice
  status
  module/session foreign-key integrity

materials
  course_id -> courses.id
  optional module_slug
  optional session_number
  storage object identity
  status and publish_at
  version and provenance
```

## Material lifecycle

```text
Draft
  | review / metadata verification
  v
Scheduled -- release time --> Publicly released
  |                       |
  | cancel                | retire
  v                       v
Draft                 Archived
```

## File metadata

A material record captures:

- Human-readable title and description
- Type
- Course placement
- Publication state and release time
- Original file name, MIME type, format, and byte size
- Private bucket/path
- Version
- Creator and timestamps
- Optional thumbnail

The file itself is stored in object storage, not in PostgreSQL.

## Versioning policy

The current implementation automatically increments the version number for the same title/type/module/session series and exposes only the latest published version in the student library. For full historical versioning, a later migration should add:

```text
material_families
material_versions
```

where the public library points to one active version and every prior object remains auditable until intentionally removed under retention policy.

## Topic document contract

A topic is not required to use every section, but should generally answer:

1. What is it?
2. Why does it exist?
3. How should it be understood intuitively?
4. How is it represented mathematically?
5. How does the algorithm operate?
6. How can it be implemented?
7. When does it work or fail?
8. What should be learned before and after it?

## Source-conflict policy

When supplied documents disagree:

- Record the conflict.
- Do not choose the most convenient value.
- Do not combine values into a new interpretation.
- Request an authoritative instructor decision.
- Publish the chosen value only after confirmation.
- Retain a note explaining the decision and source version.
