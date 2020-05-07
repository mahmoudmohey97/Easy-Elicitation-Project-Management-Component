const model = require('../models/project');
const sendMailModel = require('../sendmail')

module.exports.clientProjectHome = function (req, res) {

    console.log(`id = ${req.session.cid}`);
    if (!req.session.cid) {
        res.render('erros/404')
    }
    else {
        model.getProjectClients(req.query.pid, function(results){

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
        model.getProjectBa(req.query.pid, function(results){
            res.render('project/baHome');
        })   
    }
};

module.exports.inviteClient = function(req, res){
    sendMailModel.invite(req.query.mail, req.query.name, "<a> doos me </a>");
}