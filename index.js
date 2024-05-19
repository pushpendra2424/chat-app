const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const path = require("path");
const cors = require("cors");
const socket = require("socket.io");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoute.js");
const chatRoutes = require("./routes/chatRoute.js");
const messageRoutes = require("./routes/messageRoute.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const User = require("./models/userModel.js");

const app = express();

const port = process.env.PORT || 5000;
dotenv.config();
connectDB();

app.use(express.json());

app.use(
  cors({
    origin: "https://chat-app-mern1.vercel.app",
  })
);

app.use(express.static(path.join(__dirname, "./public/")));
app.use("/api/profile/image", express.static(path.join(__dirname, "uploads")));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ------------------------------------------------------------------

const dir = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(dir, "/chat-frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "/chat-frontend", "dist", "index.html")
    );
  });
}

// ---------------------------------------------------------------------

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, async (req, res) => {
  const getData = await User.findOne();
  if (!getData) {
    let users = [
      { name: "Guest User", email: "guest@example.com", password: "12345" },
      { name: "First User", email: "first@example.com", password: "12345" },
      { name: "Second User", email: "second@example.com", password: "12345" },
    ];
    users.map(async (user) => await User.create(user));
  }
  if (process.env.NODE_ENV !== "production")
    console.log(`server running on port 5000`.red.bold);
});

const io = socket(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  // console.log(`connection established with socket id ${socket.id}`.yellow.bold);
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log("userData._id: ", userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("User joined Room: ", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    // console.log("New message received:", newMessageRecieved);
    let chat = newMessageRecieved.chat;
    if (!chat.users) return;
    // console.log("chat.users is empty");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    // console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
