import express from "express";
import cors from "cors";
import documentRoutes from "./routes/documents.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "AI Documentation Assistant API is running.",
  });
});

app.use("/api/documents", documentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});