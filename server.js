// Express server used to setup rooms only
const express = require("express")
const app = express()
const server = require("http").Server(app)
// Allows socket.io to know which server to 
const io = require("socket.io")(server)
const { v4: uuidV4 } = require("uuid")

// View location
app.set("view engine", "ejs")
app.use(express.static("public"))

// If user doesn't have a room
app.get("/", (request, response) => {
    response.redirect(`/${uuidV4()}`)
})

app.get("/:room", (request, response) => {
    response.render("room", { roomId: request.params.room })
})

io.on("connection", socket => {
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit("user-connected", userId)

        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit("user-disconnected", userId)
        })
    })
})

// Start server
server.listen(4000)