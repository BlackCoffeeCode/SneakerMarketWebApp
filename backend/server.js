import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js"; // 👈 IMPORT
import sneakerRoutes from "./routes/sneakerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

// 👇 THIS LINE IS CRITICAL
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 5000;

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api/sneakers", sneakerRoutes);
app.use("/api/orders", orderRoutes);

// --------------------------
// Deployment Logic
// --------------------------
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  // Serve index.html for any unknown routes (SPA)
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Backend is running (Dev Mode) 🚀");
  });
}
// --------------------------

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
