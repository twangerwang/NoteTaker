// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid = require('./public/assets/js/uuid.js');
const app = express();

const PORT = process.env.PORT || 3003;

//promisifying fs.readFile and fs.appendFile
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//defining JSON file route
const dbPath = path.join(__dirname, './db/db.json');

//middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

//creating HTML routes
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

//creating API routes
app.get('/api/notes', (req, res) => {
  readFileAsync(dbPath, 'utf8').then((notes) => {
    return res.json(JSON.parse(notes));
  });
});

app.post('/api/notes', (req, res) => {
  readFileAsync(dbPath, 'utf8').then((data) => {
    const newNote = req.body;
    newNote.id = uuid();
    let notes = JSON.parse(data);
    notes.push(newNote);
    writeFileAsync(dbPath, JSON.stringify(notes,null,'\t')).then(() => {
      return res.json(notes);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  readFileAsync(dbPath, 'utf8').then((data) => {
    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.id !== req.params.id);
    writeFileAsync(dbPath, JSON.stringify(notes)).then(() => {
      return res.json(notes);
    });
  });
});

//initializes the server to begin listening
app.listen(PORT, function () {
  console.log(`App listening on PORT ${PORT}`);
});


