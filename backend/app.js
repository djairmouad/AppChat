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
const  create=require("./Router/creatUser.js");
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST'],
  },
  maxHttpBufferSize: 1e8 // 100 MB
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
app.use(cors());

app.use("/api/login", login);
app.use("/api/user", authJWT, user);
app.use("/api/NewCompte", create);

const port = 5000;
let offers = [];
let users = [];
let friendReceiver = null;
let idSender = null;

io.on("connection", (socket) => {
  socket.on("send-id", (id) => {
    users.push({ userName: id, socketId: socket.id });
  });
  socket.on('disconnect',id=>{
    const indexDeleted=users.findIndex((item)=>item.userName===id)
    users.splice(indexDeleted, 1);
  });
  socket.on('offer', (offer,id,friend) => {
    offers.push({
      offerUserName: idSender,
      offer: offer,
      offerIceCandidates: [],
      answerUserName: friendReceiver,
      answer: null,
      answerIceCandidates: []
    });
   let newOffer=offers.find((item)=>{
    return (item.offerUserName===id && item.answerUserName===friend)||
    item.offerUserName===friend && item.answerUserName===id
   });
   newOffer.offer=offer
    socket.broadcast.emit('offer',newOffer.offer);
  });
  socket.on('answer', (answer,id,friend) => {
    const newOffer=offers.findIndex((item)=>{
      return (item.offerUserName===id && item.answerUserName===friend)||
      item.offerUserName===friend && item.answerUserName===id
     });
    offers[newOffer].answer=answer
     const newAnswer=offers[newOffer];
    socket.broadcast.emit('answer', newAnswer.answer);
  });
  socket.on('candidate', (candidate, id, friend) => {
    const newCandiateOffer = offers.findIndex((item) => {
      return (item.offerUserName === id && item.answerUserName === friend);
    });
  
    const newCandiateAnswr = offers.findIndex((item) => {
      return (item.offerUserName === friend && item.answerUserName === id);
    });
  
    if (newCandiateOffer !== -1) { // Check if the offer index is valid
      offers[newCandiateOffer].offerIceCandidates.push(candidate);
      console.log(offers[newCandiateOffer].offerIceCandidates);
      socket.broadcast.emit('candidate', offers[newCandiateOffer].offerIceCandidates);
    }
  
    if (newCandiateAnswr !== -1) { // Check if the answer index is valid
      offers[newCandiateAnswr].answerIceCandidates.push(candidate);
      console.log(offers[newCandiateAnswr].answerIceCandidates);
      socket.broadcast.emit('candidate', offers[newCandiateAnswr].answerIceCandidates);
    }
  });
  socket.on("ControleCamira",(friend,config)=>{
    io.emit(`ControleCamira-${friend}`,config)
  })
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
  socket.on(`call`,(id,friend)=>{
    idSender=id;
    friendReceiver=friend
    io.emit(`call-${friend}`, true,id)
  })
  socket.on("Close",(caller)=>{
    io.emit(`Close-${caller}`,"Close")
  })
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
