var projecModel = require("../models/project");

module.exports.home = function (req, res) {
	req.session.baid = 2;
	if (!req.session.baid) {
		res.render('errors/404');
	}
	else {
		projecModel.getBusinessAnalystProjects(req, function (results) {
			res.render('business-analyst/home', { data: results });
		});
	}
}