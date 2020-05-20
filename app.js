const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const router = require('./routes');
const port = process.env.port || 3000;


mongoose.connect('mongodb://localhost/testForAuth',{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
const db = mongoose.connection;

db.on('error', console.log.bind(console, 'connection error:'));
db.once('open', () => {
    //we're connected!
})

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/templateLogin'));
app.use(router)

app.use((req, res, next) =>{
    const err = new Error('File not found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) =>{
    res.status(err.status || 500);
    res.send(err.message);
});

app.get('/', function (req, res, next){
    return res.sendFile(path.join(__dirname + '/templete/index.html'));
})

app.listen(port, () => {
    console.log(`Server listen on port ${port}...`);
});
