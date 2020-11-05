const socket = io("/")
const videoGrid = document.getElementById("video-grid")
const connectedUsersList = document.getElementById("connected-users")
const callControls = document.getElementById("call-controls")
const myPeer = new Peer(undefined, { host: "/", port: "4001"})
const myVideo = document.createElement("video")
myVideo.muted = true
const peers = []
const connectedUsers = []

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement("video")
    console.log("connectToNewUser: " + userId)
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream, userId)
    })
    call.on("close", () => {
        removeVideoStream(video, userId)
    })
    peers[userId] = call
}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream, myPeer.id)

    myPeer.on("call", call => {
        call.answer(stream)
        const video = document.createElement("video")
        const userId = call.peer
        // other users video stream
        call.on("stream", userVideoStream => {
            addVideoStream(video, userVideoStream, userId)
        })
        call.on("close", () => {
            removeVideoStream(video, userId)
        })
        peers[userId] = call
    })

    socket.on("user-connected", userId => {
        const answerButton = document.createElement("button")
        answerButton.innerText = "Answer"
        answerButton.id = "answer" + userId
        callControls.append(answerButton)
        answerButton.addEventListener("click", () => {
            connectToNewUser(userId, stream)
            answerButton.remove()
        })
    })
})

socket.on("user-disconnected", userId => {
    if (peers[userId]) peers[userId].close()
    const staleAnswerButton = document.getElementById("answer" + userId)
    if (staleAnswerButton) {
        staleAnswerButton.remove()
    }
})

myPeer.on("open", id => {
    const hangUpButton = document.createElement("button")
    hangUpButton.innerText = "Hangup"
    callControls.append(hangUpButton)
    hangUpButton.addEventListener("click", () => {
        socket.disconnect()
    })
    socket.emit("join-room", ROOM_ID, id)
})

function addVideoStream(video, stream, userId) {
    if (connectedUsers.indexOf(userId) != -1) {
        return
    }
    connectedUsers.push(userId)
    video.srcObject = stream
    video.addEventListener("loadedmetadata", () => {
        video.play()
    })
    videoGrid.append(video)
    const userName = document.createElement("li")
    userName.innerText = userId
    userName.id = userId
    connectedUsersList.append(userName)
}

function removeVideoStream(video, userId) {
    document.getElementById(userId).remove()
    video.remove()
    connectedUsers.remove(userId)
}