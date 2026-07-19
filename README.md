# Somojit Banerjee Portfolio

Personal portfolio for Somojit Banerjee, focused on cloud security architecture, DevSecOps, multi-cloud security, vulnerability management, and policy-as-code.

[Visit the live site](https://somojitb.github.io/)

## Highlights

- Portrait-led responsive design with a kinetic editorial layout.
- Resume-aligned roles, dates, employers, impact metrics, tools, certifications, languages, projects, and contact details.
- Detailed career chapters covering cloud architecture, CI/CD engineering, policy-as-code, multi-cloud operations, and vulnerability management.
- A focused contact flow with an animated language panel and regional phone numbers revealed only when a visitor chooses to view them.
- WhatsApp-first contact actions that work on mobile, WhatsApp Web, and the desktop client, plus a pre-addressed Gmail compose handoff for detailed enquiries.
- Locally bundled Anime.js runtime for reliable entrance sequences, scroll reveals, counters, marquees, image parallax, timeline focus, magnetic controls, and click feedback.
- Responsive desktop and mobile navigation with reduced-motion support.
- Project and education imagery loaded progressively with descriptive alternative text.
- Legacy `/projects/` and `/experience/` routes redirect into the main portfolio sections.

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Anime.js 3.2.2
- GitHub Pages
- GitHub Actions

## Local Preview

This is a static GitHub Pages site. Serve the repository root with any static file server, then open the local URL.

```powershell
python -m http.server 4176 --bind 127.0.0.1
```

## Verification

Run the reproducible bundle build plus automated syntax, content, local asset, link, image, section, and fact-preservation checks with:

```powershell
npm test
```

The `Portfolio quality` GitHub Actions workflow runs the same checks on pushes to `main` and `polish-redesign-codex`, and on pull requests targeting `main`.
