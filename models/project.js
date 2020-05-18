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
		//console.log(results);
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
		//console.log(results);
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
		// console.log(results);
	});

};

/*******************************
* 	get project BY BAId AND PROJECT NAME
*******************************/
module.exports.getProjectByBaAndName = function(baId, name, callback){
	let sql = "SELECT * FROM project WHERE businessAnalystId = ? AND name = ? "
	let inserts = [baId, name]
	sql = con.format(sql, inserts)
	con.query(sql, function(error, results){
		if (error) throw error;
		callback(results);
	});
};

module.exports.getProjectById = function(projectId, callback){
	let sql = "SELECT * FROM project WHERE projectId = ?"
	let inserts = [projectId]
	sql = con.format(sql, inserts)
	con.query(sql, function(error, results){
		if (error) throw error;
		console.log(results)
		callback(results[0]);
	});

};

module.exports.clientInvitation = function(clientId, projectId, callback){
	let sql = "INSERT INTO clientparticipant (clientId, projectId) values (?, ?)";
	let inserts = [clientId, projectId];
	sql = con.format(sql, inserts);
	con.query(sql, function (error, results) {
		if (error) throw error;
		//console.log(results);
		console.log('successful')
		callback(results);
	});
};

module.exports.businessAnalystInvitation = function(businessAnalystId, projectId, callback){
	let sql = "INSERT INTO businessanalystparticipant (businessanalystId, projectId) values (?, ?)";
	let inserts = [businessAnalystId, projectId];
	sql = con.format(sql, inserts);
	con.query(sql, function (error, results) {
		if (error) throw error;
		//console.log(results);
		console.log('Added successfully')
		callback(results);
	});
};

module.exports.showProjectDiagrams = function(req, callback){
	let sql = "select * from diagram where projectId=?"
	let inserts = [req.query.pid];
	//console.log(inserts);
	sql = con.format(sql, inserts);
	con.query(sql, function(error, results){
		if (error) throw error;
		//console.log(results);
		callback(results);
	})
};

module.exports.getProjectOwner = function(id, callback){
	let sql = "select * from project as p, businessanalyst as ba where p.projectId = ? AND p.businessanalystId = ba.businessanalystId"
	let inserts = [id];
	//console.log(inserts);
	sql = con.format(sql, inserts);
	con.query(sql, function(error, results){
		if (error) throw error;
		//console.log(results);
		callback(results[0]);
	})
};

module.exports.addDiagram = function(name, description, projectId){
	let sql = "insert into diagram(approval, serializedDiagram, name, description, projectId) values(0, '', ?, ?, ?)"
	let inserts = [name, description, projectId];
	sql = con.format(sql, inserts);
	con.query(sql, function(error){
		if(error) throw error;
		console.log('added successfully')
	});
};

module.exports.addPdfAttachment = function(name, link, projectId) {
    let sql = "insert into attachment (name, link, projectId) values(?, ?, ?)";
    inserts = [name, link, projectId];
    sql = con.format(sql, inserts);
    con.query(sql, function(error){
        if(error) throw error;
        console.log('added succesfully');    
    })
}

//PDF attachements
module.exports.getAllAttachments = function(projectId, callback){
	sql = "select name , link from attachment where projectId = ? and diagramId IS NULL"  ;
	inserts = [projectId];
	sql = con.format(sql, inserts);
	con.query(sql, function(error, results){
		if(error) throw error;
		//console.log(results);
		callback(results)
	});
}

/////////// diagram relations remaining



module.exports.getBAsNotInProject = function (projectId, ownerId, callback) {
	let sql = "SELECT * \
	FROM businessanalyst \
	WHERE businessanalyst.businessAnalystId not in(\
		SELECT businessanalystparticipant.businessAnalystId\
		FROM businessanalystparticipant\
		WHERE businessanalystparticipant.projectId = ?)\
	AND businessanalyst.businessAnalystId != ?\
	AND businessanalyst.companyName IN (SELECT companyName FROM businessanalyst as ba WHERE ba.businessAnalystId = ?)"
	
	let inserts = [projectId, ownerId, ownerId];
	sql = con.format(sql, inserts);
	con.query(sql, function(error, results){
		if(error) throw error;
		console.log(results);
		callback(results);
	})	
}

module.exports.leaveProject = function(req){
	var sql = '';
	var inserts ; 
	if(req.session.baid){
		sql = "delete from businessanalystparticipant where businessAnalystId = ? " ;
		inserts = [req.session.baid];
	}
	else if(req.session.cid){
		sql = "delete from clientparticipant where clientId = ? " ;
		inserts = [req.session.cid];
	}
	else{
		console.log('wala 7aga mn dool ya ostaz');	
	}
	sql = con.format(sql, inserts);
	con.query(sql, function(error){
		if(error) throw error;
		console.log('done');
	});
}