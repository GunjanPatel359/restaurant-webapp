"use server"
import mongoose from "mongoose"
import path from "path"
import fs from "fs"
import jwt from "jsonwebtoken";

import { connectDB } from "@/db/Database";
import { sendToken } from "@/lib/jwtToken";
import { isAuthenticated } from "@/lib/authMiddleware";
import { static_colors } from "@/lib/colorUtil"; 
import { sgMail } from "@/lib/sendmailer";

import User from "@/models/user";
import Review from "@/models/review"
import Hotel from "@/models/hotel"
import OrderTable from "@/models/orderTable";
import FoodItem from "@/models/foodItem";
import { SERVER_URL } from "@/lib/server";

export const getPaypalClientDetail=async()=>{
    try {
        return { clientId: process.env.PAYPAL_CLIENT_ID };
    } catch {
        return { msg: "please try again later" };
    }
}

export const getUserInfo=async()=>{
    try {
        const user = await isAuthenticated()
        return { success: true,  user: JSON.parse(JSON.stringify(user)) };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export const createUser=async({ name, email, password, phoneNumber })=>{
    try {
        if (name && email && password && password.length >= 6) {
            const userEmail = await User.findOne({ email });
            if (userEmail) {
                throw new Error("User already exists");
            }
            const user = { name, email, password, phoneNumber };
            const token = jwt.sign(user, process.env.ACTIVATION_TOKEN, { expiresIn: "5m" });

            const msg = {
                to: user.email,
                from: process.env.SMTP_MAIL,
                subject: "Account Activation",
                html: `<a href="${SERVER_URL}/user-activation/${token}">Click on the link to activate your account</a>`
            };
            await sgMail.send(msg);

            return {
                success: true,
                message: `please check your email:- ${user.email} to activate your account`
            };
        }
        throw new Error("Provide all the details");
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

export const activateUser=async(token)=>{
    try {
        const user = jwt.verify(token, process.env.ACTIVATION_TOKEN);
        if (!user) {
            throw new Error("Invalid token");
        }
        await connectDB()
        const userExist = await User.findOne({ email: user.email });
        if (userExist) {
            throw new Error("User already exists");
        }
        await User.create(user);
        return { success: true, message: "User created successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export const login = async (email, password) => {
    try {
        
        if (!email || !password || password.length < 6) {
            throw new Error("Please provide all the credentials", 400);
        }
        
        await connectDB()
        const user = await User.findOne({ email }).select("password");
        if (!user) {
            throw new Error("User doesn't exist", 400);
        }

        const isPasswordValid = await user.comparePass(password);
        if (!isPasswordValid) {
            throw new Error("Incorrect password", 400);
        }

        const { password: newPassword, ...rest } = user._doc;
        await sendToken(user, 200, "Logged in successfully", rest)
        return { success: true }
    } catch (err) {
        console.error(err);
        return { success: false, message: err.message };
    }
}

export const setUserImage = async (formData) => {
    try {
        const user = await isAuthenticated();

        const file = formData.get("userimage");
        if (!file) {
            throw new Error("No image uploaded");
        }
        const uploadDir = path.join(process.cwd(), "public/uploads");
        const filePath = path.join(uploadDir, file.name);

        if (user.avatar) {
            const existingPath = path.join(uploadDir, user.avatar);
            if (fs.existsSync(existingPath)) {
                fs.unlinkSync(existingPath);
            }
        }

        const buffer = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));

        await connectDB()
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { avatar: file.name },
            { new: true }
        );

        return { success: true, user: JSON.parse(JSON.stringify(updatedUser)) };
    } catch (error) {
        console.log(error)
        throw new Error(error.message)
    }
}

export const addAddress=async({ country, state, city, address, zipCode })=>{
    try {
        const user = await isAuthenticated(); 
        const { _id } = user; 

        if (user.addresses.length >= 5) {
            throw new Error("You can't hold more than 5 addresses.");
        }

        if (!country || !city || !address || !zipCode) {
            throw new Error("Please fill all the required fields.");
        }
        if (zipCode.length !== 6) {
            throw new Error("Please provide a valid zipcode.");
        }

        await connectDB();

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { $push: { addresses: { country, state, city, address, zipCode } } },
            { new: true }
        );

        return { success: true, user: updatedUser };
    } catch (err) {
        console.error(err);
        throw new Error(err.message || 'An error occurred while adding the address.');
    }
}

export const getAllColorsUser=async()=>{
    try {
        return { success: true, colors: static_colors };
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Failed to fetch colors');
    }
}

export const changeColorUser = async (color) => {
    try {
        const user = await isAuthenticated(); 

        if (!static_colors.includes(color)) {
            throw new Error("Invalid color");
        }

        await connectDB(); 

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { colors: color },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("User not found");
        }

        return { success: true, message: "Color updated successfully" };
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Failed to update color');
    }
}

export const submitHotelReview = async (hotelId, rating, comment) => {
    try {
        const user = await isAuthenticated(); 

        if (!hotelId) {
            throw new Error("Hotel ID is required");
        }

        if (rating <= 0 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }

        if (!comment) {
            throw new Error("Comment is required");
        }

        const findRedundant = await Review.findOne({
            reviewType: "HOTEL",
            userId: user._id,
            reviewItemId: hotelId
        });

        if (findRedundant) {
            throw new Error("You have already submitted a review for this hotel");
        }

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            throw new Error("Hotel not found");
        }

        const review = await Review.create({
            reviewType: "HOTEL",
            userId: user._id,
            reviewItemId: hotelId,
            rating,
            description: comment
        });

        await User.findOneAndUpdate(
            { _id: user._id },
            { $push: { reviewIds: review._id } }
        );

        const totalReviews = hotel.totalReview || 0;
        const currentAvgReview = hotel.avgreview || 0;
        const newAvgReview = ((currentAvgReview * totalReviews) + rating) / (totalReviews + 1);

        await Hotel.findOneAndUpdate(
            { _id: hotelId },
            {
                $set: { avgreview: newAvgReview },
                $inc: {
                    totalReview: 1,
                    [`reviewCount.${rating}`]: 1
                }
            }
        );

        return { success: true, message: "Review submitted successfully" };
    } catch (error) {
        throw new Error(error.message || "Failed to submit review");
    }
}

export const getUserRatingForHotel = async (hotelId) => {
    try {
        const user = await isAuthenticated(); 

        if (!hotelId) {
            throw new Error("Hotel ID is required");
        }

        await connectDB(); 

        const review = await Review.findOne({
            reviewType: "HOTEL",
            userId: user._id,
            reviewItemId: hotelId
        }).populate("userId");

        if (!review) {
            return { success: false, message: "No review found for this hotel" };
        }

        return { success: true, review:JSON.parse(JSON.stringify(review)) };
    } catch (error) {
        throw new Error(error.message || "Failed to fetch user review");
    }
}

export const findAssignedHotels = async () => {
    try {
        const user = await isAuthenticated();
        if (!user || !user.currentlyAssignedHotels) {
            throw new Error("User not authenticated or no assigned hotels found");
        }
        
        console.log("Authenticated user:", user);

        await connectDB();

        const hotels = await Promise.all(
            user.currentlyAssignedHotels.map(async (id) => {
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    console.warn(`Invalid hotel ID: ${id}`);
                    return null; // Optionally handle invalid IDs
                }
                
                try {
                    const orderTable = await OrderTable.findOne({ _id: id }).populate("restaurantId");
                    if (!orderTable) {
                        console.warn(`OrderTable not found for ID: ${id}`);
                        return null;
                    }
                    return orderTable;
                } catch (error) {
                    console.error(`Error fetching hotel for ID: ${id}`, error);
                    throw error; // Optionally decide whether to continue or stop on errors
                }
            })
        );

        // Filter out any null values if necessary
        const validHotels = hotels.filter((hotel) => hotel !== null);

        console.log("Fetched hotels:", validHotels);

        return { success: true, hotels: JSON.parse(JSON.stringify(validHotels)) };
    } catch (error) {
        console.error("Error in findAssignedHotels:", error.message || error);
        return { success: false, message: error.message || "Failed to fetch assigned hotels" };
    }
};

export const submitFoodItemReview = async (foodItemId, rating, comment) => {
    try {
        const user = await isAuthenticated(); 

        if (!foodItemId) {
            throw new Error("Food item ID is required");
        }

        if (rating <= 0 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }

        if (!comment) {
            throw new Error("Comment is required");
        }

        const findRedundant = await Review.findOne({
            reviewType: "FOOD",
            userId: user._id,
            reviewItemId: foodItemId
        });

        if (findRedundant) {
            throw new Error("You have already submitted a review for this food item");
        }

        const foodItem = await FoodItem.findById(foodItemId);
        if (!foodItem) {
            throw new Error("Food item not found");
        }

        const review = await Review.create({
            reviewType: "FOOD",
            userId: user._id,
            reviewItemId: foodItemId,
            rating,
            description: comment
        });

        await User.findOneAndUpdate(
            { _id: user._id },
            { $push: { reviewIds: review._id } }
        );

        const totalReviews = foodItem.totalReview || 0;
        const currentAvgReview = foodItem.avgreview || 0;
        const newAvgReview = ((currentAvgReview * totalReviews) + rating) / (totalReviews + 1);

        await FoodItem.findOneAndUpdate(
            { _id: foodItemId },
            {
                $set: { avgreview: newAvgReview },
                $inc: {
                    totalReview: 1,
                    [`reviewCount.${rating}`]: 1
                }
            }
        );

        return { success: true, message: "Review submitted successfully" };
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}

export const getFoodItemUserRating = async (foodItemId) => {
    try {
        const user = await isAuthenticated(); 

        if (!foodItemId) {
            throw new Error("Food item ID is required");
        }

        const review = await Review.findOne({
            reviewType: "FOOD",
            userId: user._id,
            reviewItemId: foodItemId
        }).populate("userId");

        if (!review) {
            return { success: false, message: "No review found for this food item" };
        }

        return { success: true, review:JSON.parse(JSON.stringify(review)) };
    } catch (error) {
        throw new Error(error.message || "Failed to fetch review");
    }
}