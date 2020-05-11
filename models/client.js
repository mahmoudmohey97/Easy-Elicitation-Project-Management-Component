const con = require('../database');

module.exports.getClientById = function (id, callback) {
	let sql = "SELECT * FROM client WHERE clientId = ? ";
	let inserts = [id];
	sql = con.format(sql, inserts);
	con.query(sql, function (error, results) {
		if (error) throw error;
		// console.log(results);
		callback(results[0]);
	});
};