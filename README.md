# AI Smart Complaint Management System

A full-stack MERN application that allows users to register, track, and manage complaints, enhanced with AI (via OpenRouter API) to automatically classify complaint priority, recommend responsible departments, and generate automated summaries.

## Features

- **User Authentication**: Secure JWT-based login and registration (User/Admin roles).
- **Complaint Registration**: Submit complaints with details, category, and location.
- **AI Integration**: Automatically analyzes complaints to detect urgency, assign a department, and summarize the issue.
- **Dashboard**: Track overall complaint statistics (Total, Pending, Resolved).
- **Search & Filter**: Search complaints by location and filter them by category.
- **Admin Controls**: Admins can view all complaints and update their status (Pending -> In Progress -> Resolved).
- **Modern UI**: Premium design using Tailwind CSS and glassmorphism.

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Axios, React Router DOM
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose
- **Authentication**: JWT, bcryptjs
- **AI**: OpenRouter API (gpt-3.5-turbo)

## Environment Variables

### Backend (`server/.env`)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
```

## Installation & Running Locally

1. Clone the repository.
2. Setup and run Backend:
   ```bash
   cd server
   npm install
   npm run dev
   ```
3. Setup and run Frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user

### Complaints
- `POST /api/complaints` - Add a new complaint
- `GET /api/complaints` - Get all complaints (Admin) or user's complaints
- `PUT /api/complaints/:id` - Update complaint status (Admin)
- `DELETE /api/complaints/:id` - Delete a complaint (Admin)
- `GET /api/complaints/search?location=...` - Search by location
- `GET /api/complaints/filter?category=...` - Filter by category

### AI
- `POST /api/ai/analyze` - Analyze complaint description

## Deployment

The project is structured to easily deploy on Render as a single unified service or split between client and server. To deploy on Render as a full-stack node service:
1. Build the frontend: `cd client && npm run build`
2. Ensure the backend serves the frontend static files (already configured in `server.js`).
3. Set your environment variables on Render.
4. Deploy the `server` root with the start command: `npm start`.

## Repository
[GitHub Repository Link](https://github.com/Abhinendra-githu/EndSemAIFSD)
