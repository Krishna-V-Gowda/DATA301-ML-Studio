# Attribution and ownership model

This document records the operational boundary between the course, the platform, and linked repositories. It is not a legal opinion and does not replace applicable university, employment, or intellectual-property agreements.

## 1. Course identity

The production website is a DATA301 Machine Learning course environment for Vidyashilp University. Course instruction and supplied academic material are attributed to Dr. Shabbeer Basha and the university.

## 2. Platform authorship

The platform’s product architecture, interface, interactive Labs, custom browser-side Machine Learning implementations, backend integration, test suite, and release system are credited to Krishna V Gowda.

Public credit is intentionally understated:

- a footer line: **Platform design & development · Krishna V Gowda**;
- an About/Credits section;
- repository authorship and Git history;
- metadata `creator`/`authors` fields.

This credit does not claim authorship of the course or instructor-authored presentations.

## 3. Canonical software repository

`Krishna-V-Gowda/DATA301-ML-Studio` is the canonical software source. It contains the platform code and migrations, but not live credentials or private course binaries.

## 4. Instructor repository

`shabbeersh/ML_lab` remains an independent instructor repository for Python/Jupyter environment setup and course-practice material. The course website links to it as a continuation from interactive intuition to implementation.

The repositories are not merged. Linking does not transfer the interactive Labs, source ownership, commit history, credentials, or repository control.

## 5. Content administration versus code control

An instructor `admin` account permits course-content administration inside the application: materials, sessions, publication states, and private resources. It does not grant GitHub, Vercel, Supabase-owner, or source-repository credentials.

## 6. Private academic material

Presentation binaries, the detailed Course Plan, and future course files are held in private Supabase Storage and are seeded from a release-only folder. Public materials are delivered through short-lived signed URLs. Staff-only materials require an authenticated staff session.

## 7. Portfolio representation

A defensible portfolio description is:

> Designed and developed a production interactive Machine Learning learning platform adopted for a university course, including 12 browser-based laboratories, structured course content, authenticated content administration, and private resource delivery.

Portfolio material should distinguish platform engineering from instructor-authored course content.
