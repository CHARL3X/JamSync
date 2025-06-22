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
- Express.js server for deployment
- Real-time network monitoring

## 📱 Features

- **Agreed Upon Latency**: Both players share the same delay
- **Adaptive Buffer**: Automatically adjusts for network conditions
- **Visual Meters**: See audio levels in real-time
- **Network Stats**: Monitor ping, jitter, and sync quality
- **One-Click Sharing**: Easy room creation and URL sharing

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