# Arnaud André - Software Engineer & IT project coordination

Bilingual portfolio for salaried Software Engineer and technical project management
opportunities, primarily remote. [Visit the portfolio](https://www.arnaud-a.dev/).

## Recruiter journeys

- `/`: profile, skills, experience and direct contact.
- `/projects/hr-commissions?lang=fr`: banking HR committee case study, nine months and three people.
- `/cv/full-stack?lang=fr`: Software Engineer résumé.
- `/cv/project-management?lang=fr`: technical project management résumé.
- `/cv/microsoft?lang=fr`: specialised Microsoft 365 résumé.
- Use `lang=en` for English. Each résumé has a one-page downloadable PDF.

## Architecture

React 19, TypeScript, Vite, React Router and i18next. The frontend is hosted on Azure
Static Web Apps. A separate FastAPI service connects the assistant to Azure AI Foundry.

The HR case study is defined in `src/datas/hr-case-study.ts` and reused by the portfolio,
project page and résumés. Profile translations live in `src/loc/`; verified résumé content
lives in `src/components/pages/resume/resume-data.ts`.

The case study omits unconfirmed employer/date attribution, monetary budget,
line-management claims and quantified outcomes. Historical job titles remain unchanged.

## Run and validate

Requires Node.js 22+.

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
```

Optional `.env.local`:

```dotenv
VITE_CHATBOT_API_URL=http://127.0.0.1:8010/chat
VITE_ANALYTICS_DISABLED=true
```

Without the local backend, the assistant shows its unavailable state; the portfolio remains usable.
Production endpoints are configured in the Azure Static Web Apps workflow.

## PDF updates

Six PDFs in `public/resumes/` are generated from the same data as the online résumés.
They contain selectable text and linked contacts/projects. A source fingerprint checked
before every build prevents stale downloads.

After changing résumé or case-study content:

```sh
python -m pip install reportlab
npm run pdf:generate
```

Set `PYTHON` to a specific executable if needed. Visually review the PDFs after content
or layout changes. Temporary files under `tmp/` are ignored.

## Assistant deployment

The companion `ask-arnaud-api` repository contains the V2.4 employment-positioning candidate
and updated evaluations. Frontend changes and prompt-file edits do not update the active
Foundry agent. Publish and evaluate an immutable version, then select its exact ID in the
backend deployment environment. Keep the previous version for rollback.

## Anonymous audience measurement

The dependency-free, first-party client sends only allowlisted interaction categories.
It does not send chat text, arbitrary URLs, IP addresses or persistent visitor identifiers.

```dotenv
VITE_ANALYTICS_API_URL=https://ai.arnaud-a.dev/analytics/events
VITE_ANALYTICS_DISABLED=true
```

Keep analytics disabled until the existing CNIL self-assessment is complete. Collection is
disabled on localhost/127.0.0.1, with Global Privacy Control or Do Not Track, or after a six-month
browser opt-out. `?analytics=off` opts out; `?analytics=on` reverses it. Controls are at `/privacy`.

The backend allowlist must accept `/cv/project-management`, `/projects/hr-commissions`
and `project_management_cv` before analytics is enabled for this version.
