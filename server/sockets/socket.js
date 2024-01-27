const { Server } = require('socket.io');

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'https://localhost:8080',
      methods: ['GET', 'POST'],
    },
  });
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Missing token'));
    }

    next();
  });

  io.on('connection', (socket) => {
    console.log('Connected');

    //POST

    socket.on('join', (roomName) => {
      console.log('join: ' + roomName);
      socket.join(roomName);
    });

    socket.on('leave', (roomName) => {
      console.log('leave ' + roomName);
      socket.leave(roomName);
    });

    socket.on('newpost', (roomName) => {
      console.log('newpost in ' + roomName);
      socket.to(roomName).emit('newpost');
    });

    //FOLLOWING

    socket.on('subscribeFollowing', (userId) => {
      console.log('subscribed');
      socket.join(`user-${userId}`);
    });

    socket.on('unsubscribeFollowing', (userId) => {
      console.log('unsubscribed');
      socket.leave(`user-${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });
  });

  return io;
};

module.exports = { initializeSocket };
