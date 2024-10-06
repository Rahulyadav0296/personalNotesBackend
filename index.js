console.log("Starting the server...");

require("dotenv").config(); // Ensure this is at the top
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http"); // Import http module
const { Server } = require("socket.io"); // Import Socket.IO
const fileRoute = require("./routes/file");
const app = express();

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const allowCredential = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

app.use(cors(allowCredential));
app.use("/uploads", express.static("uploads"));
app.use(fileRoute);
// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: allowCredential,
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const port = process.env.PORT || 3000;
const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb+srv://rajendrayadav510:0L6H4dY7zao4IAWt@cluster0.wogscif.mongodb.net/FaqPage?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB and start the server
mongoose
  .connect(MONGO_URL)
  .then(() => {
    // Start the server with Socket.IO
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    console.log("Congratulations, Database connected!");

    // Handle Socket.IO connections
    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      // Listen for an event from the client
      socket.on("newData", (data) => {
        // Emit the new data to all connected clients
        io.emit("newData", data);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
      });
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
