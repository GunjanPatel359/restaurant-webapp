"use server"

import { connectDB } from "@/db/Database";
import { isSellerAuthenticated } from "@/lib/authMiddleware";
import FoodOrder from "@/models/foodOrder";
import Member from "@/models/member";
import Role from "@/models/role";

export const changeOrderStatus = async (orderTableId,foodOrderId, status) => {
    try {
        if (!foodOrderId) {
            throw new Error('Invalid food order id');
        }

        // Fetch the seller by calling isSellerAuthenticated
        const seller = await isSellerAuthenticated();  // Get seller object, no req necessary
        await connectDB()
        const member = await Member.findOne({
            sellerId: seller._id // Use the seller object returned
        });

        if (!member) {
            throw new Error('Seller not found');
        }

        const foodOrder = await FoodOrder.findOne({
            _id: foodOrderId,
            restaurantId: member.restaurantId
        });

        if (!foodOrder) {
            throw new Error('Food order not found');
        }

        const memberRole = await Role.findOne({
            _id: member.roleId
        });

        if (!memberRole) {
            throw new Error('Member role not found');
        }

        if (!memberRole.adminPower && !memberRole.canManageOrder) {
            throw new Error('You do not have permission to change order status');
        }

        if (foodOrder.status === 'Completed') {
            throw new Error('Order is already Completed');
        }

        const updatedOrder = await FoodOrder.findOneAndUpdate(
            { _id: foodOrderId },
            { status: status }
        );

        // socket.emit("restaurant/hotel/order-tables/orderTableId", {
        //     hotelId: JSON.parse(JSON.stringify(updatedOrder.restaurantId)),
        //     orderTableId:JSON.parse(JSON.stringify(orderTableId))
        // });

        return { success: true, message: 'Order status changed successfully' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
