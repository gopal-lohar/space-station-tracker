# Space Station Tracker (in Development)

## Overview
Did you know we can see the International Space Station with the naked eye?

Yes we can, but not always, it needs to meet precise conditions such as the right time and location (It's visible for a few minutes only). This project aims to make a web application that allows users to know when the International Space Station will be visible from their location. further providing a simple disk like map of sky with the ISS's position as a line.

## Resources
- [Demystifying the USSPACECOM Two-Line Element Set Format](https://keeptrack.space/deep-dive/two-line-element-set/) - Basics of Two-Line Element Set Format
- [NASA's TLE API](http://tle.ivanstanojevic.me/api/tle)
- [Other API's from NASA](https://api.nasa.gov/)
- [Computers and Satellites](https://celestrak.org/columns/)
- [Computers and Satellites](https://celestrak.org/columns/) - This is the primary source for understanding the mathematics behind the calculations.

## Status
Currently the repository consist of a single directory `core`, it is a node.js (typescript) application and it will be the one which will be responsible for the core calculations.

## Plan
There will be a react app and a backend server. the server will use the core application to calculate the ISS's position and provide it to the react app.