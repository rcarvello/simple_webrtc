# Real-time communication technologies classification
A classification of key **real-time communication technologies** (including those enabling WebRTC) 
from the **1980s to now**, grouped in 10-year periods. 
This includes networking, VoIP, codecs, protocols, and browser technologies 
that laid the foundation for WebRTC.

---

### **1980s** – *Foundations of Network Communication*

* **TCP/IP standardization (1983)**: Foundation of all internet protocols.
* **UDP (User Datagram Protocol)**: Crucial for real-time communication (used in WebRTC).
* **ISDN (Integrated Services Digital Network)**: Early digital phone and video data over PSTN.
* **H.261 (1988)**: First practical video codec for video conferencing.

---

### **1990s** – *Early VoIP and Streaming*

* **VoIP emerges (mid-1990s)**: Internet-based voice, with tools like VocalTec Internet Phone.
* **H.323 protocol (1996)**: ITU standard for multimedia communication over IP.
* **RTP/RTCP (Real-Time Protocols)**: Basis for streaming media over IP networks.
* **SIP (Session Initiation Protocol, 1999)**: Used to initiate/manage VoIP sessions.

---

### **2000s** – *Rise of Web & Streaming Platforms*

* **Flash & RTMP (2002+)**: Real-time streaming (though proprietary, widely used).
* **XMPP (Jabber protocol)**: Messaging and signaling protocol later extended for VoIP (Jingle).
* **Skype (2003)**: Pioneered P2P voice/video globally.
* **STUN (2003)**: Protocol to traverse NATs for peer connections.
* **TURN (2007)**: For relaying traffic when P2P fails.
* **ICE (Interactive Connectivity Establishment, 2005-2007)**: Combines STUN and TURN to establish peer connections.

---

### **2010s** – *WebRTC Era Begins*

* **WebRTC announced (2011 by Google)**: Built-in browser support for voice, video, and data.
* **HTML5 + JavaScript APIs**: Enabled full client-side real-time communication.
* **Major browser support**:

  * Chrome (2011), Firefox (2012), Opera (2013), Safari (2017)
* **Signaling via WebSockets**: Became popular as a lightweight signaling method.
* **Adoption of VP8/VP9, Opus**: Efficient codecs for browser-based media.

---

### **2020s** – *WebRTC Maturity and Expansion*

* **Widespread WebRTC adoption**: Zoom, Google Meet, Teams use WebRTC backend.
* **End-to-end encryption (E2EE) in WebRTC**
* **Insertable Streams API**: Allows media encryption & manipulation.
* **SFU/MCU deployment**: Multi-user conferencing with scalability (e.g., mediasoup, Janus, Jitsi).
* **WebTransport & WebCodecs APIs**: Low-latency alternatives and enhanced streaming control.

---

### Summary by Decade:

| Decade | Key Milestones                      |
| ------ | ----------------------------------- |
| 1980s  | TCP/IP, ISDN, H.261                 |
| 1990s  | SIP, H.323, RTP, early VoIP         |
| 2000s  | Skype, STUN/TURN, Flash RTMP        |
| 2010s  | WebRTC, HTML5 APIs, WebSockets      |
| 2020s  | E2EE WebRTC, SFU scaling, WebCodecs |

Would you like this as a visual timeline or included in the ZIP too?
