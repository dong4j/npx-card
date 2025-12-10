#!/usr/bin/env node

/**
 * Simple Socket.IO chat server.
 * All clients share the same room ("lobby") for now.
 */
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const PORT = process.env.CHAT_SERVER_PORT || 4173;
const ROOM = "lobby";

function formatTime(ts = Date.now()) {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}:${ss}`;
}

app.use(cors());
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const io = new Server(server, {
  cors: {
    origin: process.env.CHAT_SERVER_ORIGIN || "*",
  },
});

io.on("connection", (socket) => {
  const name =
    socket.handshake.auth?.name ||
    `guest-${Math.floor(100 + Math.random() * 900)}`;
  const room = socket.handshake.auth?.room || ROOM;

  socket.join(room);

  // Log and notify join
  console.log(`[${formatTime()}] [join] ${name} (${socket.id}) -> room:${room}`);
  io.to(room).emit("chat:system", {
    message: `${name} joined the room`,
    timestamp: Date.now(),
  });

  socket.on("chat:message", (payload = {}) => {
    const text = (payload.message || "").trim();
    if (!text) return;

    console.log(`[${formatTime()}] [message] ${name}: ${text}`);

    io.to(room).emit("chat:message", {
      author: name,
      message: text,
      timestamp: Date.now(),
      senderId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log(`[${formatTime()}] [leave] ${name} (${socket.id})`);
    io.to(room).emit("chat:system", {
      message: `${name} left the room`,
      timestamp: Date.now(),
    });
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Live chat server running on http://localhost:${PORT}`);
});
