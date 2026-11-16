# Teen Cabs

Teen Cabs is a responsive landing page for a supervised ride platform built for teens and their families. It presents the product story, safety approach, ride experience, team, contact details, and beta waitlist.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- GSAP and Motion for animation
- Lucide React for icons

## Getting started

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Start the development server:

```bash
npm run dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run the TypeScript compiler without emitting files |
| `npm run clean` | Remove generated build and server files |

## Project structure

- `src/components/` — page sections and reusable UI components
- `src/data/` — navigation, product, journey, and team content
- `src/assets/images/` — product imagery used by the app
- `assets/` — team portrait assets
- `public/assets/` — public media assets

## Validation

Run the type check and production build before submitting changes:

```bash
npm run lint
npm run build
```
