const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const communityChat = require("./model/communityChat");

const port = process.env.PORT || 3000;
const server = http.createServer(app);

// Socket logic
const io = new Server(server, {
  cors: {
    origin: process.env.REACT_CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A new User Connected", socket.id);

  socket.on("roomId", (roomId) => {
    console.log(socket.id, "room id received", roomId);
    socket.join(roomId);
  });

  socket.on("message", async (arg) => {
    if (arg) {
      const {
        firstName,
        lastName,
        email,
        userId,
        message,
        roomId,
        receiverId,
      } = arg.userInfo;
      try {
        const newChat = new communityChat({
          userId,
          firstName,
          lastName,
          email,
          message: message || null,
          roomId: roomId || null,
          receiverId: receiverId || null,
        });

        const savedChat = await newChat.save();
        io.to(savedChat.roomId).emit("message", savedChat);
        console.log("Emit message:", savedChat);
      } catch (err) {
        console.error("Socket error:", err);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log("App is running on port:", port);
});
