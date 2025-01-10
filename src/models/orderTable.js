import mongoose from "mongoose"

const OrderTableSchema=new mongoose.Schema({
    tableNumber:{
        type:Number,
    },
    tableDescription:{
        type:String
    },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    randomString:{
        type:String,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    orders:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"FoodOrder"
    },
    memberId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Member"
    },
    status:{
        type:String,
        enum:["Available","Occupied","Billing"],
        default:"Available"
    },
    offline:{
        type:Boolean,
        default:false
    },
    seats:{
        type:Number,
        default:4
    },
    seatCount:{
        type:Number,
        default:0
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

const OrderTable = mongoose.models.OrderTable || mongoose.model('OrderTable', OrderTableSchema);
export default OrderTable;