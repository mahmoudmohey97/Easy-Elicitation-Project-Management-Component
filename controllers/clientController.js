var projecModel = require("../models/project");

module.exports.home = async function (req, res) {
    req.session.cid = 3;
    if (!req.session.cid) {
        res.render('errors/404');
    }
    else {
        var results = await projecModel.getClientProjects(req);
        res.render('client/home', { data: results });
    }
};

