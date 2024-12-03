const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;
const io = new Server(server);

// socket.io
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("msg", (msg) => {
    console.log(`Message received: ${msg}`);
    io.emit("msg", msg); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Set EJS as the view engine
app.set("view engine", "ejs");

// Define the home route
app.get("/", (req, res) => {
  res.render("index");
});

// Start the server
server.listen(port, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log(`Server running on http://localhost:${port}`);
  }
});
