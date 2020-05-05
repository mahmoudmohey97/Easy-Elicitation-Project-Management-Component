const bodyParser = require('body-parser');
var router = require('./routes');
const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({cookieName: 'session', secret:'$0_$3cR37_K3Y'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// View Engine..  Extension
app.set('view engine', 'ejs');

// Routes Handler
app.use('/',router); 

//static files
app.use(express.static('./public'));



// handle 404
app.use(function (req, res, next) {
    res.status(404);
    res.render('errors/404', { url: req.url });
});


app.listen(3000);
console.log(`Running on ${3000}`);
