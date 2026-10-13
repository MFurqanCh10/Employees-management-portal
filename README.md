# MERN Employee Management System

A full-stack Employee Management System built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). This project demonstrates employee CRUD operations, user registration, login, JWT authentication, and protected employee records.

## Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected dashboard and employee APIs
- Create, read, update, and delete employees
- Search employees by name, email, department, or designation
- Employee dashboard with summary statistics
- User-specific employee records
- MongoDB integration using Mongoose
- Responsive React user interface
- MongoDB Compass support for viewing database records

## Tech Stack

**Frontend**
- React.js
- Vite
- React Router
- HTML and CSS

**Backend**
- Node.js
- Express.js
- REST APIs
- JWT
- bcryptjs

**Database**
- MongoDB
- Mongoose

## Project Structure

```text
mern-employee-management/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.jsx
│       ├── EmployeeDashboard.jsx
│       ├── App.css
│       ├── Auth.css
│       └── main.jsx
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB running locally
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-GITHUB-USERNAME/mern-employee-management.git
cd mern-employee-management
```

Replace `YOUR-GITHUB-USERNAME` with your GitHub username.

### 2. Configure the backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` and configure these variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/employee_management
JWT_SECRET=your_generated_secret
```

Generate a secret using:

```bash
openssl rand -hex 32
```

Replace `your_generated_secret` with the generated value. Do not commit your actual `.env` file.

### 3. Start the backend

From the `server` directory, run:

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

### 4. Configure the frontend

Open a second terminal:

```bash
cd ~/Desktop/mern-employee-management/client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Retrieve the authenticated user's profile |

### Employee Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | Get the current user's employees |
| GET | `/api/employees/:id` | Get an employee by ID |
| POST | `/api/employees` | Create an employee |
| PUT | `/api/employees/:id` | Update an employee |
| DELETE | `/api/employees/:id` | Delete an employee |

Employee endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

## Database

The application uses a local MongoDB database named `employee_management`.

Collections are created automatically when documents are first stored. You can inspect user accounts and employee records using MongoDB Compass.

## Learning Objectives

This project demonstrates:

- React components, state, hooks, and routing
- REST API development with Express
- MongoDB document modeling with Mongoose
- Password hashing and JWT authentication
- Protected routes and user-specific data access
- Frontend and backend integration
- Git and GitHub workflow

## Security Note

This is a learning project. Before deploying it to production, implement additional security measures, including secure authentication storage, HTTPS, rate limiting, and appropriate validation and security testing.

## Author

Developed as a hands-on project to learn the MERN stack and full-stack web development.
