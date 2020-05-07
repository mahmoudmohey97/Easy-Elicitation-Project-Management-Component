const con = require('../database');

/*******************************
* 	get all projects business analyst participating in to display
*******************************/
module.exports.getBusinessAnalystParticipatingProjects = function (req, callback) {
	let sql = "SELECT * FROM businessanalystparticipant as ba, project WHERE ba.businessAnalystId = ? and project.projectId = ba.projectId";
	let inserts = [req.session.baid];
	sql = con.format(sql, inserts);
	con.query(sql, function (error, results) {
		if (error) throw error;
		// console.log(results);
		callback(results);
	});

};

/*******************************
* 	get all projects that created by this business analyst
*******************************/
module.exports.getProjectsCreatedByBA = function (req, callback) {
	let sql = "SELECT * FROM project WHERE businessAnalystId = ?";
	let inserts = [req.session.baid];
	sql = con.format(sql, inserts);
	con.query(sql, function (error, results) {
		if (error) throw error;
		// console.log(results);
		callback(results);
	});

};

/*******************************
* 	get all projects client participating in to display
*******************************/
module.exports.getClientProjects = function (req, callback) {
	let sql = "SELECT * FROM clientparticipant as cp, project WHERE clientId = ? and project.projectId = cp.projectId";
	let inserts = [req.session.cid];
	sql = con.format(sql, inserts);
	con.query(sql, function (error, results) {
		if (error) throw error;
		// console.log(results);
		callback(results);
	});
	
};

/*******************************
* 	get clients participating in project
*******************************/
module.exports.getProjectClients = function (id, callback) {
	let sql = "SELECT * FROM clientparticipant as cp, client where cp.projectId = ? and client.clientId = cp.clientId";
	let inserts = [id];
	sql = con.format(sql, inserts);
	con.query(sql, function (error, results) {
		if (error) throw error;
		console.log(results);
		callback(results);
	});
	
};

/*******************************
* 	get business analysts participating in project
*******************************/
module.exports.getProjectBa = function (id, callback) {
	let sql = "SELECT * FROM businessanalystparticipant as ba, businessanalyst where ba.projectId = ? and businessanalyst.businessAnalystId = ba.businessAnalystId ";
	let inserts = [id];
	sql = con.format(sql, inserts);
	con.query(sql, function (error, results) {
		if (error) throw error;
		console.log(results);
		callback(results);
	});
};

/*******************************
* 	create project
*******************************/
module.exports.createProject = function(baId, name){
	let sql = "insert into project (name, approval, businessAnalystId) values (?, 0, ?)"
	let inserts = [name, baId]
	sql = con.format(sql, inserts)
	con.query(sql, function(error, results){
		if (error) throw error;
		console.log(results);
	});
	
};


/*//emails
module.exports.addBusinessAnalystToProject = function(businessAnalystCollaboratorsList, callback){

};*/

//another for adding to db


// DATABASE -> add BAid as a column in project table
// Home    -> create new Project
// project -> [participants -> (add, remove), delete project , rename project, open]