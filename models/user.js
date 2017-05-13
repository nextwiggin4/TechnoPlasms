var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	
	//the username is necessary and must be unique. It is not the unique key, but for log in purpose, it's gotta be the only one.
	username: 			{ type: String },
		
	//set for login purpose
	password:  			{ type: String },

	//user information: Not necessaru.
	firstName: 			{ type: String },
	lastName: 			{ type: String },
	age: 				{ type: Number },
	
	//this is defaulted as "player". It defines permissions levels
	userType:			{ type: String,	'default':'player' },
	
	//Keeps track of the date of creation and upadte
	created: 			{ type: Date },
	lastUpdate: 		{ type: Date, 'default': Date.now },
	
	//Game information: technoplams currently in deck. numberOfTPs shows maximum size of current deck. Technoplasms keeps track of who is in the current deck. 
	numberOfTPs: 		{ type: Number, 'default':3},	
	technoPlasms:		[ { type: String } ],

	//Game information: itmes currently being held by the user. These should all have descrete uses. the itemID of the item and number of usesRemaing to keep track of all effects.
	items: 				[ { itemID: String, usesRemaining: Number } ],

	//Game information: this is an array of all current affects and their duration
	cuurentAffects: 	[ { type: String, duration: Number } ],

	//User information: Friends list. This honestly seems like a crappy way to do it. Maybe another table is wiser and get it seperattly? ...worry about it tomorrow.
	following_id: 		[ { type: ObjectId } ],

	wins: 				{ type: Number },
	losses: 			{ type: Number },
	withdrawl: 			{ type: Number }
});

UserSchema.virtual('fullName')
	.get(function() {
		return this.firstName + " " + this.lastName;
	});

module.exports = mongoose.model('User', UserSchema);