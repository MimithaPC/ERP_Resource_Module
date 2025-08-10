import express from "express";
import cors from "cors";
import mainRouter from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS Middleware
app.use(cors({
  origin: "http://localhost:5173", // Frontend origin
  credentials: true
}));

// ✅ Body Parser Middleware
app.use(express.json());

// ✅ Routes
app.use("/", mainRouter);

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
