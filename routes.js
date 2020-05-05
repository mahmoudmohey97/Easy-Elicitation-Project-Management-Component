var express = require('express');
var router = express.Router();


var projectController = require('./controllers/projectController');
var businessAnalystController = require('./controllers/businessAnalystController');
var clientController = require('./controllers/clientController');

//router.get('/', projectController.home);
router.get('/ba', businessAnalystController.home);
router.get('/client', clientController.home);

module.exports = router;