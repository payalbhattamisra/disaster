const mongoose=require("mongoose");
const victimRequestSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    contact:{
        type:String
    },
    location:{
        type:String,
        required:true
    },
    typeOfHelp:{
        type:String,
        required:true
    },
    urgency:{
        type:String
    },
    peopleCount:{
        type:Number
    },
    description:{
        type:String
    },
    photo:{
        type:String
    },
    status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },
   assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: "Volunteer", default: null },
    timestamp:{
        type:Date,
        default:Date.now
    }

});
module.exports=mongoose.model("VictimRequest",victimRequestSchema);