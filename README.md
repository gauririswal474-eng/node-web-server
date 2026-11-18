# Task 31 - Creating a Simple Web Server with Node.js

A basic web server built with the Node.js `http` module. It serves different HTML pages for different routes and shows a custom 404 page for unknown routes. No npm packages are needed.

## Run
```bash
node server.js
```
Open http://localhost:3000 (set another port with `PORT=4000 node server.js`). Needs Node.js 18 or newer.

## Routes
| Route | Response |
|-------|----------|
| `/` | redirects (302) to `/home` |
| `/home` | Home page (200) |
| `/about` | About page (200) |
| `/contact` | Contact page (200) |
| `/services` | Extra route - services (200) |
| `/pricing` | Extra route - pricing table (200) |
| `/css/style.css` | Stylesheet (200) |
| anything else | Custom 404 page (404) |
| non GET/HEAD request | 405 Method Not Allowed |

## Project structure
```
server.js            creates the server and listens on the port
src/router.js        routing, status codes, 404 handling
src/pageLoader.js    async file reading (fs/promises), content types, path safety
public/pages/        home, about, contact, services, pricing, 404 (HTML)
public/css/style.css styling for all pages
screenshots/         browser screenshots of each route
test-log.txt         curl test results (status codes)
server-log.txt       server console log of the requests
```

## How it works
- Files are read asynchronously with `fs/promises`.
- The code is split into small modules (server, router, page loader).
- Errors are caught so one bad request never crashes the server (500 page as last fallback).
- Paths are checked so nobody can read files outside the `public` folder.

## Deploy (Render)
1. Push this folder to a GitHub repository.
2. On render.com create a **Web Service** from the repo.
3. Build command: leave empty (or `npm install`). Start command: `npm start`.
4. Render sets the `PORT` itself, the server already reads it. Use the live URL, for example `https://your-app.onrender.com/home`.
