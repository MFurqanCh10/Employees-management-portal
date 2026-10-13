import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employeeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();

// Allow requests from our React frontend.
app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

// Parse incoming JSON request bodies.
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

// Test endpoint.
app.get("/", (req, res) => {
  res.json({
    message: "Employee Management API is running"
  });
});

// Health-check endpoint.
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

export default app;