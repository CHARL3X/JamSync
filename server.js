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
                    
                    // Notify others in room
                    broadcast(data.room, ws, {
                        type: 'peer-joined',
                        room: data.room
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

function leaveRoom(ws) {
    if (ws.room && rooms.has(ws.room)) {
        rooms.get(ws.room).delete(ws);
        broadcast(ws.room, ws, {
            type: 'peer-left',
            room: ws.room
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