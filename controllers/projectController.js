const model = require('../models/project');
const sendMailModel = require('../sendmail');
const encryptModel = require('../models/encrypt_decrypt')
const clientModel = require('../models/client')
const businessAnalystModel = require('../models/businessAnalyst')
const formidable = require('formidable');
const mv = require('mv');
const path = require('path');


module.exports.projectHome = function (req, res) {
    //console.log(`id = ${req.session.baid}`);
    if (req.session.baid || req.session.cid) {
        model.getProjectBa(req.query.pid, function (baParticipants) {
            model.getProjectClients(req.query.pid, function (clientsParticipants) {
                model.showProjectDiagrams(req, function (projectDiagrams) {
                    req.query = {pid : req.query.pid}
                    model.getProjectOwner(req.query.pid, function (owner) {
                        model.getAllAttachments(req.query.pid, function(attachements){
                            var ba = (!req.session.baid) ? false : true;
                            res.render('project/projectHome', {
                                auth: ba, diagrams: projectDiagrams, businessAnalysts: baParticipants,
                                clients: clientsParticipants, owner: { email: owner.email, name: owner.name },
                                attachements: attachements
                        });
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
    if(req.query.name){
        model.getProjectByBaAndName(req.session.baid, req.query.name, function (result) {
            encryptModel.encrypt(req.query.mail, function (encryptedMail) {
                mail = encryptedMail;
                var link = "http://localhost:3000/clientInvitation?pid=" + result[0].projectId + "&dt=" + parseInt(Date.now() / 1000) + "&to=" + mail;
                sendMailModel.invite(req.query.mail, req.query.name, link);
            })
        });
    }
    else{
        model.getProjectById(req.query.pid, function (project) {
            encryptModel.encrypt(req.query.mail, function (encryptedMail) {
                mail = encryptedMail;
                var link = "http://localhost:3000/clientInvitation?pid=" + req.query.pid + "&dt=" + parseInt(Date.now() / 1000) + "&to=" + mail;
                sendMailModel.invite(req.query.mail, project.name, link);
            })
        });
    }
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
    projectId = req.body['projectId'];
    if(!name){
        model.getProjectById(projectId, function (project) {
            encryptModel.encrypt(mail, function (encryptedMail) {
                encryptedMail = encryptedMail;
                var link = "http://localhost:3000/baInvitation?pid=" + projectId + "&dt=" + parseInt(Date.now() / 1000) + "&to=" + encryptedMail;
                sendMailModel.invite(mail, project.name, link);
                res.send();
            });
        });
    }
    else{
        model.getProjectByBaAndName(req.session.baid, name, function (result) {
            encryptModel.encrypt(mail, function (encryptedMail) {
                encryptedMail = encryptedMail;
                var link = "http://localhost:3000/baInvitation?pid=" + result[0].projectId + "&dt=" + parseInt(Date.now() / 1000) + "&to=" + encryptedMail;
                sendMailModel.invite(mail, name, link);
                res.send();
            });
        });
    }

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

module.exports.uploadFile = function(req, res){
    const form = new formidable.IncomingForm();
    form.parse(req, (error, fields, files) => {
        if(error) throw error;
        const file = files.file
        if(!(file.type.includes('pdf'))){
            console.log('only pdf file can be uploaded');
            return false;
        }

        filePath = file.path;
        filename = Math.floor(new Date() / 1000) + '_' + file.name ;
        newPath = path.join(`./public/attachements/${filename}`);
        mv(filePath, newPath, error =>{
            if(error) throw error;
        }
        );
        link = `/attachements/${filename}`;
        projectId = fields.pid; 
        model.addPdfAttachment(file.name, link, projectId);
    });
}

module.exports.getBAsNotInProject = function(req, res){
	if (!req.session.baid) {
		res.render('errors/404');
	}
	else {
		model.getProjectOwner(req.get('projectId'), function(result){
			model.getBAsNotInProject(req.get('projectId'), result.businessAnalystId,function(bas){
                var emails = "";
				for (var i = 0; i < bas.length; ++i) {
					if (bas[i].businessAnalystId !== req.session.baid) {
						emails += bas[i].email;
						if (i < bas.length - 1)
							emails += ",";
					}
				}
				res.send(emails);
            })
        })
    }
}

module.exports.leaveProject = function(req, res){
    model.leaveProject(req);
    if(req.session.baid){
        res.redirect('/ba');
    }
    else{

        res.redirect('/client');
    }
}