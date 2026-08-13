# Netflix (MERN + TMDB)

React + Node/Express + MongoDB Netflix-style app with login/signup and trailer playback using real movie data from TMDB.

## Folder structure
```
netflix/
  netflix-backend/     -> Express + MongoDB + JWT auth API
  netflix-frontend/    -> React (Vite) app
```

## 1. Backend setup

```
cd netflix-backend
npm install
```

Rename `.env.example` to `.env` and fill in:
```
MONGO_URI=mongodb://127.0.0.1:27017/netflix
JWT_SECRET=any_random_long_string
PORT=5050
````

Make sure MongoDB is running locally (or use a MongoDB Atlas connection string instead).

Run backend:
```
npm run dev
```
Backend runs on the first free port starting from the value in `PORT` or `5000`.
If that port changes, point `VITE_BACKEND_URL` in the frontend `.env` to the printed backend URL.

## 2. Frontend setup

```
cd frontend
npm install
```cd 

Rename `.env.example` to `.env` and fill in:
```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_BACKEND_URL=http://localhost:5050
```

Get a free TMDB API key here: https://www.themoviedb.org/settings/api
(Sign up -> Settings -> API -> Request API Key -> choose "Developer")

Run frontend:
```
npm run dev
```
Frontend runs at http://localhost:5173

## How it works

- Signup/Login -> saved in MongoDB (password hashed with bcrypt), JWT token stored in localStorage
- Home page is protected -> redirects to /login if not logged in
- Movie rows (Trending, Action, Comedy, etc.) fetched live from TMDB API
- Click any poster (or the banner's Play button) -> navigates to that title's own page:
  `/title/movie/123` or `/title/tv/123`
  - Shows a backdrop with a Play button -> click to load the YouTube trailer inline
  - Shows title, year, rating, runtime/seasons, overview and genres
  - "More Like This" row at the bottom, powered by TMDB's recommendations API
  - Clicking a recommended poster navigates to THAT title's page (so you can keep
    browsing title -> title, same as real Netflix), and the Back button goes to
    whichever page you came from
- Navbar shows logged-in user's name + Logout button

## Notes
- This is a learning/portfolio clone - not affiliated with Netflix. Do not deploy publicly using Netflix branding/name.
- Styling is plain CSS (no Tailwind/UI library), kept simple and commented for readability.
- To add real video playback of actual movies (not just trailers), you'd need licensed video content and a paid CDN - trailers via TMDB/YouTube is the standard approach for clone projects.
