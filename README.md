# Somojit Banerjee Portfolio

Personal portfolio for Somojit Banerjee, focused on cloud security architecture, DevSecOps, multi-cloud security, vulnerability management, and policy-as-code.

[Visit the live site](https://somojitb.github.io/)

## Highlights

- Portrait-led responsive design with a kinetic editorial layout.
- Resume-aligned roles, dates, employers, impact metrics, tools, education, certifications, languages, projects, and contact details.
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

Run the automated syntax, content, local asset, link, image, and fact-preservation checks with:

```powershell
npm test
```

The `Portfolio quality` GitHub Actions workflow runs the same checks on pushes to `main` and `polish-redesign-codex`, and on pull requests targeting `main`.
