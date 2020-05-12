const con = require('../database');

module.exports.getBusinessAnalystsByCompanyName = function (companyName, callback) {
	let sql = "SELECT * FROM businessanalyst WHERE companyName = ?";
	let inserts = [companyName];
	sql = con.format(sql, inserts);
	con.query(sql, function (error, results) {
		if (error) throw error;
		// console.log(results);
		callback(results);
	});
};

module.exports.getBusinessAnalystCompanyName = function (req, callback) {
	let sql = "SELECT companyName FROM businessanalyst WHERE businessAnalystId = ? ";
	let inserts = [req.session.baid];
	sql = con.format(sql, inserts);
	con.query(sql, function (error, results) {
		if (error) throw error;
		// console.log(results);
		callback(results);
	});
};
module.exports.getBaById = function (baid, callback) {
	let sql = "SELECT * FROM businessanalyst WHERE businessAnalystId = ? ";
	let inserts = [baid];
	sql = con.format(sql, inserts);
	con.query(sql, function (error, results) {
		if (error) throw error;
		callback(results[0]);
	});
};