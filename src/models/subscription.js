import mongoose from "mongoose"

const subscriptionSchema = new mongoose.Schema({
    // hotelId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Hotel"
    // },
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller"
    },
    orderID:{
        type:String
    },
    currencyCode:{
        type:String
    },
    price:{
        type:Number,
    },
    active:{
        type:Boolean
    },
    plan:{
        type:String,
        enum:["Starter","Basic","Premium"]
    },
    subscriptionId:{
        type:String
    },
    startingDate:{
        type:Date,
    },
    endingDate:{
        type:Date,
    },
    hotelLimit:{
        type:Number,
    },
    orderLimit:{
        type:Number,
    },
    orderCount:{
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


const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
