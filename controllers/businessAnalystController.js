var projecModel = require("../models/project");
var businessAnalystModel = require("../models/businessAnalyst");

module.exports.home = async function (req, res) {
	req.session.baid = 1;
	if (!req.session.baid) {
		res.render('errors/404');
	}
	else {
		var result1 = await projecModel.getProjectsCreatedByBA(req);
		var result2 = await projecModel.getBusinessAnalystParticipatingProjects(req);
		res.render('business-analyst/home', { myProjects: result1, projects: result2 });
	}
}

module.exports.getBAsInMyCompany = async function (req, res) {
	if (!req.session.baid) {
		res.render('errors/404');
	}
	else {
		console.log('called');
		
		var result = await businessAnalystModel.getBaById(req.session.baid);
		var bas = await businessAnalystModel.getBusinessAnalystsByCompanyName(result.companyName);
		var emails = "";
		for (var i = 0; i < bas.length; ++i) {
			if (bas[i].businessAnalystId !== req.session.baid) {
				emails += bas[i].email;
				if (i < bas.length - 1)
					emails += ",";
			}
		}
		res.send(emails);
	}

}
