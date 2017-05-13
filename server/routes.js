var users = require('../controllers/users'),
	admin = require('../controllers/admin'),
	express = require('express'),
	path = require('path'),
	technoPlasms = require('../controllers/technoPlasms');

module.exports.initialize = function(app, router) {
	
	/* This is the routes file and the hierarchy of the site. All API method calls are listed in this page. User account is routed through host/users/. All admin tools route through host/admin/. game play happens through the the other methods. 
	All non-node content can be accessed through host/public/... */

	//
	router.get('/', express.static(path.join(__dirname, '../public/html')))
	
	/* admin Methods */
	//returns all user information for all users. Must append a valid Admin username & password
	router.get('/admin/users', admin.index);
	//returns all instances of TechnoPlasms. Must append a valid Admin username & password
	router.get('/admin/technoPlasms', admin.getTechnoPlasmsList);
	
	/* user Methods */
	//register a new user. Must append a new password & unique username. 
	router.post('/users/register', users.newUser);
	//get user profile. Must append a valid password to get all user information. If an invalid password is sent (or none at all), this method will return just public information.
	router.get('/users/:user_id', users.getOneUser);
	//update a users information. Must append a valid password.
	router.put('/users/:user_id', users.updateUser);
	//delete a specific user name. Must append a valid password.
	router.delete('/users/:user_id', users.remove);
	//retrieve a list of all Technoplasms associated with a user. Must append a valid password.
	router.get('/users/:user_id/getTechnoPlasmList', users.getTPList);
	//retrieve a list of all TP in a users current deck. Must append a valid password.
	router.get('/users/:user_id/getCurrentDeck', users.getDeck);
	//add a TP to a users current deck. There must be an open spot in the deck at a specific index and the TP must be associated with the user. Must append a valid password.
	router.put('/users/:user_id/addTechnoPlasm/:tp_id/at/:deck_index', users.addTP);
	//remove a TP from a users current deck. Must append a valid password.
	router.delete('/users/:user_id/removeTechnoPlasm/:tp_id', users.removeTP);
	//return a TP to the wild, remove it's association with a use
	router.delete('/users/:user_id/returnToTheWild/:tp_id', users.removeTPAssociation);


	/* technoPlasm Methods */
	router.get('/technoPlasms', technoPlasms.index);
	//this creates a new instance of a wild technoplasm that can be interacted with. No username/password required. Must append 'difficulty' variable.
	router.post('/technoPlasms/generateRandom', technoPlasms.newTechnoPlasm);
	//get stats on a single technoPlasm. No username/password required.
	router.get('/technoPlasms/:tp_id', technoPlasms.getTPStats);
	//get the entire technoPlasm inheritance tree for this technoPlasm. No username/password required.
	router.get('/technoPlasms/getTreeFor/:tp_id', technoPlasms.getTreeFor);
	//this method assigns a user to the TP. Can be used to capture a TP or trade. No password required.
	router.put('/technoPlasms/:tp_id/assignTo/:user_id', technoPlasms.assingTo);
	//this method allows one TechnoPlasm (tper) to inheret another TechnoPlasm (tped). No username/password required.
	router.put('/technoPlasms/:tper_id/inherit/:tped_id', technoPlasms.inherit);

	app.use('/', router);
};