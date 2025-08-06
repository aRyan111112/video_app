# Video App Backend

A Node.js backend for a video sharing platform, built with Express, MongoDB, and Cloudinary.

## Features

- User registration, login, and authentication (JWT)
- Video upload, update, delete, and publish/unpublish
- Playlist management
- Like, comment, and tweet functionality
- Channel subscriptions
- User profile and watch history
- RESTful API with error handling

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- Cloudinary (media storage)
- Multer (file uploads)
- JWT (authentication)
- dotenv (environment variables)

## Project Structure

```
backend/
  ├── public/
  ├── src/
  │   ├── controllers/
  │   ├── db/
  │   ├── middlewares/
  │   ├── models/
  │   ├── routes/
  │   ├── utils/
  │   ├── app.js
  │   ├── constants.js
  │   └── index.js
  ├── .env
  ├── package.json
  └── README.md
```

## Setup

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your values:
     - `MONGODB_URI`
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
     - `ACCESS_TOKEN_SECRET`
     - `REFRESH_TOKEN_SECRET`
     - `PORT`
     - `CORS_ORIGIN`

4. **Run the development server:**
   ```sh
   npm run dev
   ```

## API Endpoints

- **User:** `/api/v1/users`
- **Video:** `/api/video`
- **Likes:** `/api/v1/likes`
- **Comments:** `/api/v1/comments`
- **Subscriptions:** `/api/v1/subscriptions`
- **Playlist:** `/api/v1/playlist`
- **Tweets:** `/api/v1/tweets`
- **Dashboard:** `/api/v1/dashboard`
- **Healthcheck:** `/api/v1/healthcheck`

See the route files in [`src/routes/`](src/routes/) for details.

## License

ISC

---

**Author:** aryan
