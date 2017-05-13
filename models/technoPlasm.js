var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var TechnoPlasmSchema = new Schema({
	//_id of the technoplasm owner
	user_id: 		{ type: ObjectId },
	//if inherited by another TP, this is not null
	parent_id: 		{ type: ObjectId },
	//this number must be uniqe
	idNumber: 		{ type: String }, 
	//name is player editable
	name: 			{ type: String },
	level: 			{ type: Number },
	totalExperince: { type: Number },
	
	//this defines the inherted technoplasms. maxInheritance defines how many instances of a TP can be stored in the array.
	maxInheritance: { type: Number },
	inherited_id: 	[ { type: ObjectId } ],

	//these are static definitions of the TP. TPType is
	TPType: 		{ type: String },
	classLanguage: 	{ type: String },
	classLevel: 	{ type: Number },
	

	//base stats. When full rejuvinated, current stats are reset to these. These are determined by experince and 
	baseDefense:	{ type: Number },
	baseSpeed:		{ type: Number },
	basePower:		{ type: Number },
	baseHealth:		{ type: Number },
	baseAccuracy: 	{ type: Number },
	
	//current stats.
	defense:		{ type: Number },
	speed:			{ type: Number },
	power:			{ type: Number },
	health:			{ type: Number },
	Accuracy: 		{ type: Number },
	currentAffect: 	[{ type: String }],

	//A method is building block of an function. Methods are gained with increases in levels. There is a limit to the number of Methods a TP can remember
	numberOfMethods:{ type: Number},
	methods:			[ { methodType: { type: String }, callsLeft: { type: Number }} ],

	//functions are an array of methods called in order during a move. functions can be made up an ulimited number of methods, from inherited TP's as well
	methodsPerFunc: { type: Number },
	functions1: 	[ { type: String } ],
	functions2: 	[ { type: String } ],
	functions3: 	[ { type: String } ],
	functions4: 	[ { type: String } ],

	created: 		{ type: Date, },

	previousOwner: 	[ { type: ObjectId } ]		
});

module.exports = mongoose.model('TechnoPlasm', TechnoPlasmSchema);