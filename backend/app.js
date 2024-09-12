const express = require("express");
const cors = require("cors");
const { createServer } = require("http"); // Fixed require path to 'http' instead of 'node:http'
const { Server } = require("socket.io");
const multer=require("multer")
const app = express();
const {authJWT} =require("./Middleware/verifyAuth")
const fs = require('fs');
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
  maxHttpBufferSize: 1e8 // 100 MB
});
const db = require("./db/db");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
app.use(cors());

const login = require("./config/authToken");
const user = require("./Router/user.js");
app.use("/api/login",login);
app.use("/api/user",authJWT,user);

const port = 5000;

io.on("connection", (socket) => {
  socket.on("Message", (receiverId, message,nameFile,FileUpload) => {
    if(nameFile!==""){
      fs.writeFile(`public/upload/${nameFile}`, FileUpload, (err) => {
        if(err){
          console.log(err)
        }
    });
    }

    io.emit(receiverId, message); // Fixed indentation
  });
});

// Ensured indentation and comment format
db.initDb((err, dataBase) => {
  if (err) {
    console.log(err);
  } else {
    server.listen(port, () => {
      console.log(`Server is running on PORT ${port}`);
    });
  }
});
