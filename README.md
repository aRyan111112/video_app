# 🎬 VidStream

A full-stack YouTube-inspired video streaming platform built with React and Node.js.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![Tech Stack](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Cloudinary-Media_Storage-3448C5?logo=cloudinary&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Redis-Caching-DC382D?logo=redis&logoColor=white)

---

## ✨ Features

- 🔐 **Authentication** — Register, login, logout with JWT access & refresh tokens
- 🎥 **Video Management** — Upload, stream, edit, delete, publish/unpublish videos
- 👤 **Channel Profiles** — View any user's channel with stats, videos & playlists
- 📋 **Playlists** — Create, manage and share playlists
- ❤️ **Likes** — Like/unlike videos and comments
- 💬 **Comments** — Nested comment threads on videos
- 🔔 **Subscriptions** — Subscribe/unsubscribe to channels
- 📜 **Watch History** — Track and manage viewing history
- 🗂️ **Library** — Saved playlists and liked videos in one place
- 🔍 **Search** — Search across videos
- 📊 **Dashboard** — Creator stats and video management
- ⚡ **Redis Caching** — Fast responses with server-side caching

---

## 🗂️ Project Structure

```
VidStream/
├── backend/                  # Node.js / Express API
│   ├── public/temp/          # Temp upload directory (auto-cleared)
│   └── src/
│       ├── controllers/      # Route handlers
│       ├── db/               # MongoDB connection
│       ├── middlewares/      # Auth, Multer, error handling
│       ├── models/           # Mongoose schemas
│       ├── routes/           # API route definitions
│       ├── utils/            # Cloudinary, ApiError, ApiResponse
│       ├── app.js
│       └── index.js
│
└── frontend/                 # React + Vite SPA
    └── src/
        ├── api/              # Axios instance
        ├── components/       # Reusable UI components
        ├── context/          # Auth context (global state)
        ├── pages/            # Page-level components
        └── main.jsx
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Primary database |
| Cloudinary | Video & image storage |
| Multer | File upload handling |
| JWT | Authentication tokens |
| Redis | Server-side caching |
| bcrypt | Password hashing |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| React Router DOM | Client-side routing |
| Axios | HTTP client |
| Tailwind CSS | Styling |
| React Icons | Icon library |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Cloudinary account

### 1. Clone the repository

```sh
git clone https://github.com/aRyan111112/video_app.git
cd video_app
```

### 2. Set up the Backend

```sh
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net
CORS_ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

REDIS_URL=redis://localhost:6379
```

Start the backend dev server:

```sh
npm run dev
```

> API will be available at `http://localhost:8000`

### 3. Set up the Frontend

```sh
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Start the frontend dev server:

```sh
npm run dev
```

> App will be available at `http://localhost:5173`

---

## 📡 API Endpoints

| Resource | Base Path |
|---|---|
| Users | `/api/v1/users` |
| Videos | `/api/v1/video` |
| Likes | `/api/v1/likes` |
| Comments | `/api/v1/comments` |
| Subscriptions | `/api/v1/subscriptions` |
| Playlists | `/api/v1/playlist` |
| Tweets | `/api/v1/tweets` |
| Dashboard | `/api/v1/dashboard` |
| Healthcheck | `/api/v1/healthcheck` |

---

## 📄 License

ISC

---

**Author:** [aryan](https://github.com/aRyan111112)
