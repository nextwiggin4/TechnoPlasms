var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var methodSchema = new Schema({
	moveType:  						{ type: String },
	baseMovesAvailble: 				{ type: String },
	discription: 					{ type: String },

	/* affects against opponet. Value is directily added to oppents stats. Can be positive or negative */
	oppoDefenseAddAffect:  			{ type: Number },
	oppoSpeedAddAffect:  			{ type: Number },
	oppoPowerAddAffect:  			{ type: Number },
	oppoHealthAddAffect:  			{ type: Number },
	oppoAccuracyAddAffect:			{ type: Number },

	/* affects against opponet. Value is multiplied by oppents stats. must be >0. */
	oppoDefenseMultAffect:  		{ type: Number },
	oppoSpeedMultAffect:  			{ type: Number },
	oppoPowerMultAffect:  			{ type: Number },
	oppoHealthMultAffect:  			{ type: Number },
	oppoAccuracyMultAffect:			{ type: Number },

	/* affects against self. Value is directily added to own stats. Can be positive or negative */
	selfDefenseAddAffect:  			{ type: Number },
	selfSpeedAddAffect:  			{ type: Number },
	selfPowerAddAffect:  			{ type: Number },
	selfHealthAddAffect:  			{ type: Number },
	selfAccuracyAddAffect: 			{ type: Number },

	/* affects against self. Value is multiplied by oppents stats. must be >0. */
	selfDefenseMultAffect:  		{ type: Number },
	selfSpeedMultAffect:  			{ type: Number },
	selfPowerMultAffect:  			{ type: Number },
	selfHealthMultAffect:  			{ type: Number },
	selfAccuracyMultAffect:			{ type: Number },

	oppoAdditionalAffect: 			{ type: String },
	selfAdditionalAffect: 			{ type: String }

});

module.exports = mongoose.model('Method', methodSchema);