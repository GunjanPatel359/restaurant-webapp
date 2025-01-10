import mongoose from "mongoose"
const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  imgUrl:{
    type:String,
    required:true
  },
  addresses: {
    country: {
      type: String,
      required:true
    },
    state:{
      type:String,
      required:true
    },
    city: {
        type: String,
        required:true
    },
    address: {
        type: String,
        required:true
    },
    zipCode: {
        type: Number,
        required:true
    }
  },
  foodCategoryIds:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:'FoodCategory'
  },
  roleIds:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:'Role'
  },
  tableIds:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:'OrderTable'
  },
  avgreview:{
    type:Number,
    default:0
  },
  totalReview:{
    type:Number,
    default:0
  },
  reviewCount:{
    "1":{
      type:Number,
      default:0
    },
    "2":{
      type:Number,
      default:0
    },
    "3":{
      type:Number,
      default:0
    },
    "4":{
      type:Number,
      default:0
    },
    "5":{
      type:Number,
      default:0
    },
  },
  cusineTypes:{
    type:[String]
  },
  activeDate:{
    type:Date
  },
  // review:{
  //   type:[mongoose.Schema.Types.ObjectId],
  //   ref:'Review'
  // },
  sellerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Seller",
    required:true
  },
  colors:{
    type:String,
  },
  orderCancelLimit:{
    type:Number,
    default:0
  },
  orderCancelCount:{
    type:Number,
    default:0
  },
  orderHistory:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:"OrderTableLogs"
  },
  hotelGSTTax:{
    type:Number,
  },
  hotelServiceTax:{
    type:Number,
  },
  // orderLimit:{
  //   type:Number,
  //   default:500,
  // },
  // currentOrderCount:{
  //   type:Number,
  //   default:0
  // },
  // subscriptions:{
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref:'Subscription'
  // },
  addOns:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:'AddOn'
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

const Hotel = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);
export default Hotel;