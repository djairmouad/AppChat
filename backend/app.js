const express=require("express")
const cors=require("cors");
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const app=express();
const server = createServer(app);
const io = new Server(server);
const db=require("./db/db")
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static("./public"))
app.use(cors())
const login=require("./config/authToken")
const user=require("./Router/user.js")
app.use("/api/login",login);
app.use("/api/user",user)
const port=5000;

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
  });
 
// this will emit the event to all connected 
  db.initDb((err,dataBase)=>{
    if(err){
      console.log(err)
    }
    else{
      server.listen(port, () => {
        console.log(`Server is running on PORT ${port}`);
      }); 
    }
  })
