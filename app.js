const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');


const dbPath = './db.json';

// Create an initial empty JSON file if it doesn't exist
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ mails: [] }));
}

app.post('/inbox', (req, res) => {
    const mailData = req.body;
    console.log('Mail Data Received:', mailData);

    // Read current data from the JSON file
    const jsonData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // Add new mail data to existing array
    jsonData.mails.push(mailData);

    // Write updated data back to the JSON file
    fs.writeFileSync(dbPath, JSON.stringify(jsonData, null, 2));

    res.json({ message: 'Mail received and processed successfully' });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

// Example route handlers
app.get('/', (req, res) => {
    res.render('portfolio');
});

app.get('/allmails', (req, res) => {
    const jsonData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    res.json(jsonData.mails);
});

app.get('/mail/:id', (req, res) => {
    const { id } = req.params;
    const jsonData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const mail = jsonData.mails.find(mail => mail.id === id);
    if (mail) {
        res.json(mail);
    } else {
        res.status(404).json({ error: 'Email not found' });
    }
});
