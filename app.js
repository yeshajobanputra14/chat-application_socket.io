const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000
const path = require('path');
const server = app.listen(PORT, ()=> console.log("Server is running at http://localhost:4000"));
const io = require('socket.io')(server);


//making public folder as static directory of this application
app.use(express.static(path.join(__dirname, "public")));

let socketsConnected = new Set()

io.on('connection',onConnected)

function onConnected(socket){
    console.log(socket.id)
    socketsConnected.add(socket.id)

    io.emit('clients-total', socketsConnected.size)

    socket.on('disconnect', ()=>{
        console.log('Socket disconnected', socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total', socketsConnected.size)
    })

    socket.on('message', (data)=>{
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    })
    socket.on('feedback', (data)=>{
        socket.broadcast.emit('feedback', data)
    })
}

