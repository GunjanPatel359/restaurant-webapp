"use server"
import { connectDB } from "@/db/Database";
import { isAuthenticated, isSellerAuthenticated } from "@/lib/authMiddleware";
import FoodItem from "@/models/foodItem";
import FoodOrder from "@/models/foodOrder";
import Hotel from "@/models/hotel";
import Member from "@/models/member";
import OrderTable from "@/models/orderTable";
import OrderTableLogs from "@/models/orderTableLogs";
import Role from "@/models/role";
import User from "@/models/user";


export const getAllTables = async ( hotelId ) => {
    try {
        if (!hotelId) {
            throw new Error("Hotel ID is required");
        }

        // Authenticate seller
        const seller = await isSellerAuthenticated();

        // Connect to the database
        await connectDB();

        // Check if seller is associated with the hotel
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId,
        });

        if (!member) {
            throw new Error("Seller is not associated with this hotel");
        }

        // Fetch hotel and populate tables
        const hotel = await Hotel.findOne({
            _id: hotelId,
        }).populate("tableIds");

        if (!hotel) {
            throw new Error("Hotel not found");
        }

        // Return the hotel with populated tables
        return {
            success: true,
            hotel:JSON.parse(JSON.stringify(hotel)),
        };
    } catch (error) {
        console.error("Error fetching tables:", error.message);
        throw new Error(error.message || "Failed to fetch tables");
    }
};

export const createOrderTable = async (hotelId, tableNumber, tableDescription, seats) => {
    try {
        if (!tableNumber || !tableDescription || !seats) {
            throw new Error("Please provide all required fields (tableNumber, tableDescription, seats).");
        }

        if (!hotelId) {
            throw new Error("Hotel ID is required.");
        }

        // Authenticate the seller
        const seller = await isSellerAuthenticated();

        // Connect to the database
        await connectDB();

        // Check if seller is a member of the hotel
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId
        });

        if (!member) {
            throw new Error("Seller is not authorized to create tables for this hotel.");
        }

        // Fetch role and verify permissions
        const role = await Role.findOne({ _id: member.roleId });

        if (!role || (!role.adminPower && !role.canManageOrderTableInfo)) {
            throw new Error("You do not have permission to manage table orders.");
        }

        // Create the order table
        const orderTable = await OrderTable.create({
            tableNumber,
            tableDescription,
            seats,
            restaurantId: hotelId
        });

        if (!orderTable) {
            throw new Error("Failed to create the table.");
        }

        // Update the hotel to link the new table
        await Hotel.findOneAndUpdate(
            { _id: hotelId },
            { $push: { tableIds: orderTable._id } }
        );

        return {
            success: true,
            message: "Table created successfully.",
        };
    } catch (error) {
        console.error("Error creating table:", error.message);
        throw new Error(error.message || "Failed to create table.");
    }
};

export const getAllAvailableTables = async ( hotelId ) => {
    try {
        if (!hotelId) {
            throw new Error("Hotel ID is required.");
        }

        // Authenticate seller
        const seller = await isSellerAuthenticated();

        // Connect to the database
        await connectDB();

        // Check if seller is a member of the hotel
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId
        });

        if (!member) {
            throw new Error("Seller is not associated with this hotel.");
        }

        // Fetch available tables for the hotel
        const tables = await OrderTable.find({
            restaurantId: hotelId,
            status: "Available"
        });

        return {
            success: true,
            tables:JSON.parse(JSON.stringify(tables))
        };
    } catch (error) {
        console.error("Error fetching available tables:", error.message);
        throw new Error(error.message || "Failed to fetch available tables.");
    }
};

export const getAllOccupiedTables = async (hotelId) => {
    try {
        if (!hotelId) {
            throw new Error("Hotel ID is required.");
        }

        // Authenticate seller
        const seller = await isSellerAuthenticated();

        // Connect to the database
        await connectDB();

        // Check if seller is a member of the hotel
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId
        });

        if (!member) {
            throw new Error("Seller is not associated with this hotel.");
        }

        // Fetch occupied tables for the hotel
        const tables = await OrderTable.find({
            restaurantId: hotelId,
            status: "Occupied"
        });

        return {
            success: true,
            tables:JSON.parse(JSON.stringify(tables))
        };
    } catch (error) {
        console.error("Error fetching occupied tables:", error.message);
        throw new Error(error.message || "Failed to fetch occupied tables.");
    }
};

export const getAllBillingTables = async ({ hotelId }) => {
    try {
        if (!hotelId) {
            throw new Error("Hotel ID is required.");
        }

        // Authenticate the seller
        const seller = await isSellerAuthenticated();

        // Connect to the database
        await connectDB();

        // Check if the seller is a member of the hotel
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId
        });

        if (!member) {
            throw new Error("Seller is not associated with this hotel.");
        }

        // Fetch tables that are in 'Billing' status for the hotel
        const tables = await OrderTable.find({
            restaurantId: hotelId,
            status: "Billing"
        });

        return {
            success: true,
            tables:JSON.parse(JSON.stringify(tables))
        };
    } catch (error) {
        console.error("Error fetching billing tables:", error.message);
        throw new Error(error.message || "Failed to fetch billing tables.");
    }
};

export const getFoodItemFromOrder = async ( hotelId, foodOrderId ) => {
    try {
        if (!hotelId || !foodOrderId) {
            throw new Error("hotelId and food order id are required");
        }

        // Authenticate the seller
        const seller = await isSellerAuthenticated();

        // Connect to the database
        await connectDB();

        // Check if the seller is a member of the hotel
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId
        });

        if (!member) {
            throw new Error("Seller is not associated with this hotel.");
        }

        // Fetch the food order and its associated food item
        const foodItem = await FoodOrder.findById(foodOrderId).populate("foodItemId");

        if (!foodItem) {
            throw new Error("Food order not found.");
        }

        // Return the found food item
        return {
            success: true,
            fooditem: JSON.parse(JSON.stringify(foodItem))
        };
    } catch (error) {
        console.error("Error fetching food order:", error.message);
        throw new Error(error.message || "Failed to fetch food order.");
    }
};

export const getOrderTableDetails = async ( hotelId, orderTableId ) => {
    try {
        // Ensure both hotelId and orderTableId are provided
        if (!hotelId || !orderTableId) {
            throw new Error("hotelId and orderTableId are required");
        }

        // Authenticate the seller
        const seller = await isSellerAuthenticated();

        // Connect to the database
        await connectDB();

        // Check if the seller is a member of the hotel
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId
        });

        if (!member) {
            throw new Error("Seller is not associated with this hotel.");
        }

        // Fetch the order table details, populating necessary fields
        const orderTable = await OrderTable.findById(orderTableId)
            .populate('restaurantId')
            .populate({ path: 'orders', populate: { path: 'foodItemId' } });

        if (!orderTable) {
            throw new Error("Order table not found.");
        }

        // Return the order table details
        return {
            success: true,
            orderTableDetails: JSON.parse(JSON.stringify(orderTable))
        };
    } catch (error) {
        console.error("Error fetching order table details:", error.message);
        throw new Error(error.message || "Failed to fetch order table details.");
    }
};

export const acquireTable = async ( hotelId, orderTableId, uniqueString, memberId ) => {
    try {
        if (!hotelId || !orderTableId || !uniqueString || !memberId) {
            throw new Error("hotelId, orderTableId, and memberId are required.");
        }

        const user=await isAuthenticated()

        // Connect to the database
        await connectDB();

        // Check if the table exists
        const table = await OrderTable.findOne({
            restaurantId: hotelId,
            _id: orderTableId
        });

        if (!table) {
            throw new Error("Table not found.");
        }

        // Check if the table is already assigned
        if (table.userId) {
            if (table.userId.toString() === user._id.toString()) {
                return { success: true, message: "You already have acquired the table." };
            } else {
                throw new Error("Table is already assigned to a user.");
            }
        }

        // Validate QR code
        if (table.randomString !== uniqueString) {
            throw new Error("Invalid QR code.");
        }

        // Find the member associated with this hotel
        const member = await Member.findOne({
            _id: memberId,
            restaurantId: hotelId
        });

        if (!member) {
            throw new Error("Member is not associated with this hotel.");
        }

        // Assign the table to the user
        const assignTable = await OrderTable.findOneAndUpdate(
            { _id: orderTableId, restaurantId: hotelId },
            {
                userId: user._id,
                status: "Occupied",
                memberId: memberId,
                randomString: 0,
                offline: false,
                orders: []
            }
        );

        if (!assignTable) {
            throw new Error("Table not found.");
        }

        // Update the user's current assigned hotels
        const updateUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $push: { currentlyAssignedHotels: orderTableId } }
        );

        return { success: true, message: "Table acquired successfully." };
    } catch (error) {
        console.error("Error acquiring table:", error.message);
        throw new Error(error.message || "An error occurred while acquiring the table.");
    }
};

export const getUserTableDetails = async ( hotelId, orderTableId ) => {
    try {
        if (!hotelId || !orderTableId) {
            throw new Error("hotelId and orderTableId are required.");
        }
        const user=await isAuthenticated()
        // Connect to the database
        await connectDB();

        // Fetch the order table details assigned to the user
        const orderTable = await OrderTable.findOne({
            _id: orderTableId,
            restaurantId: hotelId,
            userId: user._id
        }).populate('restaurantId')
          .populate({ path: "orders", populate: { path: "foodItemId" } });

        if (!orderTable) {
            throw new Error("Table is not assigned to you.");
        }

        // Return the order table details if found
        return { success: true, orderTableDetails: JSON.parse(JSON.stringify(orderTable)) };
    } catch (error) {
        console.error("Error fetching user table details:", error.message);
        throw new Error(error.message || "An error occurred while fetching the table details.");
    }
};

export const handleOfflineBooking = async ( hotelId, orderTableId ) => {
    try {
        if (!hotelId || !orderTableId) {
            throw new Error("hotelId and orderTableId are required.");
        }

        const seller=await isSellerAuthenticated()

        await connectDB();
        // Find the table with status "Available"
        const table = await OrderTable.findOne({
            restaurantId: hotelId,
            _id: orderTableId,
            status: "Available"
        });
        
        if (!table) {
            throw new Error("Table not found.");
        }

        // Update the table status to "Occupied" and mark as offline
        const assignTable = await OrderTable.findOneAndUpdate(
            { _id: orderTableId, restaurantId: hotelId },
            { status: "Occupied", offline: true, orders: [] }
        );
        
        if (!assignTable) {
            throw new Error("Table update failed.");
        }

        // socket.emit("restaurant/hotel/order-tables", hotelId);

        return { success: true };

    } catch (error) {
        console.error("Error in offline booking:", error.message);
        throw new Error(error.message || "An error occurred while processing the offline booking.");
    }
};

export const handleBackToAvailable = async ( hotelId, orderTableId ) => {
    try {
        // Validate the required parameters
        if (!hotelId || !orderTableId) {
            throw new Error("hotelId and orderTableId are required.");
        }

        const seller=await isSellerAuthenticated()
        await connectDB();

        // Validate seller's membership in the hotel
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: seller._id
        });

        if (!member) {
            throw new Error("Seller not found.");
        }

        // Validate seller's permissions
        const memberRole = await Role.findOne({
            _id: member.roleId
        });

        if (!memberRole) {
            throw new Error("Seller role not found.");
        }

        if (!memberRole.adminPower && !memberRole.canManageOrder) {
            throw new Error("Seller does not have permission to manage orders.");
        }

        // Find the table by hotel and orderTableId
        const table = await OrderTable.findOne({
            restaurantId: hotelId,
            _id: orderTableId
        });

        if (!table) {
            throw new Error("Table not found.");
        }

        // Find the hotel and check the cancel limit
        const hotel = await Hotel.findOne({ _id: hotelId });
        if (!hotel) {
            throw new Error("Hotel not found.");
        }

        if (hotel.orderCancelCount >= hotel.orderCancelLimit) {
            throw new Error("Hotel order cancel limit reached.");
        }

        // Increment the order cancel count for the hotel
        hotel.orderCancelCount += 1;
        await hotel.save();

        // Log the order table if it's not already available
        if (table.status !== "Available") {
            await OrderTableLogs.create({
                orderTableId: table._id,
                restaurantId: table.restaurantId,
                userId: table?.userId,
                orders: table.orders,
                memberId: table.memberId,
                offline: table.offline,
                orderStatus: "Cancelled"
            });
        }

        // Update the table to "Available"
        const assignTable = await OrderTable.findOneAndUpdate(
            { _id: orderTableId, restaurantId: hotelId },
            {
                status: "Available",
                offline: false,
                randomString: Date.now(),
                orders: [],
                memberId: null,
                userId: null,
                seatCount: table.seatCount + 1
            },
            { new: false }
        );

        if (!assignTable) {
            throw new Error("Table update failed.");
        }

        // Update the user by pulling the table from their assigned hotels
        const user = await User.findOneAndUpdate(
            { _id: assignTable.userId },
            { $pull: { currentlyAssignedHotels: assignTable._id } }
        );

        return { success: true };

    } catch (error) {
        console.error("Error in back-to-available:", error.message);
        throw new Error(error.message || "An error occurred while making the table available.");
    }
};

export const handleGetAllTables = async (hotelId) => {
    try {
        if (!hotelId) {
            throw new Error("hotelId is missing.");
        }

        // Retrieve seller info via isSellerAuthenticated
        const seller = await isSellerAuthenticated();
        if (!seller || !seller._id) {
            throw new Error("Seller not authenticated.");
        }

        await connectDB();

        // Validate seller's membership in the hotel
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: seller._id
        });

        if (!member) {
            throw new Error("Seller not found.");
        }

        // Validate seller's role permissions
        const memberRole = await Role.findOne({
            _id: member.roleId
        });

        if (!memberRole) {
            throw new Error("Seller role not found.");
        }

        // Fetch all tables for the given hotel
        const tables = await OrderTable.find({
            restaurantId: hotelId,
        });

        if (!tables || tables.length === 0) {
            throw new Error("No tables found for the specified hotel.");
        }

        return { success: true, tables:JSON.parse(JSON.stringify(tables)) };
    } catch (error) {
        console.error("Error in handleGetAllTables:", error.message);
        throw new Error(error.message || "An error occurred while fetching tables.");
    }
};

export const handleFoodItemOrder = async ( hotelId, orderTableId, orderItems ) => {
    try {
        // Validation for hotelId and orderTableId
        if (!hotelId || !orderTableId) {
            throw new Error("hotelId and orderTableId are missing.");
        }

        // Retrieve seller info via isSellerAuthenticated
        const seller = await isSellerAuthenticated();
        if (!seller || !seller._id) {
            throw new Error("Seller not authenticated.");
        }

        await connectDB();

        // Validate seller's membership in the hotel
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: seller._id
        });

        if (!member) {
            throw new Error("Seller not found.");
        }

        // Validate seller's role permissions
        const memberRole = await Role.findOne({
            _id: member.roleId
        });

        if (!memberRole) {
            throw new Error("Seller role not found.");
        }

        // Find the order table
        const ordertable = await OrderTable.findOne({
            _id: orderTableId,
            restaurantId: hotelId
        });

        if (!ordertable) {
            throw new Error("Order table not found.");
        }

        if (ordertable.status === "Available") {
            throw new Error("Table has no customer.");
        }

        if (!memberRole.adminPower && !memberRole.canManageOrder) {
            throw new Error("Seller does not have permission to manage order.");
        }

        // Process the order items and check if food items exist
        const checkOrder = orderItems.map(async (item) => {
            try {
                const foodItem = await FoodItem.findOne({
                    _id: item.item._id,
                    restaurantId: hotelId
                });
                return foodItem;
            } catch (error) {
                throw new Error("Food item not found.");
            }
        });

        let result;
        await Promise.all(checkOrder)
            .then((values) => {
                result = values.map((item) => {
                    if (item == null) {
                        throw new Error("Food item is not found.");
                    }
                    return item;
                });
            })
            .catch((error) => {
                throw new Error("An error occurred during food item retrieval");
            });

        // Create the food orders
        const orderFoodPromises = orderItems.map((item) => {
            return FoodOrder.create({
                foodItemId: item.item._id,
                restaurantId: hotelId,
                price: result.find((temp) => temp._id === item.item._id)?.price,
                quantity: item.quantity
            });
        });

        let createdItems;
        await Promise.all(orderFoodPromises)
            .then((values) => {
                createdItems = values.map((item) => item._id);
            })
            .catch((error) => {
                throw new Error("An error occurred during order food creation.");
            });

        // Update the table with the created order items
        const table = await OrderTable.findOneAndUpdate(
            { _id: orderTableId },
            {
                $push: { orders: createdItems }
            }
        );

        if (!table) {
            throw new Error("Table not found.");
        }

        return { success: true, message: "Order created successfully." };
    } catch (error) {
        console.error("Error in handleFoodItemOrder:", error.message);
        throw new Error(error.message || "An error occurred while creating the food order.");
    }
};

export const handleUserOrder = async ( hotelId, orderTableId, orderItems ) => {
    try {
        // Validation for hotelId and orderTableId
        if (!hotelId || !orderTableId) {
            throw new Error("hotelId and orderTableId are missing.");
        }

        // Retrieve user info via isAuthenticated
        const user = await isAuthenticated();
        if (!user || !user._id) {
            throw new Error("User not authenticated.");
        }

        await connectDB();

        // Validate if the order table belongs to the hotel and user
        const orderTable = await OrderTable.findOne({
            _id: orderTableId,
            restaurantId: hotelId,
            userId: user._id,
        });

        if (!orderTable) {
            throw new Error("Order table not found.");
        }

        // Process the order items and check if food items exist
        const checkOrder = orderItems.map(async (item) => {
            try {
                const foodItem = await FoodItem.findOne({
                    _id: item.item._id,
                    restaurantId: hotelId
                });
                return foodItem;
            } catch (error) {
                throw new Error("Food item not found.");
            }
        });

        let result;
        await Promise.all(checkOrder)
            .then((values) => {
                result = values.map((item) => {
                    if (item == null) {
                        throw new Error("Food item is not found.");
                    }
                    return item;
                });
            })
            .catch((error) => {
                throw new Error("An error occurred during food item retrieval");
            });

        // Create the food orders
        const orderFoodPromises = orderItems.map((item) => {
            return FoodOrder.create({
                foodItemId: item.item._id,
                restaurantId: hotelId,
                price: result.find((temp) => temp._id === item.item._id)?.price,
                quantity: item.quantity
            });
        });

        let createdItems;
        await Promise.all(orderFoodPromises)
            .then((values) => {
                createdItems = values.map((item) => item._id);
            })
            .catch((error) => {
                throw new Error("An error occurred during order food creation.");
            });

        // Update the table with the created order items
        const table = await OrderTable.findOneAndUpdate(
            { _id: orderTableId },
            {
                $push: { orders: createdItems }
            }
        );

        if (!table) {
            throw new Error("Table not found.");
        }

        return { success: true, message: "Order created successfully." };
    } catch (error) {
        console.error("Error in handleUserOrder:", error.message);
        throw new Error(error.message || "An error occurred while creating the user food order.");
    }
};

export const updateOrderTable = async ({ hotelId, orderTableId, tableDetails }) => {
    try {
        const { tableNumber, tableDescription, seats } = tableDetails;
        
        // Validation for required fields
        if (!hotelId || !orderTableId) {
            throw new Error("Hotel ID and Order Table ID are required.");
        }
        
        if (!tableNumber && !tableDescription && !seats) {
            throw new Error("Table number, table description, and seats are required.");
        }

        await connectDB();

        const seller=await isSellerAuthenticated()
        if (!seller._id) {
            throw new Error("Seller authentication failed.");
        }

        // Validate if the seller is a member of the restaurant
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId
        });

        if (!member) {
            throw new Error("Seller is not a member of this restaurant.");
        }

        // Validate if the seller has the required role to update order table info
        const memberRole = await Role.findOne({ _id: member.roleId });
        if (!memberRole) {
            throw new Error("Seller role not found.");
        }

        if (!memberRole.adminPower && !memberRole.canManageOrderTableInfo) {
            throw new Error("Seller does not have permission to update order table info.");
        }

        // Find and update the order table with new details
        const updatedOrderTable = await OrderTable.findOneAndUpdate(
            { _id: orderTableId, restaurantId: hotelId },
            {
                tableNumber,
                tableDescription,
                seats
            },
            { new: true }
        );

        if (!updatedOrderTable) {
            throw new Error("Order table not found.");
        }

        return { success: true, message: "Order table updated successfully." };
    } catch (error) {
        console.error("Error in handleUpdateOrderTable:", error.message);
        throw new Error(error.message || "An error occurred while updating the order table.");
    }
};

export const deleteOrderTable = async ({ hotelId, orderTableId }) => {
    try {
        // Validate required fields
        if (!hotelId || !orderTableId) {
            throw new Error("Hotel ID and Order Table ID are required.");
        }

        await connectDB();

        const seller=await isSellerAuthenticated()
        if (!seller._id) {
            throw new Error("Seller authentication failed.");
        }

        // Validate if the seller is a member of the restaurant
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId
        });

        if (!member) {
            throw new Error("Seller is not a member of this restaurant.");
        }

        // Validate if the seller has the required role to delete order table info
        const memberRole = await Role.findOne({ _id: member.roleId });
        if (!memberRole) {
            throw new Error("Seller role not found.");
        }

        if (!memberRole.adminPower && !memberRole.canManageOrderTableInfo) {
            throw new Error("Seller does not have permission to delete order table info.");
        }

        // Delete the order table
        const deletedOrderTable = await OrderTable.findOneAndDelete({
            _id: orderTableId,
            restaurantId: hotelId
        });

        if (!deletedOrderTable) {
            throw new Error("Order table not found.");
        }

        return { success: true, message: "Order table deleted successfully." };
    } catch (error) {
        console.error("Error in handleDeleteOrderTable:", error.message);
        throw new Error(error.message || "An error occurred while deleting the order table.");
    }
};
