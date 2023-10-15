const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'nodecomplete1',
    database: 'node-complete'
});

connection.connect();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/players', (req, res) => {
    connection.query('SELECT * FROM cricket_players', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});



app.post('/players', (req, res) => {
    const { name, team, role, batting_average, bowling_average } = req.body;
    const query = `INSERT INTO cricket_players (name, team, role, batting_average, bowling_average) VALUES (?, ?, ?, ?, ?)`;
    
    connection.query(query, [name, team, role, batting_average, bowling_average], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Player added successfully', player: req.body });
    });
});


app.get('/players/search', (req, res) => {
    const name = req.query.name;
    const query = `SELECT * FROM cricket_players WHERE name LIKE ?`;

    connection.query(query, ['%' + name + '%'], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});



app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
