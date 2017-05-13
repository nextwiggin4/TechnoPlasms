var Models = require('../models');

module.exports = {

	index: function(req, res){
		var allRefills = {
			numberOfRefills: {},
			refills: {}
		}

		Models.Refill.find({}, function(err, refills){
			if (err) {throw err;
			} else {
				allRefills.numberOfRefills = refills.length;
				allRefills.refills = refills;
				res.json(allRefills);
			}
		});
	},

	getOneUser: function(req, res){
		var userRefills = {
			user: {},
			refills: {}
		};

		Models.User.findOne({ userName: { $regex: req.params.user_id}}, function(err, user) {
			if (err) {
				throw err;
			} else if (user) {
				userRefills.user = user;
				Models.Refill.find({ userName_id: user._id }, {}, { sort: { 'timestamp': 1 }}, 
					function(err, refills) {
						if (err) {
							console.log("there was an error");
							throw err;
						} else if (refills) {
							console.log("there was NO error");
							userRefills.refills = refills;
							res.json(userRefills);
						} else {
							res.json(500, {error: 'no records exist!'})
						}
					});
			} else {
				res.json(500, {error: 'this user does not exist!'});
			}
		});
	},

	refill: function(req, res) {
		Models.User.findOne({ userName: { $regex: req.params.user_id}}, function(err, user) {
			if (err) {throw err;
			} else if (user) {
				console.log(req.params);
				console.log(req.body);
				var newRefill = new Models.Refill(req.body);
					newRefill.userName_id = user._id;
					newRefill.save(function(err,brandNewRefill) {
						if (err) {throw err;
						} else {
							res.json(brandNewRefill);
						}
					});

			} else {
				res.json(500, {error: 'this user does not exist!'});
			}
		});
	}
};