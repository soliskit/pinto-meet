let socket
const peerOptions = {
  key: KEY,
  host: HOST,
  debug: 3,
  config: {
    iceServers: [
      { urls: STUN_URL }
    ]
  }
}
if (ENVIROMENT === 'production') {
  peerOptions.secure = true
} else {
  peerOptions.port = 443
}
const socketOptions = {
  path: `/${KEY}.io`,
  rememberUpgrade: true
}
if (ENVIROMENT === 'production') {
  socket = io(`https://${HOST}`, socketOptions)
} else {
  socket = io(`http://${HOST}:443`, socketOptions)
}
const videoGrid = document.getElementById('video-grid')
const connectedUsersList = document.getElementById('connected-users')
const callControls = document.getElementById('call-controls')
const localPeer = new Peer(undefined, peerOptions)
const localVideo = document.createElement('video')
localVideo.muted = true
const peerCalls = new Map()
const connectedUsers = new Set()

const addCallToPeers = (userId, call) => {
  const remoteVideo = document.createElement('video')
  peerCalls.set(userId, { userId, call })
  call.on('stream', (remoteStream) => {
    addVideoStream(remoteVideo, remoteStream, userId)
  })
  call.on('close', () => {
    removeVideoStream(remoteVideo, userId)
  })
  call.on('error', (error) => {
    console.error(error)
  })
}

const removeCallFromPeersByUserId = (userId) => {
  const removedPeer = peerCalls.get(userId)
  if (removedPeer) {
    removedPeer.call.close()
    peerCalls.delete(userId)
  }
}

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true
  })
  .then((localStream) => {
    const localUserId = localPeer.id
    addVideoStream(localVideo, localStream, localUserId)
    
    localPeer.on('call', (call) => {
      const remoteUserId = call.peer
      call.answer(localStream)
      addCallToPeers(remoteUserId, call)
    })

    socket.on('user-connected', (userId) => {
      const answerButton = document.createElement('button')
      answerButton.innerText = 'Answer'
      answerButton.id = 'answer' + userId
      callControls.append(answerButton)
      answerButton.addEventListener('click', () => {
        const call = localPeer.call(userId, localStream)
        addCallToPeers(userId, call)
        answerButton.remove()
      })
    })

    socket.on('user-disconnected', (userId) => {
      const staleAnswerButton = document.getElementById('answer' + userId)
      if (staleAnswerButton) {
        staleAnswerButton.remove()
      }
      removeCallFromPeersByUserId(userId)
    })
  })
  .catch((error) => {
    console.error(error)
  })

localPeer.on('open', (userId) => {
  const hangUpButton = document.createElement('button')
  hangUpButton.innerText = 'Hangup'
  callControls.append(hangUpButton)
  socket.emit('join-room', ROOM_ID, userId)
  hangUpButton.addEventListener('click', () => {
    socket.close()
  })
})

const addVideoStream = (video, stream, userId) => {
  if (connectedUsers.has(userId)) {
    return
  }
  connectedUsers.add(userId)
  video.srcObject = stream
  video.addEventListener('canplay', () => {
    video.play()
  })
  videoGrid.append(video)
  const userName = document.createElement('li')
  userName.innerText = userId
  userName.id = userId
  connectedUsersList.append(userName)
}

const removeVideoStream = (video, userId) => {
  document.getElementById(userId).remove()
  video.remove()
  connectedUsers.delete(userId)
}
