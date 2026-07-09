import "dotenv/config";
import express from "express";
import db from "./db/db.config.js";
import mainRouter from "./src/api/main.routes.js";
import { errorHandler } from "./src/middleware/error-handler.js";
import cors from "cors";

const app = express();
// express middleware 
app.use(express.json());
// Form Data handle middleware
// app.use(express.urlencoded({ extended: true }));


// Allow request for frontend port
app.use(cors({
  origin: "http://localhost:5173",
}))

// /api yehone mangnawm route
app.use('/api', mainRouter);

// Final middleware for error handling

app.use(errorHandler);


async function startServer() {
  try {
      const connection = await db.getConnection();
      console.log("DB connected");
    connection.release();

    app.listen(3555, () => {
      console.log("Server is running on port http://localhost:3555");
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

startServer();
