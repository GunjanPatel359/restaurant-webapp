import mongoose from "mongoose"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email!"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [5, "Password should be greater than 5 characters"],
    select: false,
  },
  phoneNumber: {
    type: Number,
  },
  addresses: [
    {
      country:{
        type:String,
      },
      state:{
        type: String,
      },
      city: {
        type: String,
      },
      address: {
        type: String,
      },
      zipCode: {
        type: Number,
      },
    }
  ],
  colors:{
    type:String,
  },
  avatar: {
    // public_id:{
    type: String,
    // required: true,
    // }
  },
  reviewIds:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Review"
  },
  currentlyAssignedHotels:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:"OrderTable"
  },
  orderHistory:{
    type: [mongoose.Schema.Types.ObjectId],
    ref:"OrderTableLogs"
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
  // verificationOtp: Number,
  // verificationOtpTime: Date,
  // isVerified:{
  //     type:Boolean,
  //     default:false
  // },
})

//Hash password
userSchema.pre("save", async function (next) {
  this.password = await bcryptjs.hash(this.password, 10)
})

//create token
userSchema.methods.getJwtToken = async(id)=>{
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES })
}

//comparepasswaord
userSchema.methods.comparePass = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password)
}

// userSchema.methods.intializeOtp=function(){
//     const d=new Date()
//     const otp=Math.floor(100000 + Math.random() * 900000 + d.getMilliseconds());
//     this.verificationOtp=otp;
//     this.verificationOtpTime=Date.now() + 180000
//     return true
// }

// userSchema.methods.verifyOtp=function(){
//     if(this.verificationOtpTime < Date.now()){
//         return false
//     }
//     this.isVerified=true
//     return true
// }

const User = (mongoose.models.User) || mongoose.model('User', userSchema);
export default User;