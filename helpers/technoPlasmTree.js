var Models = require('../models'),
	async = require('async');

function buildTree(tP_id, treeCallback){
	//each callback will have it's own local variable
	var tPRoot = {};

	/* this asynic series will perform 3 async functions in series. First it finds the JSON for the passed in _id. Once complete it will then make a recusive call for each child tP, it will add the child 
	to the parent also. finally it passes the local JSON object to the call back. I'm honestly not sure I have to do this, but it's working, so I'm not going to break it... yet  */
	async.series([
		function(callback){
			getObject(tP_id, function(err, tP){
				//after getting the JSON object for the passed in _id, clone it to the local variable
				tPRoot = JSON.parse(JSON.stringify(tP));
				// add a new empty array for the formation of a tree.
				tPRoot.childrenTP = [];
				callback(null);
			}); 
		},
		function(callback){
			//check if there are any children. If not, perform the call back
			if (tPRoot.inherited_id.length>0){
				/*for each child in the root, it will perfrom this function, all in parrallel. This halves the speed of doing it in series, but it doesn't guarntee the order. I don't think it's critical, 
				but if it is, change async.each() to eachSeries() */
				async.each(tPRoot.inherited_id, function(tP_id, loopCallback) {
					buildTree(tP_id, function(childTP){
						tPRoot.childrenTP.push(childTP);
						loopCallback();
					});
				}, function(err){
					if (!err){
						callback(null);
					}
				});
			} else {
				callback(null);
			}
			
		},
		function(callback){
			//this make sure that tPRoot is fully populated with all it's children before passing it to the call back.
			callback(null, tPRoot);
		}

	], function(err, results){
		//console.log(results[2]);
		//the callback "results" is an array. The third element is the one we want.
		treeCallback(results[2]);
	});
};

function getObject(tP_id, callback){
	Models.TechnoPlasm.findOne({ _id: tP_id}, function(err, tP){
		if (err) {
			callback(err, null);
		} else if (tP) {
			callback(null, tP);
		} else {
			callback(null, null);
		}
	});
};

module.exports = {
	//allows you to pass an idNumber of the root.
	buildTreeFromRootidNumber: function(rootidNumber, callback){
		Models.TechnoPlasm.findOne({ idNumber: rootidNumber }, function(err, tP){
			if (err){
				throw err;
			} else if (tP) {
				buildTree(tP._id, function(tPTree){
					console.log("in tree callback");
					callback(tPTree);
				});
			}
		});
	},

	//allows you to pass the _id of the root.
	buildTreeFromRoot_id: function(root_id, callback){
		buildTree(root_id, function(tPTree){
			callback(tPTree);
		});
	}	
}