var express = require('express');
var router = express.Router();


var projectController = require('./controllers/projectController');
var mailer = require('./sendmail');
var businessAnalystController = require('./controllers/businessAnalystController');
var clientController = require('./controllers/clientController');

router.get('/clientProject', projectController.clientProjectHome);
router.get('/baProject', projectController.baProjectHome);
//router.get('/baHome', projectController.getProjectDiagrams);
router.get('/ba', businessAnalystController.home);
router.get('/client', clientController.home);
router.get('/sendEmail', projectController.inviteClient);
router.get('/clientInvitation', projectController.handleClientInvitationLink)
//router.get('/baInvitation', projectController.handlebaInvitationLink)
module.exports = router;