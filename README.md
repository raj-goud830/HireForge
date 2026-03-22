# 🚀 HireForge (cloudTaskApp)

HireForge is a full-stack SaaS application tailored for managing resumes, portfolios, and interviews. It features a robust Next.js frontend and an Express.js backend, fully containerized with Docker and integrated with various modern web technologies, including user authentication via Clerk and an OpenAI integration for advanced capabilities.

## ✨ Features

- **📄 Resumes Management:** Create, manage, and track user resumes.
- **🎨 Portfolios:** Build and maintain user portfolios to showcase work and projects.
- **💼 Interviews Dashboards:** Track and manage job interviews seamlessly.
- **🔒 Authentication:** Secure user authentication using [Clerk](https://clerk.dev).
- **🤖 AI Integration:** Powered by the [OpenAI API](https://openai.com) for intelligent content and task assistance.
- **🐳 Containerized:** Fully Dockerized backend and MongoDB setup for easy deployment and scaling.

## 🛠️ Tech Stack

### 🖥️ Frontend
- **Framework:** [Next.js](https://nextjs.org/) (React 19)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication:** Clerk Next.js SDK
- **Language:** TypeScript

### ⚙️ Backend
- **Framework:** Node.js with [Express](https://expressjs.com/)
- **Database:** MongoDB (via Mongoose)
- **Authentication Validation:** Clerk Backend SDK
- **AI Integrations:** OpenAI SDK
- **Language:** TypeScript

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18+)
- **npm** or **yarn**
- **Docker & Docker Compose** (for database and backend containerization)
- A **Clerk Account** for Authentication APIs
- A **MongoDB Atlas** cluster (optional, if you're not using the local Docker container)
- **OpenAI API Key**

### 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cloudTaskApp
   ```

2. **Setup Frontend:**
   Navigate into the `frontend` directory and install the dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. **Setup Backend:**
   Navigate into the `backend` directory and install the dependencies:
   ```bash
   cd backend
   npm install
   ```

### 🔑 Environment Variables

You need to set up environment variables for both the backend and frontend.

#### Backend
Create a `.env` file in the `backend/` directory and add the necessary tokens:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/saas-db # or your MongoDB Atlas connection string
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
```

#### Frontend
Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🏃 Running the Application

### 1. 🐳 Using Docker (Backend & MongoDB)

The easiest way to run the backend and the MongoDB database is via Docker Compose:
```bash
docker-compose up --build
```
This command will start:
- A MongoDB instance mapping to port `27017`
- The Node.js Express Backend running on port `5000`

### 2. 💻 Running Locally for Development

If you prefer to run the services without Docker during development:

**Start the Database:**
Make sure you have a local MongoDB server running or connect to MongoDB Atlas.

**Start the Backend Dev Server:**
```bash
cd backend
npm run dev
```

**Start the Frontend Dev Server:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` in your browser to view the application.

---

## 📂 Project Structure

```text
cloudTaskApp/
├── backend/                  # ⚙️ Node.js + Express backend
│   ├── models/               # 🗃️ Mongoose schema models (Resume, Portfolio, etc.)
│   ├── routes/               # 🛣️ API endpoint definitions
│   ├── index.ts              # 🚪 Entry point
│   ├── package.json          # 📦 Backend dependencies
│   └── tsconfig.json         # 📜 TypeScript config
├── frontend/                 # 🖥️ Next.js React frontend
│   ├── src/                  # 🏗️ Next.js App Router (app/dashboard/...)
│   ├── public/               # 🖼️ Static assets
│   ├── package.json          # 📦 Frontend dependencies
│   ├── tailwind.config.ts    # 🎨 Tailwind CSS configuration
│   └── tsconfig.json         # 📜 TypeScript config
└── docker-compose.yml        # 🐳 Docker configuration for services
```

## 📜 Scripts

### 🖥️ Frontend (`frontend/package.json`)
- `npm run dev`: Starts the Next.js development server
- `npm run build`: Builds the app for production
- `npm start`: Starts the Next.js production server
- `npm run lint`: Runs ESLint for code formatting

### ⚙️ Backend (`backend/package.json`)
- `npm run dev`: Starts the Nodemon server with hot reload
- `npm run build`: Compiles TypeScript to JavaScript
- `npm start`: Runs the compiled output from the `dist` folder

---

## 📄 License

This project is licensed under the **ISC License**.
