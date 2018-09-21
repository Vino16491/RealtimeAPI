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
    });

    socket.on('msgHistory', ()=>{
        console.log('msghistory')
        Data.find().exec((err, msg)=>{
            
            if(err){
                return io.emit('msgHistory', err)
            }
            return io.emit('msgHistory', msg)
        })
    })

    socket.on('dataSave', (data)=>{
        let socketData = new Data({
            data: data
        });
        socketData.save((err, result)=>{
            if(err){
                return io.emit('datainput', err)
            }
            return io.emit('datainput', result.data)
        })
    })
    socket.on('datainput',(msg)=>{
        console.log(msg);
        return io.emit('datainput', 'from server')
    })
})


/* *************************************** */

/* Server listen */
http.listen(process.env.PORT || 4000, function () {
    console.log('Your node js server is running');
});
