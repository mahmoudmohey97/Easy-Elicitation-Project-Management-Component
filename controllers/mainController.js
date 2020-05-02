const model = require('../models/model');


module.exports = function (app) {
    app.get('/', function (req, res) {		
        res.render('home');
    });
};
