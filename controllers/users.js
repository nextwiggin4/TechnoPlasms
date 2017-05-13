var Models = require('../models'),
	verify = require('../helpers/verification'),
	moment = require('moment'),
	async = require('async');


module.exports = {

	newUser: function(req, res) {
		if(req.body.username && req.body.password) {
			Models.User.find({username: { $regex: req.body.username } }, function(err, docs) {
				if (docs.length == 0) {

				var newUser = new Models.User(req.body);
					newUser.created = moment();
					newUser.save(function(err,brandNewUser) {
						if (err) { throw err; }
					res.json(brandNewUser);
					});
				} else {
					res.json(500, {error: 'account already exists!'});
				}  
			});
		} else {
			res.json(500, {error: 'There was an error!' });
		}
	},

	getOneUser: function(req, res){
		verify.verifyUserCreds(req, res, function(req, res, user) {
			if (user) {
				res.json(user);
			} else {
				Models.User.findOne({ username: req.params.user_id }, function(err, userNoPass){
					var publicUser = {
						firstName: "",
						lastName: "",
						userType: ""
					}
					if(userNoPass){
						publicUser.firstName = userNoPass.firstName;
						publicUser.lastName = userNoPass.lastName;
						publicUser.userType = userNoPass.userType;

						res.json(publicUser);
					} else {
						res.json(500, {error: 'This user does not exist' });
					}
				});	
			}
		});
	},

	updateUser: function(req, res) {
		verify.verifyUserCreds(req, res, function(req, res, user) {
			if (user) {
				var query = {username: req.params.user_id};
				var update = new Models.User(req.body).toObject();
				delete update._id;

				Models.User.findOneAndUpdate(query,update, 
					function (err, user) {
						if(err) {throw err;}
						if(user) {
							res.json(user);
						} 
				});
			} else {
				res.json(500, {error: 'there is no account'});
			}
		});
	},

	remove: function(req, res) {
		verify.verifyUserCreds(req, res, function(req, res, user) {
			if (user) {
				Models.User.findOneAndRemove({ username: req.params.user_id }, 
					function(err, user) {
						if(err) {
							throw err;
						} else {
							if(user) {
								res.json(user);
							} 
						} 
				});			
			} else {
				res.writeHead(500, {'Content-Type' : 'text/plain'});			
				res.json(500, {error: 'there is no account'});
			}
		});
	},

	getTPList: function(req, res){
		verify.verifyUserCreds(req, res, function(req, res, user) {
			if (user){
				Models.TechnoPlasm.find({ user_id: user._id }, function(err, tP){
					if (err) {
						throw err;
					} else if (tP) {
						var userTPs = {
							numberOfTPs: tP.length,
							technoPlasm: tP
						}
						res.json(userTPs);
					} else {
						res.json(500, {error: 'there is no technoPlasm'})
					}
				});
			} else {
				res.json(500, {error: 'there is no user'});
			}
		});
	},

	addTP: function(req, res){
		verify.verifyUserCreds(req, res, function(req, res, user) {
			if (user){
				//check the to make sure there is an open spot in the list
				if ( user.numberOfTPs > user.technoPlasms.length) {
					//find the specific technoPlasm to add
					Models.TechnoPlasm.findOne({ idNumber: req.params.tp_id }, function(err, tP) {
						if (err) {
							throw err;
						} else if (tP) {
							//check to make sure it is a tP that the user is owns
							if (!tP.parent_id) {
								if ( tP.user_id.equals(user._id)){
									//check to make sure the index isn't larger then possible or larger than current 
									if ( user.numberOfTPs > req.params.deck_index && user.technoPlasms.length > req.params.deck_index){
										user.technoPlasms.splice(req.params.deck_index, 0, tP.idNumber);
									} else {
										user.technoPlasms.push(tP.idNumber);
									} 
									Models.User.findOneAndUpdate({ username: req.params.user_id }, { technoPlasms: user.technoPlasms }, function(err, updatedUser){
										if (err) {
											throw err;
										} else if (updatedUser) {
											res.json(200, {success: "the technoPlasm was added to your deck"});
										} else {
											res.json(500, {error: 'the technoPlasm could not be added'});
										}
									});
								} else {
									res.json(500, {error: 'you can not add a technoPlasm you do not own'});
								}
							} else {
								res.json(500, {error: 'you can not add an inherited technoPLasm'});
							}
						} else {
							res.json(500, {error: 'the technoPlasm could not be added'});
						}
					});
				} else {
					res.json(500, {error: 'there are no open slots for technoPlasms'});
				}
			} else {
				res.json(500, {error: 'there is no user'});
			}
		});
	},

	getDeck: function(req, res){
		verify.verifyUserCreds(req, res, function(req, res, user) {
			if (user){
				var playerDeck = {
					numberOfTPs: 0,
					technoPlasms: []
				}

				async.eachSeries(user.technoPlasms, function(tPid, callback) {
					Models.TechnoPlasm.findOne({ idNumber: tPid }, function(err, tP) {
						if (tP) {
							playerDeck.numberOfTPs += 1;
							playerDeck.technoPlasms.push(tP);
							callback();
						} else {
							res.json(500, {error: 'there was an error finding the technoPlasm in your deck'});
							callback('there was an error findin the tP');
						}
					});
				}, function(err){
					if (err) {
						throw err;
					} else {
						res.json(playerDeck);
					}
				});
			}
		});
	},

	removeTP: function(req, res){
		verify.verifyUserCreds(req, res, function(req, res, user) {
			if (user){
				var i = user.technoPlasms.indexOf(req.params.tp_id);
				if ( i > -1) {
					user.technoPlasms.splice(i, 1);
				} else {
					res.json(500, {error: 'that is not a technoPlasm in the deck'});
				}
				Models.User.findOneAndUpdate({ username: req.params.user_id }, { technoPlasms: user.technoPlasms }, function(err, updatedUser){
					if (err) {
						throw err;
					} else if (updatedUser) {
						res.json(200, {success: "the technoPlasm was removed from your deck"});
					} else {
						res.json(500, {error: 'the technoPlasm could not be removed'});
					}
				});
			}
		});
	},

	removeTPAssociation: function(req, res){
		verify.verifyUserCreds(req, res, function(req, res, user) {
			if (user){
				Models.TechnoPlasm.findOne({ idNumber: req.params.tp_id }, function(err, tP) {
					if (tP){
						if(tP.user_id.equals(user._id)){
							tP.previousOwner.push(user._id)
							Models.TechnoPlasm.findOneAndUpdate({ idNumber: req.params.tp_id }, { user_id: undefined, previousOwner: tP.previousOwner}, function(err, updatedTp){
								res.json(200, {success: "user association removed"});
							});
						} else {
							res.json(500, {error: 'user does not own this technoPlasm'});
						}	
					} else {
						res.json(500, {error: 'there is no technoPlasm'});
					}
				});
			} else {
				res.json(500, {error: 'there is no user'});
			}
		});
	}
};