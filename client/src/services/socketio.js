import { io } from "socket.io-client";

let socket = null;

const setupSocketConnection = (jwt) => {
  console.log("connect to socket");
  socket = io("http://localhost:3000/", {
    auth: {
      token: jwt,
    },
  });
};

const joinRoom = (postID) => {
  if (socket) {
    socket.emit("join", postID);
  }
};

const leaveRoom = (postID) => {
  if (socket) {
    socket.emit("leave", postID);
  }
};

const newPost = (postID) => {
  if (socket) {
    socket.emit("newpost", postID);
  }
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

const subscribeToNewPost = (callback) => {
  if (socket) {
    socket.on("newpost", () => {
      callback();
    });
  }
};

export {
  setupSocketConnection,
  joinRoom,
  leaveRoom,
  newPost,
  disconnectSocket,
  subscribeToNewPost,
};
