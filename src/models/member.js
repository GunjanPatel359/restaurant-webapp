import mongoose from "mongoose"

const memberSchema=new mongoose.Schema({
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller"
    },
    roleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role"
    },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})

const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);
export default Member;