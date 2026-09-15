# React Project Report

## Student Project Documentation

| Field | Details |
|---|---|
| Student Name | **[Enter your name]** |
| College Roll Number | **[Enter your roll number]** |
| GitHub Profile | **https://github.com/SumadhGurung** |
| GitHub Repository | **https://github.com/SumadhGurung/f1-dashboard** |
| Project Title | **F1 Dashboard** |
| Technology Used | React, JavaScript, Tailwind CSS, Vite, Leaflet, REST APIs |

## 1. Project Title

**F1 Dashboard: Formula 1 Live Standings and Race Calendar**

## 2. Objective of the Project

The objective of this project is to provide a clear and interactive dashboard for exploring Formula 1 championship information in one place. The application retrieves current driver standings, constructor standings, and race-calendar data through public APIs and presents it in a visually organized interface.

The project addresses the difficulty of viewing driver rankings, team performance, race locations, and live-style telemetry information across separate sources. It was chosen because Formula 1 produces structured, frequently changing data that is well suited to a React dashboard with reusable components and interactive controls.

The intended users are Formula 1 fans, students learning frontend development, and anyone who wants a quick overview of the current season. The main features include live standings, team filtering, driver search, constructor rankings, race-calendar mapping, circuit details, driver and team detail panels, automatic data refresh, and animated telemetry values.

## 3. Methodology

The project was developed as a single-page React application using reusable UI components and asynchronous API calls. Data is fetched from the Jolpica F1 API, transformed into display-friendly objects, and then rendered through dashboard sections. Wikipedia REST API data is used to retrieve optional driver portraits and constructor logos, while Leaflet and OpenStreetMap provide the interactive world circuit map and local circuit map locations.

### 3.1 Technologies Used

- **React** - For building the component-based user interface.
- **JavaScript** - For application logic, data transformation, filtering, and interaction handling.
- **Tailwind CSS** - For the responsive dashboard layout, spacing, typography, colors, and component styling.
- **Vite** - For development, module bundling, and production builds.
- **Jolpica F1 API** - For current driver standings, constructor standings, and race-calendar data.
- **Leaflet and React Leaflet** - For the interactive world map, zoom controls, route line, and circuit markers.
- **OpenStreetMap** - For world-map tiles and embedded circuit location maps.
- **Wikipedia REST API** - For driver portraits and constructor/team images when available.
- **Git and GitHub** - For version control and project submission.

> Tailwind CSS is integrated through the official Vite plugin and is used for the dashboard shell, header, live indicator, and summary-card utilities. Leaflet supplies the interactive world map while a small set of component rules remains in `App.jsx` for specialized table and circuit-detail styling.

### 3.2 Development Process

1. Planned the dashboard requirements and identified the main Formula 1 data views.
2. Created the React project with Vite.
3. Designed the dashboard structure for standings, teams, race calendar, and detail views.
4. Implemented reusable React components such as driver avatars, team logos, standings rows, and detail panels.
5. Connected the application to the Jolpica F1 API and additional external data services.
6. Added data transformation, search, filtering, sorting, selection, and refresh functionality.
7. Added responsive styling, loading states, error handling, animations, and keyboard interaction.
8. Tested the application by running the development build and production build commands.
9. Prepared the project for GitHub submission.

### 3.3 React Concepts Used

- **Components** - The interface is divided into reusable components such as `DriverAvatar`, `TeamLogo`, and dashboard sections.
- **Props** - Components receive data and configuration such as driver information, team information, and display sizes.
- **State with `useState`** - Used for standings data, loading and error states, selected items, tabs, search text, filters, and animation state.
- **Effects with `useEffect`** - Used for initial data loading, automatic refresh intervals, telemetry updates, pulse animation, and keyboard event cleanup.
- **Event Handling** - Used for search input, team selection, tab changes, driver selection, circuit selection, retry actions, and keyboard events.
- **Conditional Rendering** - Used for loading screens, error screens, selected detail panels, fallback avatars, and optional images.
- **Lists and `map()`** - Used to render drivers, constructors, races, teams, and Leaflet map markers.
- **API / Fetch** - Used to retrieve live standings, constructor data, race-calendar data, and Wikipedia images.
- **Memoization with `useMemo`** - Used for filtered drivers, sorted constructors, team options, and summary statistics.
- **Callback memoization with `useCallback`** - Used for the standings loading function.
- **Strict Mode** - Used in `main.jsx` while mounting the application.

The project does not currently use React Router or a traditional form-submission workflow.

## 4. Project Features

1. Current Formula 1 driver standings with portraits, points, wins, position, nationality, and team information.
2. Constructor standings with team logos, points, wins, engine, base location, and driver details.
3. Search and team-filter controls for quickly finding drivers.
4. Race-calendar view with completed, current, and upcoming race statuses.
5. Interactive Leaflet world map with zoom, pan, route visualization, circuit markers, and hover tooltips.
6. Circuit detail panels with track maps and location information.
7. Driver and constructor detail panels with external images and metadata fallbacks.
8. Automatic standings refresh and animated estimated-speed values.
9. Loading, retry, fallback-image, and API-error states.
10. Responsive layout with keyboard Escape handling for closing selected detail views.

## 5. Result

The completed application provides an interactive Formula 1 information dashboard that combines live data retrieval with a responsive React interface. The main views show championship statistics, driver and team rankings, and the season race calendar.

### Screenshot 1 - Driver Standings Dashboard

**Description:** The main dashboard showing the current season summary cards, driver standings, search controls, team filter, and live-style status indicator.

**Insert Screenshot Here**

### Screenshot 2 - Constructor Standings and Team Details

**Description:** The constructor standings view showing team rankings, points, wins, engine information, and the selected constructor detail panel.

**Insert Screenshot Here**

### Screenshot 3 - Race Calendar and Circuit Details

**Description:** The race-calendar view showing race locations, race status, circuit selection, track information, and the selected circuit map.

**Insert Screenshot Here**

## 6. GitHub Repository

**GitHub Profile:** https://github.com/SumadhGurung

**GitHub Repository:** https://github.com/SumadhGurung/f1-dashboard

The repository should contain the complete React project source code, including `package.json`, the `src` directory, public assets, configuration files, and this report.

Before submission, verify that:

- The repository is accessible.
- The project runs successfully with `npm install` followed by `npm run dev`.
- `package.json` is included.
- The React source code is included.
- The styling files and assets are included.
- The GitHub profile and repository links are correct.

## 7. Conclusion

Developing the F1 Dashboard provided practical experience with React component design, state management, effects, asynchronous API requests, conditional rendering, list rendering, and user interaction. The project also demonstrated how external data can be transformed into a useful visual dashboard.

The main challenge was coordinating multiple asynchronous data sources while keeping the interface responsive and understandable. This was handled by separating data-loading functions, adding loading and error states, using fallback content for unavailable images, and preserving selected items when refreshed data arrives. Another challenge was presenting a large amount of information without making the dashboard difficult to scan, which was addressed through summary cards, tabs, filters, detail panels, responsive layouts, and clear visual hierarchy.

The project uses Tailwind CSS for its primary layout and dashboard styling. Leaflet and OpenStreetMap provide the actual interactive world map, while small component-specific rules support the data tables, Leaflet controls, and circuit-detail presentation. External portraits and team images use fallback initials or monograms when a source image is unavailable.

## 8. Submission Requirements Checklist

- [x] Project is developed using React.
- [x] Tailwind CSS is installed and used for the dashboard styling.
- [x] Project is uploaded to GitHub.
- [x] GitHub profile link is provided.
- [x] GitHub repository link is provided.
- [ ] College roll number is provided.
- [x] Project title is provided.
- [x] Objective is explained.
- [x] Methodology is explained.
- [x] Major features are listed.
- [ ] Two or three screenshots are included.
- [x] Conclusion is included.
- [x] Project runs without major errors.
