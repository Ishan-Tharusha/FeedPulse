# FeedPulse — AI-Powered Product Feedback Platform

FeedPulse is a lightweight internal tool that lets teams collect product feedback and feature requests from users, then uses Google Gemini AI to automatically categorise, prioritise, and summarise them — giving product teams instant clarity on what to build next.

## Features

- **Public Feedback Submission**: A clean landing page for users to submit feedback.
- **AI Analysis**: Automatically detects category, sentiment, and priority score using Gemini.
- **Admin Dashboard**: Secure portal for managing feedback items with real-time status updates.
- **AI Summaries**: Generate on-demand trend summary of recent feedback themes.
- **Premium UI**: Modern dark-mode aesthetics using Tailwind CSS and Framer Motion.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide icons.
- **Backend**: Node.js, Express, TypeScript, Mongoose.
- **AI**: Google Gemini 1.5 Flash.
- **Database**: MongoDB.
- **Tools**: Jest, Supertest, Docker.

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (Local or Atlas)
- Google Gemini API Key (get one at [aistudio.google.com](https://aistudio.google.com))

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd FeedPulse
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/feedpulse
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET=supersecret_feedpulse_key
   ADMIN_EMAIL=admin@feedpulse.com
   ADMIN_PASSWORD=admin123
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

### Running Locally

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.

### Running with Docker

```bash
docker-compose up --build
```

### Running Tests

```bash
cd backend
npm test
```

## Admin Credentials

- **Email**: `admin@feedpulse.com`
- **Password**: `admin123`

## Future Roadmap

If I had more time, I would build:
1. **Email Notifications**: Notify users when their feedback status is updated.
2. **Advanced Analytics**: Visual charts for feedback trends over time.
3. **Multi-tenancy**: Support for multiple product teams or projects.
4. **Slack Integration**: Automatically push high-priority feedback to Slack channels.
5. **Drag-and-Drop Roadmap**: Transform feedback directly into a Gantt chart or Kanban board.

---

Built with ❤️ by Antigravity AI
