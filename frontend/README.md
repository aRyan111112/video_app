# VidStream Frontend

React + Vite frontend for the VidStream video streaming platform.

## Tech Stack

- **React 19** — UI framework
- **Vite** — Build tool & HMR dev server
- **React Router DOM v7** — Client-side routing
- **Axios** — HTTP client with interceptors
- **Tailwind CSS** — Utility-first styling
- **React Icons** — Icon library

## Pages

| Page | Route |
|---|---|
| Home | `/` |
| Watch Video | `/watch/:videoId` |
| Search | `/search` |
| Channel Profile | `/channel/:username` |
| Upload Video | `/upload` |
| Library | `/library` |
| History | `/history` |
| Liked Videos | `/liked` |
| Subscriptions | `/subscriptions` |
| Playlist | `/playlist/:playlistId` |
| Dashboard | `/dashboard` |
| Login | `/login` |
| Register | `/register` |

## Getting Started

```sh
npm install
npm run dev
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Project Structure

```
src/
├── api/          # Axios instance & base config
├── components/   # Navbar, Sidebar, VideoCard, Comments, etc.
├── context/      # AuthContext (global auth state)
├── pages/        # One file per route/page
└── main.jsx      # App entry point & router setup
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
