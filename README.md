# 🎸 SyncJam - Remote Music Collaboration

Perfect synchronization for remote music jamming sessions using WebRTC and an innovative "agreed upon latency" approach.

## 🚀 Quick Start

1. Visit the deployed app
2. Create a room
3. Share the room link with your jam partner
4. Both click "Start Jamming"
5. **Use headphones!**

## 🎯 How It Works

Instead of fighting network latency, SyncJam embraces it. Both players agree to hear ALL audio (including their own) with the same delay, creating a synchronized "temporal meeting point" where everything aligns perfectly.

## 🛠️ Tech Stack

- Pure JavaScript WebRTC implementation
- Web Audio API for precise timing
- Express.js server with WebSocket support
- Real-time network monitoring via DataChannel
- HTTP fallback signaling for reliability

## 📱 Features

- **Agreed Upon Latency**: Both players share the same delay
- **Adaptive Buffer**: Real-time recommendations based on network jitter
- **Visual Meters**: See audio levels in real-time
- **Network Stats**: Monitor ping, jitter, and sync quality in real-time
- **One-Click Sharing**: Easy room creation and URL sharing
- **Dual Signaling**: WebSocket with HTTP fallback for reliability
- **iOS Compatible**: Works on mobile Safari with touch activation
- **Mic Testing**: Pre-connection audio verification

## 🏃‍♂️ Local Development

```bash
npm install
npm start
# Visit http://localhost:3000
```

## 📄 License

MIT - Jam freely!

---

Created by Charles Tobin | [charlestobin.com](https://charlestobin.com)