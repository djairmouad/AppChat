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
let friendReceiver = null;
let idSender = null;

io.on("connection", (socket) => {
  socket.on("send-id", (id) => {
    // Store user ID and socket ID for future reference
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

  socket.on("call", (id, friend) => {
    friendReceiver = friend;
    idSender = id;
    const show = true;
    io.emit(`call-${friend}`, show, id);
  });

  socket.on("newOffer", (offer) => {
    offers.push({
      offerUserName: idSender,
      offer: offer,
      offerIceCandidates: [],
      answerUserName: friendReceiver,
      answer: null,
      answerIceCandidates: []
    });
    io.emit(`receiver-${friendReceiver}`, offers.slice(-1));
  });

  socket.on("newAnswer", (offerObj, ackFunction) => {
    const offerToUpdate = offers.find(o => o.offerUserName === offerObj.offerUserName);
    ackFunction(offerToUpdate.offerIceCandidates);
    offerToUpdate.answer = offerObj.answer;
    io.emit(`answerResponse-${offerObj.answerUserName}`, offerToUpdate);
  });

  socket.on("sendIceCandidateToSignalingServer", (iceCandidateObj) => {
    const { didIOffer, iceUserName, iceCandidate } = iceCandidateObj;
    const offerInOffers = offers.find(o => (didIOffer ? o.offerUserName : o.answerUserName) === iceUserName);
    if (offerInOffers) {
      const socketToSendTo = didIOffer ? offerInOffers.answerUserName : offerInOffers.offerUserName;
      if (socketToSendTo) {
        io.emit(`receivedIceCandidateFromServer-${socketToSendTo}`, iceCandidate);
      }
    }
  });
});

db.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    server.listen(port, () => {
      console.log(`Server is running on PORT ${port}`);
    });
  }
});
