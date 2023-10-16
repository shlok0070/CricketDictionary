const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors()); 
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root',      
    password: 'nodecomplete1',      
    database: 'node-complete'  
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Add new player
app.post('/players', (req, res) => {
    const { name, team, role, batting_average, bowling_average, image_url } = req.body;
    const query = `INSERT INTO cricket_players (name, team, role, batting_average, bowling_average, image_url) VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(query, [name, team, role, batting_average, bowling_average, image_url], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: 'Player added successfully', player: req.body });
    });
});



// Update player
app.put('/players/:id', (req, res) => {
    const { id } = req.params;
    const { name, team, role, batting_average, bowling_average, image_url } = req.body;
    const query = `UPDATE cricket_players SET name = ?, team = ?, role = ?, batting_average = ?, bowling_average = ?, image_url = ? WHERE id = ?`;

    connection.query(query, [name, team, role, batting_average, bowling_average, image_url, id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: 'Player updated successfully', player: req.body });
    });
});




// Fetch all players
app.get('/players', (req, res) => {
    connection.query('SELECT * FROM cricket_players', (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
});

// Search for players
app.get('/players/search', (req, res) => {
    const name = req.query.name;
    const query = 'SELECT * FROM cricket_players WHERE name LIKE ?';
    connection.query(query, [`%${name}%`], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
});

// Fetch a single player
app.get('/players/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM cricket_players WHERE id = ?';

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching player by ID:', err);
            return res.status(500).json({ message: 'Error fetching player by ID', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Player not found' });
        }

        res.status(200).json(results[0]);  
    });
});


// Serve the HTML file for any other route including root
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = 3000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
