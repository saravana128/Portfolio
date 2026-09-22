# Saravana Perumal - Markdown-Driven Portfolio

A light, static React portfolio for an AI Solution Engineer / Power Platform Engineer / Outsystems Engineer. It is intentionally small: there is no database, CMS, authentication, or API. The portfolio content and the reusable Markdown resume live in one file.

## Important source of truth

**Edit [`outputs/resume.md`](outputs/resume.md) for all visible portfolio and resume content.**

`src/main.jsx` imports that file as raw Markdown and parses it in the browser. Do not move it without also changing this import:

```js
import resume from '../outputs/resume.md?raw';
```

The app reflects saved Markdown edits immediately during development through Vite hot reload. No build step is necessary while the dev server is running.

## Content contract

The Markdown parser is deliberately lightweight, not a full Markdown renderer. Preserve this structure when editing:

```md
---
name: Your Name
role: Main portfolio title
tagline: Short hero statement
location: UAE
noticePeriod: 90 days
email: you@example.com
github: https://github.com/your-profile
linkedin: https://www.linkedin.com/in/your-profile
---

## Overview
Paragraph shown in the tinted overview panel.

## Work Experience
### Role | Company
Dates | Location
- Achievement or responsibility

## Skills
Intro text.
### Skill group
- **Technology** — explanation
```

Supported formatting:

- `## Section title` creates a portfolio section.
- `### Entry title` creates an entry within that section.
- `- Bullet` creates a bullet point.
- `[label](https://example.com)` creates a link.
- `**text**` creates bold text.
- `` `text` `` creates inline code styling.

For an entry, place a short dates/location line before its bullets. It renders as plain text at the beginning of that entry. Avoid tables, nested lists, images, block quotes, or headings deeper than `###`; they are not parsed specially.

## Existing content decisions

- Experience through April 2023 is grounded in the supplied older resume: SrInSoft Technologies, W2BI Mobile Technologies, Netlink Digital Solutions, and Quest Global.
- Inchcape Shipping Services information was provided by the portfolio owner and includes Outsystems, Power Platform, Copilot, Azure AI Foundry, port calls, surveys and inspections, and liner husbandry work.
- Bracketed text such as `[Add certification]` is a deliberate placeholder. Replace it only when the portfolio owner provides verified details.
- The GitHub and LinkedIn URLs are placeholders and must be updated before publishing.

## Local development

Prerequisite: Node.js 20.19+ or 22.12+ (required by the current Vite version).

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Production build and deployment

```bash
pnpm build
pnpm preview
```

`pnpm build` creates `dist/`, which can be deployed directly to Vercel, Netlify, GitHub Pages, or any static host. There are no runtime environment variables and no server-side requirements.

## Code map

| File | Responsibility |
| --- | --- |
| `outputs/resume.md` | Sole editable portfolio/resume content source. |
| `src/main.jsx` | Markdown frontmatter/section parser and React rendering. |
| `src/styles.css` | Bright, responsive visual design. |
| `index.html` | Vite entry HTML. |
| `package.json` | Development and build scripts. |

## Guidance for future maintainers or AI agents

1. Make content updates in `outputs/resume.md`, not JSX.
2. Preserve factual accuracy. Ask for confirmation before inventing certifications, metrics, project links, employment dates, or social-profile URLs.
3. Keep the project static and focused unless the owner asks for a feature requiring additional infrastructure.
4. When changing parsing or layout code, run `pnpm build` afterwards.
5. Maintain the accessible semantic structure: one `h1` in the hero, `h2` for entries, real anchors for links, and good contrast in the light theme.
