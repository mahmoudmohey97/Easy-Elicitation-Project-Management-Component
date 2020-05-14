const model = require('../models/project');
const sendMailModel = require('../sendmail');
const encryptModel = require('../models/encrypt_decrypt')
const clientModel = require('../models/client')

module.exports.clientProjectHome = function (req, res) {

    console.log(`id = ${req.session.cid}`);
    if (!req.session.cid) {
        res.render('erros/404')
    }
    else {
        model.getProjectClients(req.query.pid, function (results) {

            res.render('project/clientHome');
        });
    }

};

module.exports.baProjectHome = function (req, res) {
    console.log(`id = ${req.session.baid}`);
    if (!req.session.baid) {
        res.render('erros/404')
    }
    else {
        model.getProjectBa(req.query.pid, function(baParticipants) {
            model.getProjectClients(req.query.pid, function(clientsParticipants){
                model.showProjectDiagrams(req, function(projectDiagrams){
                    res.render('project/projectHome', {diagrams : projectDiagrams , businessAnalysts : baParticipants, clients : clientsParticipants });
                    console.log(12);
                });
            });
        });
    }
};

module.exports.inviteClient = function (req, res) {
    model.getProjectByBaAndName(req.session.baid, req.query.name, function (result) {
        encryptModel.encrypt(req.query.mail, function (encryptedMail) {
            mail = encryptedMail;
            var link = "http://localhost:3000/clientInvitation?id=" + result[0].projectId + "&dt=" + parseInt(Date.now() / 1000) + "&to=" + mail;
            sendMailModel.invite(req.query.mail, req.query.name, link);
        })
    });
}

module.exports.handleClientInvitationLink = function (req, res) {
    req.session.cid = 2;
    if (req.session.cid) {
        var urlMail = req.query.to;
        var currentUserMail = '';
        encryptModel.decrypt(urlMail, function (decryptedMail) {
            urlMail = decryptedMail;
            clientModel.getClientById(req.session.cid, function (client) {
                currentUserMail = client.email;
                if (urlMail === currentUserMail) {

                    var time = req.query.dt;
                    //console.log(parseInt(Date.now() / 100));

                    if (parseInt(Date.now() / 1000) <= parseInt(time) + 2 * 60) {
                        model.clientInvitation(req.session.cid, req.query.id, function (result) {
                            res.render('client/home', { data: [] });
                        });
                    }
                    else {

                        res.render('invitation expired');
                    }
                }
                else {

                    console.log('u are not authorized :) ');
                }
            });
        });
    }
    else {
        // el awl Login
        // redirect 3la el funtion de
        res.render("errors/404")
    }
}


/*
    - Invite

*/