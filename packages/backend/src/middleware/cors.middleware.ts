import cors from "cors";

const port = Number.parseInt(process.env["PORT"] ?? "4000");

const allowedOrigins = [`http://localhost:${port}`];

const corsOptions: cors.CorsOptions = {
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 3600,
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: (origin, callback) =>
    origin == null || allowedOrigins.includes(origin ?? "")
      ? callback(null, true)
      : callback(new Error("Not allowed by CORS")),
};

export default cors(corsOptions);