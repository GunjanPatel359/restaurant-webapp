import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    reviewType: {
        type: String,
        enum: ["HOTEL", "FOOD"],
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String
    },
    rating: {
        type: Number,
    },
    reviewItemId: {
        type: mongoose.Schema.Types.ObjectId
    },
    createdAt: {
        type: Date,
        default: Date.now(),
      },
})

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;