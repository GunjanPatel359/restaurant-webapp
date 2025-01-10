import mongoose from "mongoose"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

const sellerSchema = new mongoose.Schema({
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
      country: {
        type: String,
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
  //   role:{
  //     type: String,
  //     default: "user",
  //   },
  avatar: {
    // public_id:{
    type: String,
    // required: true,
    // }
  },
  subscriptionIds:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:"Subscription"
  },
  restaurantIDs:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:"Hotel"
  },
  colors:{
    type:String,
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
sellerSchema.pre("save", async function (next) {
  this.password = await bcryptjs.hash(this.password, 10)
})

//create token
sellerSchema.methods.getJwtToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES })
}

//comparepasswaord
sellerSchema.methods.comparePass = async function (enteredPassword) {
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

sellerSchema.index({name:'text',email:'text'})



const Seller = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);
export default Seller;