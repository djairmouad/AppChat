const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
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
const offers = [];

io.on("connection", (socket) => {
  socket.on("Message", (receiverId, message, nameFile, FileUpload) => {
    if (nameFile !== "") {
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
    socket.on("newOffer", (newOffer) => {
      offers.push({
        offerUserName: id,
        offer: newOffer,
        offerIceCandidates: [],
        answerUserName: friend,
        answerIceCandidates: []
      });
      io.emit(`receiver-${friend}`, offers.slice(-1));
    });

    const show = true;
    io.emit(`call-${friend}`, show, id);
  });

  socket.on("newAnswer", (offerObj, ackFunction) => {
    const offerToUpdate = offers.find(o => o.offerUserName === offerObj.offerUserName);
    ackFunction(offerToUpdate.offerIceCandidates);
    offerToUpdate.answer = offerObj.answer;
    console.log(offerObj.answerUserName)
    io.emit(`answerResponse-${offerObj.answerUserName}`, offerToUpdate);
  });

  socket.on("sendIceCandidateToSignalingServer", (iceCandidateObj) => {
    const { didIOffer, iceUserName, iceCandidate } = iceCandidateObj;
    if (didIOffer) {
      const offerInOffers = offers.find(o => o.offerUserName === iceUserName);
      if (offerInOffers) {
        offerInOffers.offerIceCandidates.push(iceCandidate);
        if (offerInOffers.answerUserName) {
          const socketToSendTo = offerInOffers.answerUserName;
          if (socketToSendTo) {
            io.emit(`receivedIceCandidateFromServer-${socketToSendTo}`, iceCandidate);

          } else {
            console.log("Ice candidate received but could not find answerer");
          }
        }
      }
    } else {
      const offerInOffers = offers.find(o => o.answerUserName === iceUserName);
      if (offerInOffers) {
        const socketToSendTo = offerInOffers.offerUserName;
        if (socketToSendTo) {
          io.emit(`receivedIceCandidateFromServer-${socketToSendTo}`, iceCandidate);

        } else {
          console.log("Ice candidate received but could not find offerer");
        }
      }
    }
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
