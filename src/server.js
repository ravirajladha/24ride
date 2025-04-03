import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";
import { Server } from "socket.io";

dotenv.config();
console.log(process.env.PORT);


const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 8000;
    
    const server = app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

    // Set up Socket.IO for real-time tracking
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    io.on("connection", (socket) => {
      console.log("New client connected");

      socket.on("rideUpdate", (data) => {
        console.log("Ride Update:", data);
        io.emit("updateRide", data);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });

  } catch (err) {
    console.log("MongoDB connection failed!", err);
  }
};

startServer();
