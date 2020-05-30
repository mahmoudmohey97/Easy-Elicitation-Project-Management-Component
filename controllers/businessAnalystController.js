var projecModel = require("../models/project");
var businessAnalystModel = require("../models/businessAnalyst");

module.exports.home = function (req, res) {
	req.session.baid = 1;
	if (!req.session.baid) {
		res.render('errors/404');
	}
	else {
		projecModel.getProjectsCreatedByBA(req, function (result1) {
			projecModel.getBusinessAnalystParticipatingProjects(req, function (result2) {
				res.render('business-analyst/home', { myProjects: result1, projects: result2 });
			})
		});
	}
}

module.exports.getBAsInMyCompany = function (req, res) {
	if (!req.session.baid) {
		res.render('errors/404');
	}
	else {
		businessAnalystModel.getBaById(req.session.baid, function (result) {
			businessAnalystModel.getBusinessAnalystsByCompanyName(result.companyName, function (bas) {
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
		});
	}

}
