const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const uuid4 = require('uuid4');
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

const entrySchema = mongoose.Schema({
    date: { type: Date, default: Date.now },
    uuid: { type: String, required: true },
    data: { type: String, required: true }
});

const  Entry = mongoose.model('Entry', entrySchema);

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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}



function getRandomName(n_length) {
  let nameList = [
    "bob",
    "mary",
    "jack",
    "sue",
    "john",
    "kelly"
  ];
  let index = getRandomInt(0, nameList.length - 1);
  let name = nameList[index]
  for (let i = 0; i < n_length - 1; i++) {
    index = getRandomInt(0, nameList.length - 1);
    name = name + "-" + nameList[index]
  }
  return name;
}

function postAnEntry(id,res){
  var data = getRandomName(5);
  const entry = new Entry({
    uuid: id,
    data: data
  });
  entry.save()
  .then(result => {
    console.log('result ', result)
    updateAnEntry(id,res);
  })
  .catch(err => {
    console.log('error', err)
  });
}

function updateAnEntry(uuid,res){
  let data = getRandomName(5);
  let entry = {
    uuid: uuid,
    data: data
  };
  Entry.updateOne({uuid: uuid}, entry)
  .then(result => {
    if (result.n > 0) {
      console.log(uuid + ' updated');
      deleteAnEntry(uuid,res);
    }else{
      console.log(uuid + ' not updated ', result);
    }
  })
  .catch(error => {
      console.log('db update failed', error);
  });
}

function deleteAnEntry(uuid,res){
  Entry.deleteOne({uuid: uuid})
  .then(result => {
    if (result.n > 0) {
      elapsed = process.hrtime(start)[1] / 1000000;
      res.status(200).json({"message":"Success","elapsed": elapsed});
      console.log(uuid + ' deleted');
    }else{
      console.log(uuid + ' not deleted ', result);
    }
  })
  .catch(error => {
      console.log('db deleted failed', error);
  });
}

app.post('/api/entry', (req, res, next) => {
  start = process.hrtime();
  // Create entries
  let id = uuid4();
  postAnEntry(id,res);
  //for (let i = 0; i < req.body.numberEntries; i++){
  //  let id = uuid4();
  //  console.log("Entry " + i);
  //  postAnEntry(id,res);
  //}



  //Delete entries
});

module.exports = app;
