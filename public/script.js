
// lets you get the video and audio from Chrome
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3030'
});

let myStream;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myStream = stream;
  addStream(myVideo, stream);

  peer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', (userId) => {
    connectUser(userId, stream);
  })
})

peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id);
})

const connectUser = (userId, stream) => {
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addStream(video, userVideoStream)
  })
}

const addStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(video)
}