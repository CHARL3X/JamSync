const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Store active rooms
const rooms = new Map();

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/syncjam', (req, res) => {
    res.sendFile(path.join(__dirname, 'syncjam.html'));
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// HTTP fallback signaling endpoints
app.use(express.json());

app.post('/api/signal', (req, res) => {
    const { room, type, data } = req.body;
    console.log(`HTTP Signal: ${type} for room: ${room}`);
    
    // Store signal temporarily (in production use Redis)
    if (!global.httpSignals) global.httpSignals = new Map();
    if (!global.httpSignals.has(room)) {
        global.httpSignals.set(room, []);
    }
    
    global.httpSignals.get(room).push({
        type,
        data,
        timestamp: Date.now()
    });
    
    // Keep only recent signals (last 30 seconds)
    const signals = global.httpSignals.get(room);
    global.httpSignals.set(room, signals.filter(s => Date.now() - s.timestamp < 30000));
    
    res.json({ success: true });
});

app.get('/api/signal/:room', (req, res) => {
    const room = req.params.room;
    const since = parseInt(req.query.since) || 0;
    
    if (!global.httpSignals || !global.httpSignals.has(room)) {
        return res.json({ signals: [] });
    }
    
    const signals = global.httpSignals.get(room).filter(s => s.timestamp > since);
    res.json({ signals });
});

// Catch all route - serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// WebSocket signaling server
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received:', data.type, 'for room:', data.room);
            
            switch (data.type) {
                case 'join':
                    // Add client to room
                    if (!rooms.has(data.room)) {
                        rooms.set(data.room, new Set());
                    }
                    rooms.get(data.room).add(ws);
                    ws.room = data.room;
                    
                    // Send room info to the joining client
                    ws.send(JSON.stringify({
                        type: 'room-joined',
                        room: data.room,
                        participantCount: rooms.get(data.room).size
                    }));
                    
                    // Notify others in room
                    broadcast(data.room, ws, {
                        type: 'peer-joined',
                        room: data.room,
                        participantCount: rooms.get(data.room).size
                    });
                    
                    // Update participant count for everyone
                    broadcastToRoom(data.room, {
                        type: 'participant-update',
                        count: rooms.get(data.room).size
                    });
                    break;
                    
                case 'offer':
                case 'answer':
                case 'ice-candidate':
                    // Relay to other peer in room
                    broadcast(data.room, ws, data);
                    break;
                    
                case 'leave':
                    leaveRoom(ws);
                    break;
            }
        } catch (error) {
            console.error('WebSocket error:', error);
        }
    });
    
    ws.on('close', () => {
        leaveRoom(ws);
    });
});

function broadcast(room, sender, data) {
    if (!rooms.has(room)) return;
    
    rooms.get(room).forEach(client => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function broadcastToRoom(room, data) {
    if (!rooms.has(room)) return;
    
    rooms.get(room).forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function leaveRoom(ws) {
    if (ws.room && rooms.has(ws.room)) {
        rooms.get(ws.room).delete(ws);
        broadcast(ws.room, ws, {
            type: 'peer-left',
            room: ws.room
        });
        
        // Update participant count
        broadcastToRoom(ws.room, {
            type: 'participant-update',
            count: rooms.get(ws.room).size
        });
        
        // Clean up empty rooms
        if (rooms.get(ws.room).size === 0) {
            rooms.delete(ws.room);
        }
    }
}

server.listen(PORT, () => {
    console.log(`🎸 SyncJam server running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
});