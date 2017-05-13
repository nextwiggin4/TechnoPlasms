var Models = require('../models'),
	verify = require('../helpers/verification');

module.exports = {
	index: function(req, res){
    	verify.verifyAdminCreds(req, res, function(req, res, admin) {
			var viewModel ={
	        	numberOfUsers: {},
	        	users: {}
	    	};

	    	if (admin) {
		    	Models.User.find({}, function(err, users){
			    	if (err) {throw err;}
			    	viewModel.numberOfUsers = users.length;
			    	viewModel.users = users;
			    		res.json(viewModel);

			    });
	    	} else {
	    		res.json(500, {error: 'For Admin Use Only' });
	    	}
	    });
	},

	getTechnoPlasmsList: function(req, res){
		verify.verifyAdminCreds(req, res, function(req, res, admin) {
			var viewModel ={
	        	numberOfTPs: {},
	        	TechnoPlasms: {}
	    	};

	    	if (admin) {
		    	Models.TechnoPlasm.find({}, function(err, tPs){
			    	if (err) {throw err;}
			    	viewModel.numberOfTPs = tPs.length;
			    	viewModel.TechnoPlasms = tPs;
			    		res.json(viewModel);
			    });
	    	} else {
	    		res.json(500, {error: 'For Admin Use Only' });
	    	}
		});
	}
};
