const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Store connected users
const users = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle setting username
  socket.on("setUsername", (username) => {
    users.set(socket.id, username);
    console.log(`User ${username} joined`);
  });

  // Handle chat messages
  socket.on("message", (data) => {
    // Broadcast message to all connected clients
    io.emit("message", {
      text: data.text,
      username: users.get(socket.id),
      timestamp: new Date().toLocaleTimeString(),
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    console.log(`User ${username} disconnected`);
  });
});

app.get("/", (req, res) => res.render("index"));
// Start server
const PORT = process.env.PORT || 4000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
