import mongoose from "mongoose"

const roleSchema=new mongoose.Schema({
    // sellerId:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Seller"
    // },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    order:{
        type:Number
    },
    roleName:{
        type:String
    },
    roleDescription:{
        type:String
    },
    memberList:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Member"
    },
    canUpdateRestaurantImg:{
        type:Boolean,
        default:false
    },
    canUpdateRestaurantDetails:{
        type:Boolean,
        default:false
    },
    canManageRoles:{
        type:Boolean,
        default:false
    },
    adminPower:{
        type:Boolean,
        default:false
    },
    canAddMember:{
        type:Boolean,
        default:false
    },
    // remaining to add 
    canManageFoodItemData:{
        type:Boolean,
        default:false
    },
    canManageOrder:{
        type:Boolean,
        default:false
    },
    canManageOrderTableInfo:{
        type:Boolean,
        default:false
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


const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);
export default Role;