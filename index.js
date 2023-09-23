const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

let intervalId;
let timestamp = 0;

const audioDuration = 0; // audio file duration

// read initial timestamp from the file
fs.readFile('timestamp.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    timestamp = parseInt(data);
  }
});

// function to update the timestamp
function updateTimestamp() {
  timestamp += 1;
  if (timestamp >= audioDuration) {
    timestamp = 0;
  }
  fs.writeFile('timestamp.txt', timestamp.toString(), (err) => {
    if (err) {
      console.error(err);
    }
  });
}

// static file serving
app.use(express.static(__dirname));

// serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// start the counter since the first play
app.post('/start-counter', (req, res) => {
  if (!intervalId) {
    intervalId = setInterval(updateTimestamp, 1000);
  }
  res.sendStatus(200);
});

// read the timestamp
app.get('/timestamp', (req, res) => {
  res.send(String(timestamp));
});

// serve audio file
app.get('/audio', (req, res) => {
  res.sendFile(__dirname + '/music.mp3');
});

// start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
