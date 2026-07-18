# Somojit Banerjee Portfolio

Personal portfolio for Somojit Banerjee, redesigned as a modern one-page site focused on cloud security architecture, DevSecOps, multi-cloud security, vulnerability management, and policy-as-code.

[Visit the live site](https://somojitb.github.io/)

## Highlights

- New custom portfolio design replacing the older template base.
- CV-aligned content for current Cloud Security Architect / DevSecOps Engineer positioning.
- Sections for impact, focus areas, skills, experience, selected projects, credentials, and contact.
- Legacy `/projects/` and `/experience/` routes redirect into the redesigned homepage sections.
- Interactive UI built with Anime.js for subtle transitions and responsive visual feedback.

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Anime.js
- Font Awesome

## Local Preview

This is a static GitHub Pages site. Serve the repository root with any static file server, then open the local URL.

```powershell
python -m http.server 4176 --bind 127.0.0.1
```

## Verification

The redesign branch was checked with:

- `git diff --check`
- `node --check assests/js/script.js`
- HTML parsing for `index.html`, `projects/index.html`, and `experience/index.html`
- Local HTTP checks for the homepage, redirect routes, CSS, JS, and resume PDF
