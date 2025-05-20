let localStream;
let peerConnection;
let peerId;
let myName = prompt("Enter your name:") || "guest_" + Math.floor(Math.random() * 10000);
const signalingServer = new WebSocket("wss://" + location.hostname + "/ws");

signalingServer.onopen = () => {
  signalingServer.send(JSON.stringify({ type: "register", name: myName }));
};

signalingServer.onmessage = async (msg) => {
  const data = JSON.parse(msg.data);
  if (data.type === "registered") {
    document.getElementById("myId").textContent = "Your ID: " + myName;
  } else if (data.type === "offer") {
    peerId = data.from;
    await createPeerConnection();
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.payload));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    signalingServer.send(JSON.stringify({ type: "answer", payload: answer, to: data.from }));
  } else if (data.type === "answer") {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.payload));
  } else if (data.type === "ice-candidate") {
    if (data.payload) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.payload));
    }
  }
};

async function createPeerConnection() {
  peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:your-vps-ip:3478" }]
  });

  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  peerConnection.ontrack = event => {
    remoteVideo.srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = e => {
    if (e.candidate) {
      signalingServer.send(JSON.stringify({ type: "ice-candidate", payload: e.candidate, to: peerId }));
    }
  };
}

document.getElementById("startButton").onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;
};

document.getElementById("callButton").onclick = async () => {
  peerId = document.getElementById("peerIdInput").value.trim();
  if (!peerId) return alert("Please enter a peer name.");
  await createPeerConnection();
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  signalingServer.send(JSON.stringify({ type: "offer", payload: offer, to: peerId }));
};

document.getElementById("hangupButton").onclick = () => {
  peerConnection?.close();
};