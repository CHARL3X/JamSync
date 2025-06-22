const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/syncjam', (req, res) => {
    res.sendFile(path.join(__dirname, 'syncjam.html'));
});

// Catch all route - redirect to main page
app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`🎸 SyncJam server running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
});