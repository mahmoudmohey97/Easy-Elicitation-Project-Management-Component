var projecModel = require("../models/project");

module.exports.home = function (req, res) {
	req.session.baid = 3;
	if (!req.session.baid) {
		res.render('errors/404');
	}
	else {
		projecModel.getProjectsCreatedByBA(req, function (result1) {
			
			projecModel.getBusinessAnalystParticipatingProjects(req, function(result2){

				res.render('business-analyst/home', {myProjects: result1, projects: result2 });
			})
		});
	}
}