"use server"
import path from "path"
import fs from "fs"
import { connectDB } from "@/db/Database";
import { isSellerAuthenticated } from "@/lib/authMiddleware";
import FoodCategory from "@/models/foodCategory";
import FoodItem from "@/models/foodItem";
import Member from "@/models/member";
import Role from "@/models/role";


export const createFoodItem = async (formData, hotelId) => {
    try {
        const seller = await isSellerAuthenticated(); 

        const name = formData.get("name");
        const description = formData.get("description");
        const price = formData.get("price");
        const veg = formData.get("veg");
        const categoryId = formData.get("categoryId");
        const foodTypes = formData.get("foodTypes");
        const smallDescription = formData.get("smallDescription");

        if (!name || !description || !price || !categoryId) {
            throw new Error("Please provide all required fields");
        }
        await connectDB()
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId
        });
        if (!member) {
            throw new Error("You are not the member of this restaurant");
        }

        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId
        });

        if (!memberRole.adminPower && !memberRole.canManageFoodItemData) {
            throw new Error("You don't have permission to create a food item");
        }

        const category = await FoodCategory.findOne({
            _id: categoryId,
            restaurantId: hotelId
        });

        if (!category) {
            throw new Error("Category not found");
        }

        const file = formData.get("item-image");
        if (!file) {
            throw new Error("Image file is required");
        }

        const uploadDir = path.join(process.cwd(), "public/uploads");
        const filePath = path.join(uploadDir, file.name);

        const buffer = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));

        const foodItem = await FoodItem.create({
            name,
            description,
            price,
            imageUrl: `/${file.name}`,
            veg,
            foodCategoryId: category._id,
            categoryName: category.categoryName,
            foodTypes: JSON.parse(foodTypes),
            smallDescription,
            restaurantId: hotelId,
            order: category.foodItemIds.length + 1
        });

        if (!foodItem) {
            throw new Error("Could not create food item");
        }

        category.foodItemIds.push(foodItem._id);
        await category.save();

        return { success: true, message: "Food item created successfully" };
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
};

export const updateFoodItemWithoutImage = async (formData, hotelId, foodItemId) => {
    try {
        const seller = await isSellerAuthenticated();

        // Extract data from formData
        const name = formData.get('name');
        const description = formData.get('description');
        const price = formData.get('price');
        const veg = formData.get('veg') === 'true';  // Convert string to boolean
        const categoryId = formData.get('categoryId');
        const smallDescription = formData.get('smallDescription');
        const foodTypes = formData.get('foodTypes');

        if (!hotelId || !foodItemId) {
            throw new Error("Hotel ID and Food Item ID are required.");
        }

        if (!name || !description || !price || !categoryId) {
            throw new Error("All required fields (name, description, price, categoryId) must be provided.");
        }

        await connectDB();

        // Check seller membership
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId
        });

        if (!member) {
            throw new Error("You are not authorized to update this restaurant's food items.");
        }

        // Role and permission check
        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId
        });

        if (!memberRole.adminPower && !memberRole.canManageFoodItemData) {
            throw new Error("Insufficient permissions to update food items.");
        }

        // Parse foodTypes
        let foodType;
        try {
            foodType = JSON.parse(foodTypes || '[]');
        } catch (error) {
            throw new Error("Invalid format for food types.");
        }

        // Check if category exists
        const category = await FoodCategory.findOne({
            _id: categoryId,
            restaurantId: hotelId
        });

        if (!category) {
            throw new Error("Specified category does not exist.");
        }

        // Perform the update without modifying the image
        const updatedFoodItem = await FoodItem.findOneAndUpdate(
            {
                _id: foodItemId,
                restaurantId: hotelId,
                foodCategoryId: category._id
            },
            {
                name,
                description,
                price,
                veg,
                categoryName: category.categoryName,
                foodTypes: foodType,
                smallDescription
            },
            { new: true }
        );

        if (!updatedFoodItem) {
            throw new Error("Failed to update food item. It may not exist or belong to this category.");
        }

        return {
            success: true,
            message: "Food item updated successfully."
        };

    } catch (error) {
        console.error("Error updating food item without image:", error.message);
        throw new Error(error.message || "An unexpected error occurred while updating food item.");
    }
};

export const updateFoodItemWithImage = async (formdata, hotelId, foodItemId, categoryId) => {
    try {
        const seller = await isSellerAuthenticated();

        if (!hotelId || !foodItemId || !categoryId) {
            throw new Error("Hotel ID, Food Item ID, and Category ID are required.");
        }

        await connectDB();

        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId
        });

        if (!member) {
            throw new Error("You are not a member of this restaurant.");
        }

        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId
        });

        if (!memberRole.adminPower && !memberRole.canManageFoodItemData) {
            throw new Error("You don't have permission to update food items.");
        }

        // Parse FormData properly
        const name = formdata.get('name');
        const description = formdata.get('description');
        const price = formdata.get('price');
        const veg = formdata.get('veg') === 'true';
        const foodTypes = JSON.parse(formdata.get('foodTypes') || '[]');
        const smallDescription = formdata.get('smallDescription');
        const imageFile = formdata.get('item-image');

        if (!name || !description || !price || !imageFile) {
            throw new Error("All fields (name, description, price, and image) are required.");
        }

        const category = await FoodCategory.findOne({
            _id: categoryId,
            restaurantId: hotelId
        });

        if (!category) {
            throw new Error("Category not found.");
        }

        const foodItem = await FoodItem.findOne({
            _id: foodItemId,
            restaurantId: hotelId,
            foodCategoryId: category._id
        });

        if (!foodItem) {
            throw new Error("Food item not found.");
        }

        // Save the uploaded image
        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filename = `${Date.now()}-${imageFile.name}`;
        const filepath = path.join(uploadDir, filename);
        const fileBuffer = Buffer.from(await imageFile.arrayBuffer());

        fs.writeFileSync(filepath, fileBuffer);

        // Delete old image if it exists
        if (foodItem.imageUrl) {
            const oldImagePath = path.join(uploadDir, foodItem.imageUrl);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Update food item
        const updatedFoodItem = await FoodItem.findOneAndUpdate(
            { _id: foodItemId, restaurantId: hotelId },
            {
                name,
                description,
                price,
                imageUrl: filename,
                veg,
                categoryName: category.categoryName,
                foodTypes,
                smallDescription
            },
            { new: true }
        );

        if (!updatedFoodItem) {
            fs.unlinkSync(filepath);  // Rollback uploaded image if update fails
            throw new Error("Failed to update food item.");
        }

        return {
            success: true,
            message: "Food item updated successfully."
        };

    } catch (error) {
        console.error("Error updating food item:", error.message);
        throw new Error(error.message || "An unexpected error occurred.");
    }
};

export const deleteFoodItem = async (hotelId, foodItemId) => {
    try {
        const  seller  = await isSellerAuthenticated();

        if (!hotelId || !foodItemId) {
            throw new Error("Please provide hotel ID and food item ID");
        }

        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId
        });

        if (!member) {
            throw new Error("You are not the member of this restaurant");
        }

        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId
        });

        if (!memberRole.adminPower && !memberRole.canManageFoodItemData) {
            throw new Error("You don't have permission to delete food item");
        }

        const foodItem = await FoodItem.findOneAndDelete({
            _id: foodItemId,
            restaurantId: hotelId
        });

        if (!foodItem) {
            throw new Error("Could not delete food item");
        }

        // Update the food category by removing the food item ID
        await FoodCategory.findOneAndUpdate(
            { _id: foodItem.foodCategoryId },
            { $pull: { foodItemIds: foodItem._id } }
        );

        return { success: true, message: "Food item deleted successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getAllFoodItems = async (hotelId) => {
    try {
        if (!hotelId) {
            throw new Error("Please provide hotel id");
        }

        const foodItems = await FoodCategory.find({ restaurantId: hotelId }).populate("foodItemIds");

        if (foodItems.length <= 0) {
            throw new Error("No food items found");
        }

        return { success: true, food: JSON.parse(JSON.stringify(foodItems)) };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getFoodItemById = async (foodItemId) => {
    try {
        if (!foodItemId) {
            throw new Error("Food ID is missing");
        }

        const foodItem = await FoodItem.findOne({ _id: foodItemId });

        if (!foodItem) {
            throw new Error("Food item not found");
        }

        return { success: true, foodItem:JSON.parse(JSON.stringify(foodItem)) };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
