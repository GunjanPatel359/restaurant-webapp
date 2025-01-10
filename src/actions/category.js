"use server"

import { connectDB } from "@/db/Database";
import { isSellerAuthenticated } from "@/lib/authMiddleware";
import FoodCategory from "@/models/foodCategory";
import Hotel from "@/models/hotel";
import Member from "@/models/member";
import Role from "@/models/role";

export const createCategory = async ({ hotelId, categoryName, description }) => {
    try {
        const seller = await isSellerAuthenticated(); 
        await connectDB();

        if (!hotelId) {
            throw new Error("Hotel ID is not provided");
        }

        const hotel = await Hotel.findOne({ _id: hotelId });
        if (!hotel) {
            throw new Error("Hotel not found");
        }

        if (!categoryName || !description) {
            throw new Error("Please provide all the fields");
        }

        const memberRole = await Member.findOne({
            restaurantId: hotelId,
            sellerId: seller._id, 
        });

        if (!memberRole) {
            throw new Error("You are not a member of this hotel");
        }

        const role = await Role.findOne({
            _id: memberRole.roleId,
            restaurantId: hotelId,
        });

        if (!role.adminPower && !role.canManageFoodItemData) {
            throw new Error("You are not authorized to create a category");
        }

        const category = await FoodCategory.create({
            categoryName,
            description,
            restaurantId: hotelId,
            order: hotel.foodCategoryIds.length || 1,
        });

        if (!category) {
            throw new Error("Category not created");
        }

        hotel.foodCategoryIds.push(category._id);
        await hotel.save();

        return { success: true };

    } catch (error) {
        throw new Error(error.message || 'An error occurred while creating the category');
    }
};

export const editCategory = async ({ hotelId, categoryId, categoryName, description }) => {
    try {
        const seller = await isSellerAuthenticated()
        
        if (!hotelId || !categoryId) {
            throw new Error("Hotel id and category id are not provided");
        }
        
        if (!categoryName || !description) {
            throw new Error("Please provide all the fields");
        }

        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId,
        });

        if (!member) {
            throw new Error("You are not the member of this hotel");
        }

        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId,
        });

        if (!memberRole) {
            throw new Error("You are not the member of this hotel");
        }

        if (!memberRole.adminPower && !memberRole.canManageFoodItemData) {
            throw new Error("You are not authorized to edit category");
        }

        const category = await FoodCategory.findOneAndUpdate(
            { _id: categoryId, restaurantId: hotelId },
            { categoryName, description },
            { new: true }
        );

        if (!category) {
            throw new Error("Could not update category");
        }

        return { success: true, message: "Category updated successfully" };
    } catch (error) {
        throw new Error(error)
    }
};

export const deleteCategory = async ({ hotelId, categoryId }) => {
    try {
        const seller = await isSellerAuthenticated(); // Get seller from authentication function
        
        if (!hotelId || !categoryId) {
            throw new Error("Hotel id and category id are not provided");
        }

        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId,
        });

        if (!member) {
            throw new Error("You are not the member of this hotel");
        }

        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId,
        });

        if (!memberRole) {
            throw new Error("You are not the member of this hotel");
        }

        if (!memberRole.adminPower && !memberRole.canManageFoodItemData) {
            throw new Error("You are not authorized to delete category");
        }

        const category = await FoodCategory.findOneAndDelete({
            _id: categoryId,
            restaurantId: hotelId,
        });

        if (!category) {
            throw new Error("Category not found");
        }

        const updateHotel = await Hotel.findOneAndUpdate(
            { _id: hotelId },
            { $pull: { foodCategoryIds: category._id } }
        );

        if (!updateHotel) {
            throw new Error("Hotel not found");
        }

        const itemIds = category.foodItemIds.map(async (item) => {
            await FoodItem.findOneAndDelete({
                _id: item,
                restaurantId: hotelId,
            });
        });

        const deletedItems = await Promise.all(itemIds);
        console.log(deletedItems);

        return { success: true, message: "Category deleted successfully" };
    } catch (error) {
        console.error(error);
        throw new Error(error)
    }
};