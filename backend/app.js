const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require('fs');
const app = express();
const { authJWT } = require("./Middleware/verifyAuth");
const db = require("./db/db");
const login = require("./config/authToken");
const user = require("./Router/user.js");

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
  maxHttpBufferSize: 1e8 // 100 MB
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
app.use(cors());

app.use("/api/login", login);
app.use("/api/user", authJWT, user);

const port = 5000;
let offers = [];
let users = [];

io.on("connection", (socket) => {
  socket.on("send-id", (id) => {
    users.push({ userName: id, socketId: socket.id });
  });

  socket.on("Message", (receiverId, message, nameFile, FileUpload) => {
    if (nameFile) {
      fs.writeFile(`public/upload/${nameFile}`, FileUpload, (err) => {
        if (err) {
          console.log(err);
        } else {
          io.emit(receiverId, message);
        }
      });
    } else {
      io.emit(receiverId, message);
    }
  });

  socket.on("signalFirst", (data) => {
    const { type, sdp:offer, sdp:answer, id } = data;
    console.log(answer)
    io.emit(`signal-${id}`, { type, offer: type === 'offer' ? offer : answer });
  });

  socket.on("newAnswer", (offerObj, ackFunction) => {
    const offerToUpdate = offers.find(o => o.offerUserName === offerObj.offerUserName);
    ackFunction(offerToUpdate.offerIceCandidates);
    offerToUpdate.answer = offerObj.answer;
    io.emit(`answerResponse-${offerObj.answerUserName}`, offerToUpdate);
  });

  // Handle ICE candidate signaling
  socket.on('ice-candidate', (data) => {
    const { candidate, id } = data;
    io.to(id).emit('ice-candidate', { candidate, id: socket.id });
  });
});

db.initDb((err, dataBase) => {
  if (err) {
    console.log(err);
  } else {
    server.listen(port, () => {
      console.log(`Server is running on PORT ${port}`);
    });
  }
});
