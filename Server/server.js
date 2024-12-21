const http = require("http");
const port = 8080;
const app = require("./app");
const { Server } = require("socket.io");
const communityChat = require("./model/communityChat");

const server = http.createServer(app);

// socket logic ----->>>
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("A new User Connected ", socket.id);
  socket.on("roomId", (roomId) => {
    console.log(socket.id, "room id received", roomId);
    socket.join(roomId);
  });

  // recieve the message
  socket.on("message", (arg) => {
    // console.log("this is message ", arg);
    if (arg) {
      // emit or send the message
      const { firstName, lastName, email, userId } = arg.userInfo;
      // console.log(firstName, lastName, email, userId, arg.message, arg.roomId);
      const newChat = new communityChat({
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        message: arg.message ? arg.message : null,
        roomId: arg.roomId ? arg.roomId : null,
        receiverId: arg.receiverId ? arg.receiverId : null,
      });
      newChat
        .save()
        .then((res) => {
          io.to(res.roomId).emit("message", res);
          console.log("This is emit message------>>>>", res);
        })
        .catch((err) => {
          console.log("this is socket Err", err);
        });
    }
  });
  // Handle user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log("App  is running on port ------->>>", port);
});
