// Import necessary modules
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();
const port = 3000;

// Middleware for enabling CORS
app.use(cors());

// Middleware for serving static files from the 'public' directory
app.use(express.static('public'));

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Define a GET route for the root URL '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define the POST route for logging the data
app.post('/log', (req, res) => {
    const logData = req.body;

    // Extract session ID from the request
    const sessionId = logData.sessionId;

    // Construct the log entry with session ID
    const logEntry = `${logData.siteAccessTime},${logData.action},${logData.responseTime},${logData.modalTag},${sessionId}\n`;

    // Append log entry to logs.csv file
    fs.appendFile('logs.csv', logEntry, err => {
        if (err) {
            console.error('Failed to write to log file', err);
            res.status(500).send('Error logging data');
        } else {
            console.log('Data logged successfully');
            res.status(200).send('Data logged successfully');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
