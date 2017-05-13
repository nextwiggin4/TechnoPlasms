var UserModel = require('../models').User;


function userCreds(req, res, callback){
	UserModel.findOne({ username: req.params.user_id},
		function(err, user) {
			if(err) {
				throw err;
			} else {
				if (user) {
					if (req.param('password') == user.password) {
						callback(req, res, user);
					} else {
						callback(req, res, null);
					}
			} else {
				callback(req, res, null);
			}
		}
	});	
};

function adminCreds(req, res, callback){
	UserModel.findOne({ username: req.param('username')},
		function(err, user) {
			if(err) {
				throw err;
			} else {
				if (user) {
					if (req.param('password') && user.userType == "admin") {
						callback(req, res, true);
					} else {
						callback(req, res, false);
					}
			} else {
				callback(req, res, false);
			}
		}
	});	
};

module.exports = {
	verifyUserCreds: function(req, res, callback){
		userCreds(req, res, callback);
	},

	verifyAdminCreds: function(req, res, callback){
		adminCreds(req, res, callback);
	}
}