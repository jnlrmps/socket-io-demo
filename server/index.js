import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:9000'
  }
});

app.use(cors());

const __dirname = dirname(fileURLToPath(import.meta.url));


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat_message', (data) => {
    io.emit('chat_message', data);

    data.msg = `(from all) ${data.msg}`
    io.to('delta').emit(`delta_message`, data);
    io.to('zulu').emit(`zulu_message`, data);

    console.log(`${data.user} messaged: ${data.msg}`)
  });

  // rooms
  socket.on('joinRoom', (data) => {
    socket.join(data.room);
    console.log(`User ${data.user} joined the room: ${data.room}`);
  })

  socket.on('room_chat_message', ({ room, user, msg }) => {
    io.to(room).emit(`${room}_message`, { room, user, msg });
    console.log(`${user} messaged to the room: ${msg}`)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../index.html'));
});

app.get('/ping', (req, res) => {
  res.send({
    message: 'pong'
  })
});


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});