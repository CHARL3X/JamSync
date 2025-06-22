const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
    console.log(`🎸 SyncJam server running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
});