# Youtube-Clone-BackEnd

This is the backend for a YouTube Clone application built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides RESTful APIs for user authentication, channel management, and video operations.

## Features

- User registration and login with JWT authentication
- Channel creation, update, and fetch
- Video upload, fetch, update, and delete
- Secure password hashing with bcrypt
- MongoDB for persistent storage

## Prerequisites

- Node.js (v16+ recommended)
- MongoDB database (local or Atlas)
- npm

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/SubhamSaha8688/Youtube-Clone-BackEnd
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the server:**
   ```sh
   npm start
   ```
   The server will run on `http://localhost:5000`.

## Project Structure

- `server.js` – Entry point, sets up Express, MongoDB, and routes
- `Routes/` – API route definitions
- `Controller/` – Route handler logic for users, channels, and videos
- `Model/` – Mongoose schemas for users, channels, and videos
- `Middleware/` – Authentication middleware

## API Endpoints

### User

- `POST /signup` – Register a new user
- `POST /login` – Login and receive JWT token
- `GET /validuser` – Validate user session (JWT required)

### Channel

- `POST /channel` – Create a new channel (JWT required)
- `GET /channel/:id` – Get channel details by ID
- `POST /channel/update` – Update channel details (JWT required)

### Video

- `POST /upload` – Upload a new video (JWT required)
- `GET /videos` – Fetch all videos
- `GET /video/:id` – Fetch a single video by ID
- `POST /video/update` – Update video details (JWT required)
- `DELETE /video/:id` – Delete a video (JWT required)

## Notes

- All protected routes require the `Authorization: JWT <token>` header.
- Passwords are securely hashed using bcrypt.
- Error messages are returned in JSON format.


For the frontend, see the [FRONTEND](https://github.com/SubhamSaha8688/Youtube-Clone-BackEnd) directory.