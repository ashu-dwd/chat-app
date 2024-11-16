const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const io = new Server(server);

// socket.io
io.on("connection", (socket) => {
  socket.on("msg", (msg) => {
    console.log(`A new user has sent msg: ${msg}`);
    io.emit("msg", msg);
  });
});

res.sendFile(__dirname + "/public/index.html");

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(port, () => console.log(`Server started at port ${port}`));
