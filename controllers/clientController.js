var projecModel = require("../models/project");

module.exports.home = function (req, res) {
    req.session.cid = 1;
    if (!req.session.cid) {
        res.render('errors/404');
    }
    else {
        projecModel.getClientProjects(req, function (results) {
            res.render('client/home', { data: results });
        });
    }
}