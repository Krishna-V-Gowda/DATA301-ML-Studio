# Production Release Checklist

## Course and academic review

- [ ] Instructor confirms course title, code, semester, prerequisite, and module sequence.
- [ ] Instructor resolves the assessment-weight conflict recorded in `/admin/review`.
- [ ] Every topic page has been checked for terminology, formulae, and algorithm correctness.
- [ ] Every code sample has been executed against its declared package version.
- [ ] Every visualization represents the intended mathematical behaviour.
- [ ] Instructor-specific statements are supported by supplied/verified material.
- [ ] Third-party references, images, books, and embedded links have been reviewed for redistribution rights.

## Backend

- [ ] `supabase/schema.sql` executed without error.
- [ ] Admin user created and promoted.
- [ ] Editor user tested separately.
- [ ] RLS verified with anon, viewer, editor, and admin sessions.
- [ ] Storage bucket is private.
- [ ] Scheduled publication tested before, at, and after release time across the `Asia/Kolkata` operational timezone.
- [ ] Upload failure compensation tested.
- [ ] Signed URLs expire and do not reveal service credentials.

## Application

- [ ] `npm run typecheck` succeeds.
- [ ] `npm run test` succeeds.
- [ ] `npm run build` succeeds.
- [ ] No secret is present in the client build.
- [ ] 404 and backend-not-configured states are understandable.
- [ ] Search returns related concepts for false positives, dimensionality, scaling, and regression.
- [ ] All 30 lecture sessions and paired two-hour practice sessions appear in the correct order.

## Responsive QA

- [ ] 1440 px
- [ ] 1280 px
- [ ] 1024 px
- [ ] 768 px
- [ ] 430 px
- [ ] 390 px
- [ ] 375 px

At each width verify navigation, equations, code, resource cards, admin tables, modals, and interactive charts.

## Accessibility

- [ ] Complete keyboard-only navigation.
- [ ] Visible focus states.
- [ ] Skip link works.
- [ ] Navigation landmarks and headings are logical.
- [ ] Form errors are announced.
- [ ] Contrast meets WCAG 2.2 AA.
- [ ] Reduced-motion mode remains understandable.
- [ ] Interactive SVGs have meaningful labels and text alternatives.
- [ ] Mobile touch targets are comfortably usable.

## Performance

- [ ] Home route meets agreed Core Web Vitals targets on representative student devices.
- [ ] Course documents are not preloaded unnecessarily.
- [ ] Large slide/PDF previews use optimized thumbnails.
- [ ] Interactive labs do not load on unrelated pages.
- [ ] Fonts and images do not cause disruptive layout shift.

## Operations

- [ ] Production URL registered in Supabase Auth redirect configuration.
- [ ] Environment variables configured in Vercel production and preview environments.
- [ ] Domain, TLS, sitemap, robots, and Open Graph preview verified.
- [ ] Responsible owner identified for weekly content publishing.
- [ ] Backup/restore and incident-response owner identified.
- [ ] A student and a faculty reviewer complete acceptance testing.
