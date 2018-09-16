/* All required import for api construction */
const express = require('express');
const bodyParser = require('body-parser');
const io = require('socket.io');
const mongoose = require('mongoose');
const dbConnect = require('./dbconnect');
/* *************************************************** */

/* Mongoose setup */
const db = dbConnect;
mongoose.Promise = global.Promise;

mongoose.connect(db, {
    useNewUrlParser: true
}, err => {
    (err) ? console.log('err in connection' + err): console.log('db connected')
});

/* ***************************************************** */

/* Express + Socket API setup */
const app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', "POST, GET, PATCH, DELETE, OPTIONS");
    next();
});

app.get('/getRealtime', (req, res) => {res.status(200).json({msg: 'get recd'})});
app.post('/postRealtime', (req, res) => {res.status(200).json({msg: 'post recd'})});
app.put('/putRealtime', (req, res) => {res.status(200).json({msg: 'put recd'})});
app.delete('/delRealtime', (req, res) => {res.status(200).json({msg: 'del recd'})});

/* ***************************************************************************************** */

/* Server listen */
app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running');
  });