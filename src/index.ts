import type { Request, Response, NextFunction } from "express";
import type { Socket } from "socket.io";
import { formaterrorResponse } from "./utills/response.js";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import noteRouter from "./routes/note.route.js";
import connectDatabase from "./utills/connectDatabase.js";
import { envObj } from "./config/index.js";


// app created
const app = express();

//htto server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
  console.log("socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});
app.set("io", io);

//test api
app.get("/", (req: Request, res: Response) => {
  res.send("api is working!!!");
});

// middelware
app.use(cors());
app.use(express.json());
app.use("/api/notes", noteRouter);

//global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log("🚀 ~ error:", error);
  res.status(error.statusCode || 500)
    .json(formaterrorResponse(error, error.message || "something went wrong"));
});

//global exception handler

//like this erroe express will not catch
// setTimeout(() => {
//   throw new Error("Crash after 2 seconds");
// }, 2000);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

const startServer = async () => {
  try {
    //connect to database
    await connectDatabase();

    server.listen(envObj.PORT, () => {
      console.log(`Server running on port ${envObj.PORT}`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("🚀 ~ startServer ~ error:", error.message);
    }
  }
};
// start server
startServer();
