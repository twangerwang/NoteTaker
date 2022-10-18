const express = require('express');
const path = require('path');
const dbData = require('./db/db.json');
const fs = require('fs');

const PORT = 3001;
const app = express();


app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => res.json(dbData));

app.post('/api/notes', (req, res) => {
    res.json(`${req.method} request received`);
})

app.get('/*', (req,res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);



app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`)
);