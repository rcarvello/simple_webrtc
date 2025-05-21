# WebRTC Room-Based 1-to-1 App

## Features
- Bootstrap UI
- WebRTC 1-to-1 video calling
- Users connect by joining a room
- Uses Node.js WebSocket signaling server

## Setup

1. Run the signaling server:

```bash
node server.js
```

2. Serve `index.html` and `client.js` using a static web server (or NGINX).

3. Make sure your WebSocket is exposed via WSS (see reverse proxy config below).

## NGINX Reverse Proxy (for WSS)

```
server {
  listen 443 ssl;
  server_name yourdomain.com;

  location /ws {
    proxy_pass http://localhost:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
  }
}
```

## Use Case
- Alice enters room name "chat123" and clicks Join
- Bob also enters "chat123" and joins
- A direct peer-to-peer WebRTC connection is established between them
