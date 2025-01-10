"use server"
import { connectDB } from "@/db/Database"
import { isSellerAuthenticated } from "@/lib/authMiddleware";
import Member from "@/models/member";
import Role from "@/models/role";
import Seller from "@/models/seller";

export const getMembersWithDetails=async( roleId, hotelId )=>{
    try {
        if (!roleId || !hotelId) {
            throw new Error("All parameters (roleId, hotelId) are required");
        }

        // Authentication: Ensure the seller is authenticated
        const seller = await isSellerAuthenticated();

        await connectDB()
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: seller._id,
        });

        if (!member) {
            throw new Error("Seller is not a member of this hotel");
        }

        // Check the seller's role and permissions
        const memberRole = await Role.findOne({
            _id: member.roleId,
        });

        if (!memberRole) {
            throw new Error("Unauthorized access");
        }

        // Check if the seller has permission to manage members
        if (!memberRole.adminPower && !memberRole.canAddMember) {
            throw new Error("You do not have permission to invite members");
        }

        // Fetch the role and the associated members
        const role = await Role.findOne({
            _id: roleId,
            restaurantId: hotelId,
        }).populate("memberList");

        if (!role) {
            throw new Error("Role is not associated with this hotel");
        }

        // Fetch all the members based on the role
        const members = await Promise.all(
            role.memberList.map(async (item) => {
                return await Seller.findOne({ _id: item.sellerId });
            })
        );

        // Return the role members and roleId as part of the response
        return {
            success: true,
            roleMembers: JSON.parse(JSON.stringify(members)),
            roleId: JSON.parse(JSON.stringify(role._id)),
        };

    } catch (error) {
        console.error(error);
        throw new Error(error.message || "Something went wrong");
    }
}

export const getMemberSellerIds = async ( roleId, hotelId ) => {
    try {
        if (!roleId || !hotelId) {
            throw new Error("All parameters (roleId, hotelId) are required");
        }

        // Authenticate the seller
        const seller = await isSellerAuthenticated();

        // Connect to the database
        await connectDB();

        // Check if the seller is a member of the hotel
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: seller._id,
        });

        if (!member) {
            throw new Error("Seller is not a member of this hotel");
        }

        // Fetch the seller's role
        const memberRole = await Role.findOne({
            _id: member.roleId,
        });

        if (!memberRole) {
            throw new Error("Unauthorized access");
        }

        // Check permissions
        if (!memberRole.adminPower && !memberRole.canAddMember) {
            throw new Error("You do not have permission to invite members");
        }

        // Fetch the role and associated members
        const role = await Role.findOne({
            _id: roleId,
            restaurantId: hotelId,
        }).populate("memberList");

        if (!role) {
            throw new Error("Role is not associated with this hotel");
        }

        // Extract seller IDs from memberList
        const members = role.memberList.map((item) => item.sellerId);

        return {
            success: true,
            members:JSON.parse(JSON.stringify(members))
        };
    } catch (error) {
        console.error("Error fetching seller IDs:", error);
        throw new Error(error.message || "Something went wrong");
    }
};

export const addMember = async ( hotelId, roleId, sellerId ) => {
    try {
        if (!roleId || !hotelId || !sellerId) {
            throw new Error("All parameters (hotelId, roleId, sellerId) are required");
        }

        // Authenticate the seller
        const seller = await isSellerAuthenticated();

        if (sellerId === seller._id.toString()) {
            throw new Error("You cannot add yourself");
        }

        // Connect to the database
        await connectDB();

        // Check if the role being added is an owner or has highest priority
        const roleCheck = await Role.findOne({ _id: roleId });
        if (roleCheck.order === 1 || roleCheck.roleName === "Owner") {
            throw new Error("You cannot add members to this role");
        }

        // Verify the seller is a member of the hotel
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: seller._id,
        });

        if (!member) {
            throw new Error("You are not a member of this hotel");
        }

        // Check the seller's role
        const memberRole = await Role.findOne({ _id: member.roleId });
        if (!memberRole) {
            throw new Error("Unauthorized access");
        }

        // Check permissions
        if (
            !memberRole.adminPower &&
            !memberRole.canAddMember &&
            memberRole.order >= roleCheck.order
        ) {
            throw new Error("You do not have permission to invite members");
        }

        // Check if the seller to be added is already a member
        const addingMember = await Member.findOne({
            sellerId,
            restaurantId: hotelId,
        }).populate("roleId");

        let newMember;

        // If the member doesn't exist, create a new one
        if (!addingMember) {
            newMember = await Member.create({
                sellerId,
                roleId,
                restaurantId: hotelId,
            });

            await Role.findOneAndUpdate(
                { _id: roleId },
                { $push: { memberList: newMember._id } }
            );

            return {
                success: true,
                message: "Member added successfully",
            };
        }

        // Prevent adding owner to another role
        if (
            addingMember.roleId.roleName === "Owner" ||
            addingMember.roleId.order === 1
        ) {
            throw new Error("You cannot add the owner to this role");
        }

        // If the member already belongs to the role
        if (addingMember.roleId._id.toString() === roleId.toString()) {
            return {
                success: true,
                message: "Member is already in this role",
            };
        }

        // Prevent role upgrades if not authorized
        if (addingMember.roleId.order <= memberRole.order) {
            throw new Error(
                "You cannot add a member with a higher role order than yours"
            );
        }

        // Remove the member from their current role
        await Role.findOneAndUpdate(
            { _id: addingMember.roleId },
            { $pull: { memberList: addingMember._id } }
        );

        // Add the member to the new role
        await Role.findOneAndUpdate(
            { _id: roleId },
            { $push: { memberList: addingMember._id } }
        );

        // Update the member's role
        await Member.findOneAndUpdate(
            { _id: addingMember._id },
            { roleId }
        );

        return {
            success: true,
            message: "Member added successfully",
        };
    } catch (error) {
        console.error("Error adding member:", error);
        throw new Error(error.message || "Something went wrong");
    }
};

export const removeMember = async (hotelId, roleId, sellerId) => {
    try {
        if (!roleId || !hotelId || !sellerId) {
            throw new Error("All parameters (hotelId, roleId, sellerId) are required");
        }

        // Authenticate the seller
        const seller = await isSellerAuthenticated();

        // Connect to the database
        await connectDB();

        // Check if the role is an Owner or has the highest priority
        const roleCheck = await Role.findOne({ _id: roleId });
        if (roleCheck.order === 1 || roleCheck.roleName === "Owner") {
            throw new Error("You cannot remove members from this role");
        }

        // Verify the seller is a member of the hotel
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: seller._id,
        });

        if (!member) {
            throw new Error("You are not a member of this hotel");
        }

        // Check the seller's role and permissions
        const memberRole = await Role.findOne({ _id: member.roleId });
        if (!memberRole) {
            throw new Error("Unauthorized access");
        }

        // Verify permissions to remove members
        if (!memberRole.adminPower && !memberRole.canAddMember) {
            throw new Error("You do not have permission to remove members");
        }

        // Find the member to be removed
        const removingMember = await Member.findOne({
            sellerId,
            restaurantId: hotelId,
        }).populate("roleId");

        if (!removingMember) {
            return {
                success: true,
                message: "Member is not part of this hotel",
            };
        }

        // Remove member from role's member list
        await Role.findOneAndUpdate(
            { _id: removingMember.roleId._id },
            { $pull: { memberList: removingMember._id } }
        );

        // Delete the member
        await Member.findOneAndDelete({ _id: removingMember._id });

        return {
            success: true,
            message: "Member removed successfully",
        };
    } catch (error) {
        console.error("Error removing member:", error.message);
        throw new Error(error.message || "Something went wrong");
    }
};

export const checkIsMember = async ( hotelId ) => {
    try {
        if (!hotelId) {
            throw new Error("Hotel ID is required");
        }

        // Authenticate the seller
        const seller = await isSellerAuthenticated();

        // Connect to the database
        await connectDB();

        // Check if the seller is a member of the hotel
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId,
        });

        if (!member) {
            return {
                success: true,
                data: false,
                message: "You are not a member of this hotel",
            };
        }

        return {
            success: true,
            data: true,
        };
    } catch (error) {
        console.error("Error checking membership:", error.message);
        throw new Error(error.message || "Failed to check membership");
    }
};

export const getMemberOfHotel = async ( hotelId ) => {
    try {
        if (!hotelId) {
            throw new Error("Hotel ID is required");
        }

        // Authenticate the seller
        const seller = await isSellerAuthenticated();

        // Connect to the database
        await connectDB();

        // Find the member associated with the hotel
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId,
        });

        if (!member) {
            throw new Error("You are not a member of this hotel");
        }

        // Find the member's role in the hotel
        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId,
        });

        if (!memberRole) {
            throw new Error("Member role not found");
        }

        // Check for admin or order management permissions
        if (!memberRole.adminPower && !memberRole.canManageOrder) {
            throw new Error("You are not authorized to access this route");
        }

        // Return the member ID
        return {
            success: true,
            data: JSON.parse(JSON.stringify(member._id)),
        };
    } catch (error) {
        console.error("Error fetching member of hotel:", error.message);
        throw new Error(error.message || "Failed to fetch member details");
    }
};
