# Introduction to WebRTC

**WebRTC (Web Real-Time Communication)** is a technology that allows web applications to establish peer-to-peer communication directly in the browser without plugins. It supports video, audio, and data sharing between users.

## Key Components

### 1. STUN Server
A **STUN (Session Traversal Utilities for NAT)** server helps a device discover its public IP address and port behind a NAT (Network Address Translation). This is essential for two devices to find a way to connect directly.

- WebRTC uses STUN to set up a peer-to-peer connection.
- Google provides a free STUN server: `stun:stun.l.google.com:19302`.

### 2. Signaling Server
A **Signaling Server** is responsible for:
- Exchanging metadata between peers such as offer/answer and ICE candidates
- Coordinating the call setup process

In this app, we use a **WebSocket server written in Node.js** to handle signaling.

## Flow Diagram

```
+-------------+        WebSocket (Signaling)        +-------------+
|   Browser A | <---------------------------------> |   Browser B |
+-------------+                                     +-------------+
      |                                                    |
      |          STUN Discovery (Get Public IP)            |
      +----------------------> STUN Server <---------------+
      |                                                    |
      |         ICE Candidates / SDP Exchange via WS       |
      +--------------------------------------------------->|
      |<---------------------------------------------------+
      |                                                    |
      |         Peer-to-Peer Media Stream (WebRTC)         |
      +====================================================+
```

## Summary
- **STUN**: Helps discover public address for NAT traversal.
- **Signaling**: Uses a WebSocket server to exchange connection setup info.
- **WebRTC**: Establishes direct video/audio connection between browsers.
