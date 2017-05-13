var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var moveSchema = new Schema({
	moveType:  					{ type: String },
	baseMovesAvailble: 			{ type: String },
	discription: 				{ type: String },

	/* base affects against opponet */
	offensiveDefenseAffect:  	{ type: Number },
	offensiveSpeedAffect:  		{ type: Number },
	offensivePowerAffect:  		{ type: Number },
	offensiveHealthAffect:  	{ type: Number },
	offesniveAccuracyAffect: 	{ type: Number },

	/* base affects against self */
	defensiveDefenseAffect:  	{ type: Number },
	defensiveSpeedAffect:  		{ type: Number },
	defensivePowerAffect:  		{ type: Number },
	defensiveHealthAffect:  	{ type: Number },
	defesniveAccuracyAffect: 	{ type: Number },

	additionalAffect: 			{ type: String }

});

module.exports = mongoose.model('Move', moveSchema);