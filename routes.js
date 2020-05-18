var express = require('express');
var router = express.Router();


var projectController = require('./controllers/projectController');
var mailer = require('./sendmail');
var businessAnalystController = require('./controllers/businessAnalystController');
var clientController = require('./controllers/clientController');

router.get('/project', projectController.projectHome);
router.post('/createProject', projectController.createProject);
//router.get('/up', projectController.send);
router.post('/upload', projectController.uploadFile);
router.post('/createDiagram', projectController.createDiagram);
router.get('/ba', businessAnalystController.home);
router.get('/client', clientController.home);
router.get('/sendEmail', projectController.inviteClient);
router.post('/sendEmailToBA', projectController.inviteBA);
router.get('/clientInvitation', projectController.handleClientInvitationLink);
router.get('/baInvitation', projectController.handleBAInvitationLink);
router.get('/getBasInCompany', businessAnalystController.getBAsInMyCompany);
router.get('/getBasNotInProject', projectController.getBAsNotInProject);
router.get('/leaveProject', projectController.leaveProject);
//router.get('/baInvitation', projectController.handlebaInvitationLink)
module.exports = router;