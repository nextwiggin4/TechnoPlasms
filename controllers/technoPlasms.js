var Models = require('../models'),
	moment = require('moment'),
	async = require('async'),
	treeBuilder = require('../helpers/technoPlasmTree'),
	verify = require('../helpers/verification');

var testTP = new Models.TechnoPlasm();
	testTP.save;

module.exports = {
	index: function(req, res){
		var allTPs = {
			numberOfTPs: {},
			technoPlasms: {}
		}
		allTPs.numberOfTPs = Models.TechnoPlasms.length;
		allTPs.technoPlasms = Models.TechnoPlasms;
		res.json(allTPs);
	},

	getTPStats: function(req, res){
		Models.TechnoPlasm.findOne({ idNumber: req.params.tp_id }, function(err, tP) {
			if (err) {
				throw err;
			} else if (tP) {
				res.json(tP);
			} else {
				res.json(500, {error: 'there is no technoPlasm'});
			}
		});
	},

	assingTo: function(req, res){
		verify.verifyUserCreds(req, res, function(req, res, user) {
			if (user) {
				Models.TechnoPlasm.findOneAndUpdate({ idNumber: req.params.tp_id }, { user_id: user._id }, function(err, tP) {
					if (err) {
						throw err;
					} else if (tP) {
						res.json(tP);
					} else {
						res.json(500, {error: 'there is no technoPlasm'});
					}
				});
			} else {
				res.json(500, {error: 'there is no user'});
			}
		});
	},

	/*  tPer is the inherter (the parent tP), tPed is the inherited tP */
	inherit: function(req, res){
		if ( req.params.tper_id != req.params.tped_id ) {
			Models.TechnoPlasm.findOne({ idNumber: req.params.tper_id }, function(err, tPer) {
				if (err) {
					throw err;
				} else if (tPer) {
					if (tPer.maxInheritance > tPer.inherited_id.length) {
						Models.TechnoPlasm.findOne({ idNumber: req.params.tped_id }, function(err, tPed) {
							if (err) {
								throw err;
							} else if (tPed) {
								//check to make sure the class level of the inhereter is higher then the inherited and that the inhereter can
								if ( tPer.classLevel > tPed.classLevel ) {
									tPer.inherited_id.push(tPed._id);
									Models.TechnoPlasm.findOneAndUpdate({ idNumber: tPer.idNumber }, { inherited_id: tPer.inherited_id}, function (err, tP){
										if (err) {
											throw err;
										} else {
											Models.TechnoPlasm.findOneAndUpdate({ idNumber: tPed.idNumber }, { parent_id: tPer._id }, function (err, tp) {
												res.json(200, {success: "the inheritance was a success"});
											});
										}
									});
								} else {
									res.json(500, {error: "the class level of the inhereter must be higher than the inherited"});
								}
							} else {
								res.json(500, {error: 'the technoPlasm to be inherited does not exist'});
							}
						});
					} else {
						res.json(500, {error: "the iherter technoPlasm's memory locations are full"});
					}
				} else {
					res.json(500, {error: 'the iherter technoPlasm does not exist'});
				}
			});
		} else {
			res.json(500, {error: 'a technoPlasm cannot inheret itself'});
		}
	},

	getTreeFor: function(req, res){
		/*
		var tPRoot = {
			parentTP: {},
			childrenTP: []
		};	

		var buildTree = function(inherited_idArray, callback){
			var tPTemp = {
				parentTP: {},
				childrenTP: []
			};
			async.eachSeries(inherited_idArray, function(tP_id, callback){
				Models.TechnoPlasm.findOne({ _id: tP_id }, function(err, tP) {
					tPTemp.parentTP = tP;
					console.log(tP.idNumber);
					if (tP.inherited_id) {
						tPTemp.childrenTP.push(buildTree(tP.inherited_id, callback));
					}
					return tPTemp; 
				});
			}, function(err){
				if (err) {
					console.log("there was an error");
				} else {
					console.log("finished the traversal");
				}
			});
			callback();
			*/
			/*
			var childrenArray = [];

			for (var i = 0; i < inherited_idArray.length; i++) {
				Models.TechnoPlasm.findOne({ _id: inherited_idArray[i] }, function(err, tP) {
					console.log(tP.idNumber);
					if (tP.inherited_id) {
						childrenArray.push(buildTree(tP.inherited_id));
					} 
				});
			}
			return childrenArray;	
		};*/

		/* this function can start anywhere in a technoPlasm tree, climbs to the root, then returns the idNumber of the root.*/
		var findRootTP = function(tP_id){
			Models.TechnoPlasm.findOne({ _id: tP_id }, function(err, tP) {
				if (err) {
					throw err;
				} else if (tP) {
					if (tP.parent_id) {
						findRootTP(tP.parent_id);
					} else {
						treeBuilder.buildTreeFromRoot_id(tP._id, function(tPTree){
							res.json(tPTree);
						});
					}
				}
			});
		};

		Models.TechnoPlasm.findOne({ idNumber: req.params.tp_id }, function(err, tP) {
			if (err) {
				throw err;
				// if the tP has a parent (there for not the root), then use the findRootTP() function to find it.
			} else if(tP.parent_id){
				findRootTP(tP.parent_id);
			} else {
				treeBuilder.buildTreeFromRoot_id(tP._id, function(tPTree){
					res.json(tPTree);
				});
			}
		});

	},

	newTechnoPlasm: function(req, res){
		var saveNewTechnoPlasm = function() {
			var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
				tPId = '';

				for(var i=0; i < 10; i+=1) {
					tPId +=possible.charAt(Math.floor(Math.random() * possible.length));
				}
				Models.TechnoPlasm.find({ idNumber: tPId }, function(err, tP) {
					if(tP.length>0) {
						saveNewTechnoPlasm();
					} else {
						//pick a random TP from the list of possible
						var tempTP = Models.TechnoPlasms[Math.floor(Math.random() * Models.TechnoPlasms.length)];
						
						//set difficulty variable
						if (req.param("difficulty") && req.param("difficulty")>=2){
							var diff = Math.floor(Math.random() * (req.param('difficulty')/2))+(req.param('difficulty')/2);
						} else {
							var diff = 1;
						}
						var numberOfMeths = Math.floor(Math.random()*3)+2;

						//create a new TechnoPlasm of the correct type, set all the n
						var newTechnoPlasm = new Models.TechnoPlasm({
							idNumber:  		tPId,
							name: 			tPId,
							level: 			diff,
							totalExperince: 0,
							
							maxInheritance: tempTP.maxInheritance,
							inherited_id: 	[],

							TPType: 		tempTP.TPType,
							classLanguage: 	tempTP.classLanguage,
							classLevel: 	tempTP.classLevel,
							//set base stats
							baseDefense:	tempTP.defense*diff,
							baseSpeed:		tempTP.speed*diff,
							basePower:		tempTP.power*diff,
							baseHealth:		tempTP.health*diff,
							baseAccuracy: 	tempTP.accuracy*diff,
							//set current stats. Should be equal to base stats
							defense:		tempTP.defense*diff,
							speed:			tempTP.speed*diff,
							power:			tempTP.power*diff,
							health:			tempTP.health*diff,
							Accuracy: 		tempTP.accuracy*diff,
							currentAffect: 	[],
							//set methods. Number of methods is is determened at random amongst 2 and 5
							numberOfMethods:numberOfMeths,
							methods:        [ { methodType: tempTP.possibleMoves[0].moveType},
											  { callsLeft: 10 }	],

							methodsPerFunc: 4,
							functions1: 	[],
							functions2: 	[],
							functions3: 	[],
							functions4: 	[],

							created: 		moment()	
						});

						newTechnoPlasm.save(function(err,brandNewUser) {
							if(err) { throw err; }
							res.json(brandNewUser);
						});
					}
				});
		};

		saveNewTechnoPlasm();
	}
};