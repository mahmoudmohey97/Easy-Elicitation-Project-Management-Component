const con = require('../database');

module.exports.deleteDiagram = function (did) {
	sql = "delete from diagram where diagramId = ?";
	inserts = [did];
	sql = con.format(sql, inserts);
	con.query(sql, function (error) {
		if (error) throw error;
	});
}

module.exports.addDiagramRelation = function (diagram1Id, diagram2Id, realtionName, projectId) {
	sql = "insert into diagramrelation (diagram1Id, diagram2Id, type, projectId) values(?, ?, ?, ?)";
	inserts = [diagram1Id, diagram2Id, realtionName, projectId];
	sql = con.format(sql, inserts);
	con.query(sql, function (error) {
		if (error) throw error;
	});
	console.log('eshtaa');
}

module.exports.getProjectRelations = function (projectId, callback) {
	sql = "SELECT dir.relationId, A.NAME AS diagram1Name, B.NAME AS diagram2Name, dir.type AS type\
	FROM diagram A, diagram B, diagramrelation as dir\
	WHERE A.diagramId = dir.Diagram1Id \
	AND B.diagramId = dir.Diagram2Id\
	AND A.projectId = ?\
	AND B.projectId = ?\
	AND dir.projectId = ?";
	inserts = [projectId, projectId, projectId];
	sql = con.format(sql, inserts);
	con.query(sql, function (error, results) {
		if (error) throw error;
		callback(results);
	});
}

module.exports.deleteDiagramRelation = function (id) {
	sql = "DELETE FROM diagramrelation WHERE relationId = ?"
	inserts = [id];
	sql = con.format(sql, inserts);
	con.query(sql, function (error) {
		if (error) throw error;
	});
}

module.exports.addDiagram = function (name, description, projectId) {
	let sql = "insert into diagram(approval, serializedDiagram, name, description, projectId) values(0, '', ?, ?, ?)"
	let inserts = [name, description, projectId];
	sql = con.format(sql, inserts);
	con.query(sql, function (error) {
		if (error) throw error;
		console.log('added successfully')
	});
};

module.exports.showProjectDiagrams = function (req, callback) {
	let sql = "select * from diagram where projectId=?"
	let inserts = [req.query.pid];
	//console.log(inserts);
	sql = con.format(sql, inserts);
	con.query(sql, function (error, results) {
		if (error) throw error;
		//console.log(results);
		callback(results);
	})
};