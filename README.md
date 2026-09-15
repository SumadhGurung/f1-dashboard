# F1 Dashboard

An interactive Formula 1 dashboard built with React, Vite, and Tailwind CSS. It combines current championship standings, constructor performance, race-calendar data, an interactive world map, driver/team imagery, and estimated speed displays in one responsive interface.

## Live Project

- GitHub repository: https://github.com/SumadhGurung/f1-dashboard

## Features

- Live driver standings with championship points, wins, nationality, and team information.
- Constructor championship standings with team logos, points, wins, drivers, engine, and base location.
- Driver and team search with team filters.
- Automatic standings refresh every 30 seconds.
- Animated estimated-speed values that update during the session; these are simulated display values, not live car telemetry.
- Formula 1 race calendar with completed, current, and upcoming race statuses.
- Interactive OpenStreetMap world view with zoom, pan, route visualization, circuit markers, and hover tooltips.
- Circuit detail panels with OpenStreetMap location embeds and track layouts.
- Driver portraits and constructor/team images loaded from Wikipedia when available, with visual fallbacks.
- Loading, retry, fallback-image, and API-error states.
- Responsive layout for desktop and mobile screens.

## Technology Stack

- React 19
- JavaScript (ES modules)
- Vite
- Tailwind CSS 4 with `@tailwindcss/vite`
- Leaflet and React Leaflet for the interactive world map
- Jolpica F1 API for standings and race-calendar data
- Wikipedia REST API for driver portraits and constructor/team images
- OpenStreetMap for circuit location maps
- ESLint for code-quality checks

## Getting Started

### Prerequisites

- Node.js 20 or newer recommended
- npm

### Installation

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open the local URL shown by Vite in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server with hot reload. |
| `npm run build` | Create an optimized production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint across the project. |

## Project Structure

```text
f1_dashboard/
├── public/              # Public browser assets
├── src/
│   ├── assets/          # F1 logo and local image assets
│   ├── App.jsx          # Dashboard UI, data loading, and interactions
│   ├── index.css        # Tailwind entry point and global base styles
│   └── main.jsx         # React application entry point
├── index.html
├── package.json
├── vite.config.js       # Vite and Tailwind configuration
└── REPORT.md            # Student project documentation report
```

## Data Sources

The dashboard requests data from public services at runtime:

- Jolpica F1 API: driver standings, constructor standings, and the current race calendar.
- Wikipedia REST API: driver portraits and constructor/team images when available.
- OpenStreetMap: world-map tiles and embedded circuit location maps.
- Wikimedia Commons: optional circuit track-map images.

The application does not require local environment variables for its current configuration. Because the data is loaded from external services, the dashboard may show its retry or error state when an API is unavailable or blocks a request.

## React Concepts Demonstrated

- Reusable React components and props.
- State management with `useState`.
- Data loading, intervals, animation, and event cleanup with `useEffect`.
- Derived data with `useMemo`.
- Stable data-loading callbacks with `useCallback`.
- Conditional rendering for loading, errors, selections, and fallbacks.
- List rendering with `map()`.
- Event handling for search, filters, tabs, selections, and keyboard input.

## Deployment

The project can be deployed to Vercel or another static hosting provider using these settings:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

## Project Report

The formatted student documentation is available in [REPORT.md](REPORT.md). Add the student name, college roll number, and application screenshots before submission.

## License and Attribution

This is an educational Formula 1 dashboard project. It is not affiliated with or endorsed by Formula 1, the FIA, or any participating team. Data and map content are provided by the external services listed above and remain subject to their respective terms.
