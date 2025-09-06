Full‑stack MERN app for creating, sharing, and discovering code snippets with user authentication, likes, tags, and a leaderboard. The frontend is a Next.js 14 app; the backend is an Express API with MongoDB.

## Features

- Snippets: create, update, delete, list public/private, like, and browse popular
- Tags: browse tags and assign them to snippets
- Auth: register, login, logout, email verification, password reset, change password
- Roles: user, creator, admin (admin endpoints for user management)
- Leaderboard: ranks users by likes and snippet activity

## Tech Stack

- Frontend: `Next.js 14 (app router)`, `React 18`, `Tailwind`
- Backend: `Node.js`, `Express`, `Mongoose`
- Auth: `JWT` (HTTP‑only cookie)
- Email: `nodemailer` with `Outlook 365` templates (handlebars)
- DB: `MongoDB Atlas`

## Monorepo Layout

- `backend/` — Express API, MongoDB models, auth, mailing
- `client/` — Next.js app (pages under `app/`)

## Prerequisites

- Node.js 18+ and npm
- A MongoDB connection string (MongoDB Atlas recommended)
- An Outlook 365 mailbox + app password for SMTP (or adjust transport)

## Environment Variables

Create `backend/.env` with:

```
PORT=8000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret
CLIENT_URL=http://localhost:3000
USER_EMAIL=your-outlook-email@example.com
EMAIL_PASS=your-outlook-app-password
NODE_ENV=development
```

Notes:

- Do not commit real secrets. The repo’s `backend/.env` should be replaced with your local values.
- The backend enables CORS for `CLIENT_URL` and uses HTTP‑only cookies for JWT. Cookies are set with `sameSite: "none"` and `secure: true` in `backend/src/controllers/auth/userController.js`. In local HTTP development, some browsers will block secure cookies. For local dev, you may need HTTPS or to adjust `secure` to `process.env.NODE_ENV === 'production'`.

Optional: If you want to make the API URL configurable on the client, replace the hardcoded URLs with env‑based logic. Current hardcoded locations:

- `client/context/snippetsContext.js:17` → `const serverUrl = "http://localhost:8000/api/v1";`
- `client/context/userContext.js:12` → `const serverUrl = "http://localhost:8000";`

## Install

Install dependencies for both apps:

```
cd backend && npm install
cd ../client && npm install
```

## Run (Development)

Start the API:

```
cd backend
npm start
```

Start the web app:

```
cd client
npm run dev
```

By default:

- API: `http://localhost:8000`
- Web: `http://localhost:3000`

## Seeding Tags (optional)

To quickly populate common tags, use the helper script (requires at least one user to exist):

```
cd backend
node addTags.js
```

## Key Scripts

- `backend/package.json`
  - `start`: `nodemon server.js` (Express API with auto‑reload)
- `client/package.json`
  - `dev`: `next dev`
  - `build`: `next build`
  - `start`: `next start`

## API Overview

Base URL: `http://localhost:8000/api/v1`

Auth & Users

- `POST /register` — create account
- `POST /login` — login (sets HTTP‑only cookie)
- `GET /logout` — clear session
- `GET /login-status` — boolean login status
- `GET /user` — current user (protected)
- `PATCH /user` — update profile (protected)
- `GET /user/:id` — public profile (no email)
- `POST /verify-email` — send verification email (protected)
- `POST /verify-user/:verificationToken` — verify account
- `POST /forgot-password` — send reset email
- `POST /reset-password/:resetPasswordToken` — reset password
- `PATCH /change-password` — change password (protected)

Snippets

- `POST /create-snippet` — create (protected)
- `GET /snippets/public` — list public snippets
  - Query: `userId`, `tagId`, `search`, `page`, `limit`
- `GET /snippets` — list my snippets (protected)
  - Query: `tagId`, `search`, `page`, `limit`
- `GET /snippet/:id` — get my snippet (protected)
- `GET /snippet/public/:id` — get public snippet
- `PATCH /snippet/:id` — update (protected)
- `DELETE /snippet/:id` — delete (protected)
- `PATCH /snippet/like/:id` — toggle like (protected)
- `GET /snippets/liked` — my liked snippets (protected; supports `tagId`, `search`, pagination)
- `GET /leaderboard` — top users by score/likes
- `GET /snippets/popular` — most‑liked public snippets (paginated)

Tags

- `POST /create-tag` — create tag (protected)
- `GET /tags` — list tags
- `GET /tag/:id` — tag by id
- `DELETE /tag/:id` — delete tag (protected)

Admin

- `GET /admin/users` — list users (creator/admin)
- `DELETE /admin/users/:id` — delete user (admin)

## Frontend Notes

- Axios calls for snippets use `serverUrl` set to `http://localhost:8000/api/v1` in `client/context/snippetsContext.js:17`.
- Axios calls for auth use `serverUrl` set to `http://localhost:8000` in `client/context/userContext.js:12`.
- Cookies: `axios.defaults.withCredentials = true` is set in `client/context/userContext.js` to include cookies with requests.

## Development Tips

- If login works but you see “Not authorized, please login!”, check cookies in your browser. On HTTP, browsers may block `secure` cookies. Consider using HTTPS locally or toggling the cookie `secure` flag for development.
- Update `CLIENT_URL` in `backend/.env` to match the frontend origin you run.
- For production, point the client `serverUrl` values to your deployed API base URL.

## License

This project is provided as‑is for learning and personal use.

