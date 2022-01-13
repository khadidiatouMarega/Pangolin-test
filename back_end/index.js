var express=require("express"); 
var bodyParser=require("body-parser"); 
var morgan = require('morgan');
const cors = require('cors');
const db = require('./db');
require("dotenv").config();
const app=express() 

const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const friendRoute = require('./routes/friend');

app.use(morgan('dev'))

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ 
    extended: true
})); 
app.use(express.json());

app.use('/api', authRoute, postRoute, friendRoute)

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
app.listen(4242, () => {
    console.log('Serveur on listening on port 4242')
});
    