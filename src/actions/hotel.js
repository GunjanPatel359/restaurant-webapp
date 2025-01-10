"use server"
import { connectDB } from "@/db/Database";
import path from "path"
import fs from "fs"
import { isSellerAuthenticated } from "@/lib/authMiddleware";
import { static_colors } from "@/lib/colorUtil";
import FoodItem from "@/models/foodItem";
import Hotel from "@/models/hotel";
import Role from "@/models/role";
import Member from "@/models/member";
import Seller from "@/models/seller";
import FoodCategory from "@/models/foodCategory";


export const getHomeHotels = async () => {
    try {
        await connectDB();  // Ensure the DB is connected
        const hotels = await Hotel.find({}).limit(5);
        return { success: true, hotels:JSON.parse(JSON.stringify(hotels)) };
    } catch (error) {
        console.log(error)
        return { success: false, message: error.message };
    }
};

export const getHomeFoodItems = async () => {
    try {
        await connectDB();
        const foodItems = await FoodItem.find({})
            .populate("restaurantId")
            .limit(5);

        return { success: true, foodItems:JSON.parse(JSON.stringify(foodItems)) };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const createRestaurant = async (formData) => {
    try {
        const seller = await isSellerAuthenticated();

        const file = formData.get("restaurantimage");
        const name = formData.get("name");
        const country = formData.get("country");
        const state = formData.get("state");
        const city = formData.get("city");
        const address = formData.get("address");
        const zipCode = formData.get("zipCode");
        const cusineTypes = formData.get("cusineTypes");

        if (!file || !name || !country || !state || !city || !address || !zipCode || !cusineTypes) {
            throw new Error("All fields are required");
        }

        const subscription = await checkForSellerSubscription(seller);
        if (!subscription) {
            throw new Error('You do not have any active plan to continue');
        }

        if (seller.restaurantIDs.length >= subscription.hotelLimit) {
            throw new Error(`You cannot create more than ${subscription.hotelLimit} restaurants`);
        }

        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, file.name);
        const buffer = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));

        const addresses = { country, state, city, address, zipCode };
        
        await connectDB();
        let hotel = await Hotel.create({
            name,
            imgUrl: file.name,
            addresses,
            cusineTypes,
            sellerId: seller._id
        });

        const role = await Role.create({
            sellerId: seller._id,
            restaurantId: hotel._id,
            roleName: "Owner",
            order: 1,
            roleDescription: "Owner",
            canUpdateRestaurantImg: true,
            canUpdateRestaurantDetails: true,
            adminPower: true,
            canAddMember: true
        });

        hotel = await Hotel.findByIdAndUpdate(
            hotel._id,
            { $push: { roleIds: role._id } },
            { new: true }
        );

        const member = await Member.create({
            sellerId: seller._id,
            restaurantId: hotel._id,
            roleId: role._id
        });

        await Role.findByIdAndUpdate(
            role._id,
            { $push: { memberList: member._id } }
        );

        const updatedSeller = await Seller.findByIdAndUpdate(
            seller._id,
            { $push: { restaurantIDs: hotel._id } },
            { new: true }
        );

        return { success: true, seller: JSON.parse(JSON.stringify(updatedSeller)) };
        
    } catch (err) {
        throw new Error(err)
    }
};

export const updateHotelImage = async (formData) => {
    try {
        const { seller } = await isSellerAuthenticated();

        const hotelId = formData.get("hotelId");
        const file = formData.get("updateHotelImage");

        if (!hotelId || !file) {
            throw new Error("Hotel ID and image are required");
        }

        const uploadDir = path.join(process.cwd(), "public/uploads");
        const filePath = path.join(uploadDir, file.name);

        await connectDB();

        const hotel = await Hotel.findOne({
            _id: hotelId,
            sellerId: seller._id
        });

        if (!hotel) {
            throw new Error("Hotel not found");
        }

        // Delete the old image if exists
        const oldImagePath = path.join(uploadDir, hotel.imgUrl);
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }

        // Save the new image
        const buffer = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));

        hotel.imgUrl = file.name;
        await hotel.save();

        return { success: true, filename: file.name };

    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const getFoodItemsWithCategories = async (hotelId) => {
    try {
        const seller = await isSellerAuthenticated();

        if (!hotelId) {
            throw new Error("Hotel ID not provided");
        }

        await connectDB();

        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: seller._id
        });

        if (!member) {
            throw new Error("You are not a member of this hotel");
        }

        const categories = await FoodCategory.find({
            restaurantId: hotelId
        }).populate("foodItemIds");
        return { success: true, categories:JSON.parse(JSON.stringify(categories)) };
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
};

export const getHotelById = async (hotelId) => {
    try {
        if (!hotelId) {
            throw new Error("Hotel ID not provided");
        }

        await connectDB();

        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            throw new Error("Hotel not found");
        }

        return { success: true, hotel:JSON.parse(JSON.stringify(hotel)) };
    } catch (error) {
        throw new Error(error)
    }
};

// export const getHotelColors = async () => {
//     try {
//         return { success: true, colors: static_colors };
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// };

// export const changeHotelColor = async (hotelId, color) => {
//     try {
//         const { seller } = await isSellerAuthenticated();
//         if (!seller) {
//             throw new Error("Unauthorized");
//         }

//         if (!static_colors.includes(color)) {
//             throw new Error("Invalid color");
//         }

//         await connectDB();

//         const member = await Member.findOne({
//             sellerId: seller._id,
//             restaurantId: hotelId
//         });

//         if (!member) {
//             throw new Error("Seller not found");
//         }

//         const memberRole = await Role.findOne({
//             _id: member.roleId,
//             restaurantId: hotelId
//         });

//         if (!memberRole || !memberRole.adminPower) {
//             throw new Error("Insufficient permissions");
//         }

//         const hotel = await Hotel.findByIdAndUpdate(
//             hotelId,
//             { colors: color },
//             { new: true }
//         );

//         if (!hotel) {
//             throw new Error("Hotel not found");
//         }

//         return { success: true, message: "Color updated successfully" };
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// };

export const searchRestaurants = async ({minrate, mintotalrate, search, page = 1, limit = 10 }) => {
    try {
        await connectDB();

        let ratingCondition = {};
        if (minrate) {
            const minRate = parseFloat(minrate) || 0;
            ratingCondition = { avgreview: { $gte: minRate } };
        }

        let totalRatingCondition = {};
        if (mintotalrate) {
            const minTotalRate = parseInt(mintotalrate) || 0;
            totalRatingCondition = { totalReview: { $gte: minTotalRate } };
        }
        console.log(search)
        let searchQuery = {};
        if (search) {
            searchQuery = { name: { $regex: search, $options: 'i' } };
        }

        const queryConditions = {
            ...searchQuery,
            ...ratingCondition,
            ...totalRatingCondition
        };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const hotels = await Hotel.find(queryConditions)
            .limit(parseInt(limit))
            .skip(Math.max(skip, 0));

        return { success: true, hotels:JSON.parse(JSON.stringify(hotels)) };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const searchFoodItems = async ({ minrate, mintotalrate, search, minPrice = 0, maxPrice, page = 1, limit = 10 }) => {
    try {
        await connectDB();

        let ratingCondition = {};
        if (minrate) {
            const minRate = parseFloat(minrate) || 0;
            ratingCondition = { avgreview: { $gte: minRate } };
        }

        let totalRatingCondition = {};
        if (mintotalrate) {
            const minTotalRate = parseInt(mintotalrate) || 0;
            totalRatingCondition = { totalReview: { $gte: minTotalRate } };
        }

        let searchQuery = {};
        if (search) {
            searchQuery = { name: { $regex: search, $options: 'i' } };
        }

        let priceCondition = {};
        if (minPrice || maxPrice) {
            priceCondition.price = {};
            if (minPrice) priceCondition.price.$gte = parseFloat(minPrice);
            if (maxPrice) priceCondition.price.$lte = parseFloat(maxPrice);
        }

        const queryConditions = {
            ...searchQuery,
            ...ratingCondition,
            ...totalRatingCondition,
            ...priceCondition,
        };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const foodItems = await FoodItem.find(queryConditions)
            .limit(parseInt(limit))
            .skip(Math.max(skip, 0));

        const totalItems = await FoodItem.countDocuments(queryConditions);

        return {
            success: true,
            foodItems:JSON.parse(JSON.stringify(foodItems)),
            pagination: {
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit),
                totalItems
            }
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateHotelTaxData = async ( hotelId, gstCharge, serviceCharge ) => {
    try {
        
        const parsedGstCharge = parseFloat(gstCharge);
        const parsedServiceCharge = parseFloat(serviceCharge);

        if (isNaN(parsedGstCharge) || isNaN(parsedServiceCharge)) {
            throw new Error("Please provide valid numerical values for GST Charge and Service Charge.");
        }
        
        const seller=await isSellerAuthenticated()

        if (!hotelId) {
            throw new Error("Hotel Id not found");
        }
        
        await connectDB();
        const member = await Member.findOne({
            sellerId:(seller._id).toString(),
            restaurantId: hotelId
        });
        console.log(member)
        if (!member) {
            throw new Error("Seller not found");
        }

        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId
        });
        if (!memberRole) {
            throw new Error("You are not a member of this hotel");
        }

        if (!memberRole.adminPower) {
            throw new Error("You do not have permission to do changes");
        }

        const hotel = await Hotel.findOneAndUpdate(
            { _id: hotelId },
            {
                hotelGSTTax: parsedGstCharge,
                hotelServiceTax: parsedServiceCharge
            },
            { new: true }
        );

        if (!hotel) {
            throw new Error("Hotel not found");
        }

        return {success:true, hotel:JSON.parse(JSON.stringify(hotel))}
    } catch (error) {
        console.log(error)
        throw new Error(error.message || "Something went wrong");
    }
};
