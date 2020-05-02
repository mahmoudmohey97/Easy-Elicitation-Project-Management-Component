const mainController = require('./controllers/mainController');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.set('view engine', 'ejs');
app.use(function (req, res, next) {
    next();
});

//static files
app.use(express.static('./public'));

mainController(app);

// handle 404
app.use(function (req, res, next) {
    res.status(404);
    res.render('404', { url: req.url });
});

app.listen(3000);
console.log(`Running on ${3000}`);