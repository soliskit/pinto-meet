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
  socket = io(`http://${HOST}`, socketOptions)
}
class PeerCall {
  constructor(peerId, call) {
    this.peerId = peerId
    this.call = call
  }
  getId() {
    return this.peerId
  }
}
const videoGrid = document.getElementById('video-grid')
const connectedUsersList = document.getElementById('connected-users')
const callControls = document.getElementById('call-controls')
const localPeer = new Peer(undefined, peerOptions)
const localVideo = document.createElement('video')
localVideo.muted = true
let peerCalls = new Set()
const connectedUsers = new Set()

function addCallToPeers(userId, call) {
  const remoteVideo = document.createElement('video')
  call.on('stream', (remoteStream) => {
    addVideoStream(remoteVideo, remoteStream, userId)
  })
  call.on('close', () => {
    removeVideoStream(remoteVideo, userId)
  })
  const peer = new PeerCall(userId, call)
  peerCalls.add(peer)
}

function removeCallFromPeersByUserId(userId) {
  let removedPeer
  const calls = new Set()
  const remainingPeers = new Set()

  const unique = (value, set) => {
    if (!calls.has(value.peerId)) {
      calls.add(value.peerId)
      remainingPeers.add({ peerId: value.peerId, call: value.call })
      if (value.peerId === userId) {
        removedPeer = value
        removedPeer.call.close()
        remainingPeers.delete(removedPeer)
      }
    }
  }
  peerCalls.forEach(unique)
  peerCalls = remainingPeers
}

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true
  })
  .then((localStream) => {
    addVideoStream(localVideo, localStream, localPeer.id)

    localPeer.on('call', (call) => {
      const userId = call.peer
      call.answer(localStream)
      addCallToPeers(userId, call)
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
  })

socket.on('user-disconnected', (userId) => {
  const staleAnswerButton = document.getElementById('answer' + userId)
  if (staleAnswerButton) {
    staleAnswerButton.remove()
  }
  removeCallFromPeersByUserId(userId)
})

localPeer.on('open', (id) => {
  const hangUpButton = document.createElement('button')
  hangUpButton.innerText = 'Hangup'
  callControls.append(hangUpButton)
  hangUpButton.addEventListener('click', () => {
    socket.disconnect()
  })
  socket.emit('join-room', ROOM_ID, id)
})

function addVideoStream(video, stream, userId) {
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

function removeVideoStream(video, userId) {
  document.getElementById(userId).remove()
  video.remove()
  connectedUsers.delete(userId)
}
