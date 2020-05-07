const conn = require('../database');

module.exports.getBusinessAnalystByCompanyName = function (companyName, callback) {
	let sql = "SELECT * FROM businessanalyst WHERE companyName = ? ";
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