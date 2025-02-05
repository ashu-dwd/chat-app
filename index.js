const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const fs = require("fs");

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Store connected users
const users = new Map();
const messagesFile = path.join(__dirname, "messages", "messages.json");

// Ensure messages file exists
if (!fs.existsSync(messagesFile)) {
  fs.writeFileSync(messagesFile, JSON.stringify([]));
}

// Load messages from file
function loadMessages() {
  if (fs.existsSync(messagesFile)) {
    const fileContent = fs.readFileSync(messagesFile, "utf8");

    // Check if the content is empty
    if (!fileContent.trim()) {
      return [];
    }

    try {
      return JSON.parse(fileContent);
    } catch (error) {
      console.error("Error parsing messages.json:", error);
      return [];  // Return an empty array if there's a parsing error
    }
  }
  return [];
}

// Save message to file
function saveMessage(message) {
  let messages = loadMessages();
  messages.push(message);
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
}

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Send existing messages to the newly connected user
  socket.emit("loadMessages", loadMessages());

  // Handle setting username
  socket.on("setUsername", (username) => {
    users.set(socket.id, username);
    console.log(`User ${username} joined`);
  });

  // Handle chat messages
  socket.on("message", (data) => {
    const message = {
      text: data.text,
      username: users.get(socket.id),
      timestamp: new Date().toLocaleTimeString(),
    };

    // Save message
    saveMessage(message);

    // Broadcast message to all connected clients
    io.emit("message", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    console.log(`User ${username} disconnected`);
  });
});

// Serve HTML file
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

// Start server
const PORT = process.env.PORT || 4000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
