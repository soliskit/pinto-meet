const socket = io("/")
const videoGrid = document.getElementById("video-grid")
const connectedUsersList = document.getElementById("connected-users")
const callControls = document.getElementById("call-controls")
const myPeer = new Peer(undefined, { host: "/", port: "4001"})
const myVideo = document.createElement("video")
myVideo.muted = true
const peers = []
const connectedUsers = []

function addCallToPeers(userId, call) {
    const video = document.createElement("video")
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream, userId)
    })
    call.on("close", () => {
        removeVideoStream(video, userId)
    })
    peers[userId] = call
}

function removeCallFromPeersByUserId(userId) {
    if (peers[userId]) {
        peers[userId].close()
        delete peers[userId]
    }
}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream, myPeer.id)

    myPeer.on("call", call => {
        const userId = call.peer
        call.answer(stream)
        addCallToPeers(userId, call)
    })

    socket.on("user-connected", userId => {
        const answerButton = document.createElement("button")
        answerButton.innerText = "Answer"
        answerButton.id = "answer" + userId
        callControls.append(answerButton)
        answerButton.addEventListener("click", () => {
            const call = myPeer.call(userId, stream)
            addCallToPeers(userId, call)
            answerButton.remove()
        })
    })
})

socket.on("user-disconnected", userId => {
    removeCallFromPeersByUserId(userId)
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