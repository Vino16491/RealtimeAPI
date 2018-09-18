/* All required import for api construction */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app)
const io = require('socket.io')(http);
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


const Schema = mongoose.Schema;
const dataSchema = new Schema({
    data: Object
});

const Data = mongoose.model('data', dataSchema, "realtime");
/* ***************************************************** */

/* Express + Socket API setup */
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
/* Get Request */
/* File to test socket */
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/getRealtime', (req, res) => {

    res.status(200).json({
        msg: 'get recd'
    })
});
/* Post Request */
app.post('/postRealtime', (req, res) => {
    let data = new Data({
        data: {
            msg: req.body.content,
            date: new Date()
        }
    })

    data.save((err, result) => {
        if (err) {
            return res.status(500).json({
                e: err
            })
        }
        res.status(201).json({
            msg: result
        })
    })
    // res.status(200).json({
    //     msg: 'post recd'
    // })
});
/* PUT Request  */
app.put('/putRealtime', (req, res) => {
    res.status(200).json({
        msg: 'put recd'
    })
});
/* Delete Request */
app.delete('/delRealtime', (req, res) => {
    res.status(200).json({
        msg: 'del recd'
    })
});

/* ***************************************************************************************** */

/* Socket Updates */
io.on('connection', (socket) => {
    console.log('socket connected')
    socket.on('msg', (msg) => {
        let socketData = new Data({
            data: msg
        });

        socketData.save((err, result) => {
            if (err) {
                return io.emit('msgErr', err)
            }
            return io.emit('msg', result);
        })
    })
})


/* *************************************** */

/* Server listen */
http.listen(process.env.PORT || 4000, function () {
    console.log('Your node js server is running');
});

// http.listen(2000, ()=>console.log('listen on 2000'))