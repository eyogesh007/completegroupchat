const mongoose=require('mongoose');

let msgschema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register'
    },
    username:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }

})

module.exports=mongoose.model('msgschema',msgschema);