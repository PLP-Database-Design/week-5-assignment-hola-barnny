const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

app.use(express.json());
app.use(cors());
dotenv.config();

// This set of Codes helps create a connection to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,  
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// This checks if there is a connection to the database
db.connect((err) => {
    if (err) {
        return console.error("Error connecting to MySQL:", err);
    }
    console.log("Connected to MySQL as id:", db.threadId);
});
// Root end point
app.get('/', (req, res) => {
  res.render('index'); 
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving patients data');
        }
        res.render('patients', { results: results });
    });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving providers data');
        }
        res.render('providers', { results: results });
    });
});

// 3. Filter patients by First Name
app.get('/patients/filter', (req, res) => {
    const firstName = req.query.first_name;  // Use params instead of query
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?', [firstName], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving filtered patients data');
        }
        res.render('patients', { results: results });
    });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty', (req, res) => {
    const specialty = req.params.specialty;  // Use params instead of query
    db.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving filtered providers data');
        }
        res.render('providers', { results: results });
    });
});

// Define PORT
const PORT = process.env.PORT || 3300;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


