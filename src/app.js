const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
require('dotenv').config();

mongoose.connect(
  'mongodb+srv://mongouser:' +
  process.env.MONGO_ATLAS_PW +
  '@cluster0-zbbim.mongodb.net/performance-testing?retryWrites=true'
  )
  .then(() => {
    console.log('Connected to Mongodb');
  })
  .catch(() => {
    console.log('MongoDB connection failed!');
});

const piSchema = mongoose.Schema({
    date: { type: Date, default: Date.now },
    place: { type: Number, required: true },
    result: { type: String, required: true }
});

const PiEntry = mongoose.model('PiEntry', piSchema);

function addEntry(place) {
    var itWorked = false;

}

app.get('/', (req, res, next) => {
  res.status(200).json({"message":"hello"})
  //addEntry(place,res);
});

var start = process.hrtime();

var elapsed_time = function(note){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
    start = process.hrtime(); // reset the timer
}
app.post('/api/entry', (req, res, next) => {
  start = process.hrtime();
  let result = Math.PI.toFixed(req.body.place);
  const entry = new PiEntry({
    place: req.body.place,
    result: result
  });
  entry.save()
  .then(result => {
    console.log('result ', result)
    elapsed = process.hrtime(start)[1] / 1000000;
    console.log
    res.status(200).json({"message":"Success","elapsed": elapsed});
  })
  .catch(err => {
    console.log('error', err)
    res.status(500).json({"message":"Failure"});
  });
});

module.exports = app;
