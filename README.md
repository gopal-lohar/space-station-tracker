# 🛰️ Space Station Tracker

## In Development
The project is currently in active development.

## Overview

**Space Station Tracker** is a web application that helps you spot the International Space Station (ISS) from your location.

Did you know the International Space Station is visible to the naked eye? It appears as a bright, fast-moving star crossing the night sky. However, visibility depends on specific conditions:

- Time of day (typically at dawn or dusk)
- Your location
- Weather conditions
- The ISS's orbital position

The ISS is only visible when sunlight reflects off its surface while the observer is in relative darkness. These visibility windows typically last just a few minutes.

This application aims to:
1. Calculate when the ISS will be visible from your specific location
2. Send notifications before visibility events
3. Provide additional information about the space station and its current mission
4. Provide similar information about The Chinese Space Station (Tiangong)
5. Display the trajectory as a path across a map of your local sky

## Project Architecture

The project consists of three main components:

### 1. Core Module (`/core`)
- Node.js application written in TypeScript
- Handles orbital calculations and visibility predictions
- Manages TLE (Two-Line Element) data retrieval and processing
- Entry points:
  - `src/index.ts`: Main application for calculating ISS visibility times
  - `src/updateData.ts`: Script for fetching and updating TLE data in `core/data/norad-{satelliteId}.json`
- Calculation logic stored in `core/src/ganit/` directory

### 2. Backend Server (Planned)
- Will serve as an API layer between the core calculation module and frontend
- Will handle location data, and notification preferences
- Will cache calculation results to improve performance
- Will cache the TLE's for ISS and other satellites

### 3. Frontend Application (Planned)
- React-based web application
- Interactive sky map showing the ISS's path
- User location management and notification settings
- Mobile-responsive design

## Technical Resources

### Orbital Mechanics & TLE Format
- [Demystifying the USSPACECOM Two-Line Element Set Format](https://keeptrack.space/deep-dive/two-line-element-set/) - Comprehensive explanation of TLE format
- [Computers and Satellites](https://celestrak.org/columns/) - Primary resource for orbital calculation mathematics

### APIs
- [NASA's TLE API](http://tle.ivanstanojevic.me/api/tle) - Provides up-to-date TLE data for the ISS
- [Additional NASA APIs](https://api.nasa.gov/) - Other potential data sources for the project

## Current Status

The project is in development, with the core calculation module as the primary focus. Current work includes:
- Creating a data refresh strategy based on TLE update frequency
- Figure out how often the TLE api updates
- Implementing orbital propagation algorithms
- Building the cli app for getting ISS passes
- Building test fixtures for validation against known ISS passes

## Installation & Development

### Prerequisites
- Node.js
- npm

### Setup
```bash
# Clone the repository
git clone https://github.com/gopal-lohar/space-station-tracker

# Install dependencies for core module
cd space-station-tracker/core
npm install

# Run development version
npm run dev

# Update TLE data
npm run update-data
```

## Roadmap

- [x] TLE data retrieval mechanism
- [x] Look Angle Calculation
- [x] Sun Calculation and Testing
- [x] Look Angle cacluation testing
- [ ] Is Illuminated calculation
- [ ] Is Illuminated calculation testing
- [ ] Complete visibility prediction algorithm
- [ ] visibility prediction testing
- [ ] Write Tests and actually verify the working against known ISS passes
- [ ] Backend API development
- [ ] Frontend application development
- [ ] User notification system
- [ ] Sky map visualization (MAYBE)

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.