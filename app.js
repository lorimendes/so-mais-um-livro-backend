import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const corsOptions = {
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

process.loadEnvFile();
const { PORT = 3000 } = process.env;
const app = express();

try {
  mongoose.connect("mongodb://localhost:27017");
} catch (err) {
  console.error(`Erro ao conectar com o banco de dados: ${err}`);
}

app.use(cors(corsOptions));
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {});
}

export default app;
