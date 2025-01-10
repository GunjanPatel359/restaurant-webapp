import mongoose from "mongoose"

const foodItemSchema=new mongoose.Schema({
    name:{
        type:String
    },
    imageUrl:{
        type:String
    },
    smallDescription:{
        type:String
    },
    description:{
        type:String
    },
    veg:{
        type:Boolean
    },
    price:{
        type:Number
    },
    foodTypes:{
        type:[String]
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
    order:{
       type: Number
    },
    foodCategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"FoodCategory"
    },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    // countOrder:{
    //     type:Number,
    // },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})

const FoodItem = mongoose.models.FoodItem || mongoose.model('FoodItem', foodItemSchema);
export default FoodItem;