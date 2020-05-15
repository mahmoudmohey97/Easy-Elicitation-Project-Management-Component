const model = require('../models/project');
const sendMailModel = require('../sendmail');
const encryptModel = require('../models/encrypt_decrypt')
const clientModel = require('../models/client')
const businessAnalystModel = require('../models/businessAnalyst')


module.exports.projectHome = function (req, res) {
    //console.log(`id = ${req.session.baid}`);
    if (req.session.baid || req.session.cid) {
        model.getProjectBa(req.query.pid, function (baParticipants) {
            model.getProjectClients(req.query.pid, function (clientsParticipants) {
                model.showProjectDiagrams(req, function (projectDiagrams) {
                    req.query = {pid : req.query.pid}
                    model.getProjectOwner(req.query.pid, function (owner) {
                        var ba = (!req.session.baid) ? false : true;
                        res.render('project/projectHome', {
                            auth: ba, diagrams: projectDiagrams, businessAnalysts: baParticipants,
                            clients: clientsParticipants, owner: { email: owner.email, name: owner.name }
                        });
                    });
                });
            });
        });
    }
    else {
        res.render('erros/404')
    }
};

module.exports.inviteClient = function (req, res) {
    model.getProjectByBaAndName(req.session.baid, req.query.name, function (result) {
        encryptModel.encrypt(req.query.mail, function (encryptedMail) {
            mail = encryptedMail;
            var link = "http://localhost:3000/clientInvitation?pid=" + result[0].projectId + "&dt=" + parseInt(Date.now() / 1000) + "&to=" + mail;
            sendMailModel.invite(req.query.mail, req.query.name, link);
        })
    });
}

module.exports.handleClientInvitationLink = function (req, res) {
    req.session.cid = 3;
    if (req.session.cid) {
        var urlMail = req.query.to;
        var currentUserMail = '';
        encryptModel.decrypt(urlMail, function (decryptedMail) {
            urlMail = decryptedMail;
            clientModel.getClientById(req.session.cid, function (client) {
                currentUserMail = client.email;
                if (urlMail === currentUserMail) {

                    var time = req.query.dt;
                    if (parseInt(Date.now() / 1000) <= parseInt(time) + 2 * 60) {
                        model.clientInvitation(req.session.cid, req.query.pid, function (result) {
                            res.redirect(`http://localhost:3000/project?pid=${req.query.pid}`)
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

module.exports.createDiagram = function (req, res) {
    var name = req.get('name');
    var description = req.get('description');
    var projectId = req.get('pid');
    model.addDiagram(name, description, projectId);
}

module.exports.inviteBA = function (req, res) {
    mail = req.body['data[]'];
    name = req.body['name'];
    model.getProjectByBaAndName(req.session.baid, name, function (result) {
        encryptModel.encrypt(mail, function (encryptedMail) {
            encryptedMail = encryptedMail;
            var link = "http://localhost:3000/baInvitation?pid=" + result[0].projectId + "&dt=" + parseInt(Date.now() / 1000) + "&to=" + encryptedMail;
            sendMailModel.invite(mail, name, link);
            res.send();
        });
    });

}

module.exports.handleBAInvitationLink = function (req, res) {
    req.session.baid = 4;
    if (req.session.baid) {
        var urlMail = req.query.to;
        var currentUserMail = '';
        encryptModel.decrypt(urlMail, function (decryptedMail) {
            urlMail = decryptedMail;
            businessAnalystModel.getBaById(req.session.baid, function (output) {
                currentUserMail = output.email;
                if (urlMail.includes(currentUserMail)) {
                    var time = req.query.dt;
                    if (parseInt(Date.now() / 1000) <= parseInt(time) + 2 * 60) {
                        model.businessAnalystInvitation(req.session.baid, req.query.pid, function (result) {
                            res.redirect(`http://localhost:3000/project?pid=${req.query.pid}`)
                        });
                    }
                    else {
                        console.log('invitation expired');
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

module.exports.createProject = function (req, res) {
    // console.log(req.body.name, req.session.baid);
    model.createProject(req.session.baid, req.body.name);
    res.redirect(req.get('referer'));

}