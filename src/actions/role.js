"use server"
import { connectDB } from '@/db/Database'
import { isSellerAuthenticated } from '@/lib/authMiddleware';
import Hotel from '@/models/hotel';
import Member from '@/models/member';

import Role from "@/models/role"

export const getRoleInfo=async(roleId)=>{
    if (!roleId) {
        throw new Error("Role ID is required");
    }
    try {
        // Authenticate seller
        const  seller  = await isSellerAuthenticated();
        
        await connectDB();
        // Fetch the role
        const role = await Role.findOne({ _id: roleId });
        if (!role) {
            throw new Error("Role does not exist");
        }

        // Check membership of seller in restaurant
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: role.restaurantId,
        });

        if (!member) {
            throw new Error("You are not a member of this restaurant");
        }

        // Fetch the role of the current member
        const memberRole = await Role.findOne({ _id: member.roleId });
        if (!memberRole) {
            throw new Error("Member role not found");
        }

        // Permission check
        if (!memberRole.canManageRoles && !memberRole.adminPower) {
            throw new Error("You do not have permission to view this role");
        }

        if (memberRole.order > role.order) {
            throw new Error("You cannot view higher roles");
        }

        return {success:true,role:JSON.parse(JSON.stringify(role))};
    } catch (error) {
        throw new Error(error);
    }
}
///////////////////////////roles////////////////////////
export const createRole=async(hotelId, formData)=>{
    if (!hotelId) {
        throw new Error("Hotel ID is required");
    }

    const {
        roleName,
        roleDescription,
        canUpdateRestaurantImg,
        canUpdateRestaurantDetails,
        canManageRoles,
        adminPower,
        canAddMember
    } = formData;

    if (roleName.toLowerCase() === "owner") {
        throw new Error("Cannot name role 'Owner'");
    }

    await connectDB();

    try {
        // Authenticate seller
        const  seller  = await isSellerAuthenticated();

        // Check if the seller is a member of the hotel
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId
        });

        if (!member) {
            throw new Error("Unauthorized");
        }

        // Fetch the role of the seller in the restaurant
        const role = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId
        });

        if (!role) {
            throw new Error("Unauthorized");
        }

        // Fetch the hotel details
        const hotel = await Hotel.findOne({ _id: hotelId });
        if (!hotel) {
            throw new Error("Hotel not found");
        }

        let newRole;
        const newOrder = hotel.roleIds.length + 1;

        if (role.adminPower) {
            newRole = await Role.create({
                restaurantId: hotelId,
                roleName,
                roleDescription,
                canUpdateRestaurantImg,
                canUpdateRestaurantDetails,
                canAddMember,
                canManageRoles,
                order: newOrder,
                adminPower
            });
        } else if (role.canManageRoles) {
            newRole = await Role.create({
                restaurantId: hotelId,
                roleName,
                roleDescription,
                canUpdateRestaurantImg,
                canUpdateRestaurantDetails,
                canAddMember,
                canManageRoles,
                order: newOrder,
            });
        } else {
            throw new Error("You do not have permission to create roles");
        }

        if (!newRole) {
            throw new Error("Failed to create role");
        }

        // Update the hotel to include the new role
        await Hotel.findByIdAndUpdate(hotelId, {
            $push: { roleIds: newRole._id }
        });

        return { success: true,message:"succesfully created the new role" };
    } catch (error) {
        throw new Error(error.message);
    }
}
///////////////////////////roles////////////////////////
export const editRole=async(roleId, formData)=>{
    if (!roleId) {
        throw new Error("Role ID is required");
    }

    const {
        roleName,
        roleDescription,
        canUpdateRestaurantImg,
        canUpdateRestaurantDetails,
        canManageRoles,
        adminPower,
        canManageFoodItemData,
        canAddMember
    } = formData;

    await connectDB();

    try {
        // Authenticate seller
        const  seller  = await isSellerAuthenticated();

        // Fetch the role to edit
        const role = await Role.findById(roleId);
        if (!role) {
            throw new Error("Role does not exist");
        }

        // Check if seller is a member of the restaurant
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: role.restaurantId
        });

        if (!member) {
            throw new Error("Unauthorized");
        }

        // Fetch the role of the seller
        const memberRole = await Role.findById(member.roleId);

        if (role.roleName === "Owner") {
            throw new Error("You cannot edit the owner role");
        }

        let updatedRole;

        // Allow Owner or top-level roles to edit any role
        if (memberRole.roleName === "Owner" || memberRole.order === 1) {
            updatedRole = await Role.findByIdAndUpdate(
                roleId,
                {
                    roleName,
                    roleDescription,
                    canUpdateRestaurantImg,
                    canUpdateRestaurantDetails,
                    canManageRoles,
                    adminPower,
                    canManageFoodItemData,
                    canAddMember
                },
                { new: true }
            );
            return { success: true, message: "Role updated successfully" };
        }

        // Check permissions for other roles
        if (!memberRole.canManageRoles && !memberRole.adminPower) {
            throw new Error("You do not have permission to edit this role");
        }

        // Ensure the user can only edit roles lower in hierarchy
        if (memberRole.order < role.order) {
            const updateData = {
                roleName,
                roleDescription,
                canUpdateRestaurantImg,
                canUpdateRestaurantDetails,
                canManageRoles,
                canManageFoodItemData,
                canAddMember
            };

            if (role.adminPower) {
                updateData.adminPower = adminPower;
            }

            updatedRole = await Role.findByIdAndUpdate(roleId, updateData, {
                new: true
            });

            return { success: true, message: "Role updated successfully" };
        } else {
            throw new Error("You cannot update this role");
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export const reorderRoles=async(hotelId, roles)=>{
    if (!hotelId) {
        throw new Error("Hotel ID is required");
    }

    await connectDB();

    try {
        // Authenticate seller
        const  seller  = await isSellerAuthenticated();

        // Check if the seller is a member of the restaurant
        const member = await Member.findOne({
            sellerId: seller._id,
            restaurantId: hotelId
        });

        if (!member) {
            throw new Error("Unauthorized");
        }

        // Find the role associated with the member
        const role = await Role.findOne({
            memberList: member._id,
            restaurantId: hotelId
        });

        if (!role) {
            throw new Error("Unauthorized");
        }

        // Check permissions for reordering
        if (!role.canManageRoles && !role.canAddMember) {
            throw new Error("You do not have permission to reorder roles");
        }

        // Fetch the hotel and its roles
        const hotel = await Hotel.findById(hotelId).populate("roleIds");

        if (!hotel) {
            throw new Error("Hotel not found");
        }

        let currentRoles = hotel.roleIds;

        // Check if all roles are present and match
        const newRoleIds = roles.map((role) => role._id);
        const currentRoleIds = currentRoles.map((role) => role._id);

        const rolesMatch =
            JSON.stringify(newRoleIds.sort()) ===
            JSON.stringify(currentRoleIds.sort());

        if (!rolesMatch) {
            throw new Error("You cannot reorder roles");
        }

        // Sort current roles by order
        currentRoles = currentRoles.sort((a, b) => a.order - b.order);

        let updates = [];

        for (let i = 0; i < currentRoles.length; i++) {
            // If the current role has a higher order, ensure it doesn't change improperly
            if (role.order > currentRoles[i].order) {
                if (currentRoles[i].order !== roles[i].order) {
                    throw new Error("Cannot change higher order roles");
                }
            } else {
                // Prepare bulk update for new role orders
                updates.push({
                    updateOne: {
                        filter: { _id: roles[i]._id },
                        update: { order: i + 1 }
                    }
                });
            }
        }

        // Perform bulk update if there are changes
        if (updates.length > 0) {
            const result = await Role.bulkWrite(updates);
            console.log(result);
            return { success: true, message: "Roles reordered successfully" };
        }

        return { success: true, message: "No changes were necessary" };

    } catch (error) {
        console.error(error);
        throw new Error(error.message || "Failed to reorder roles");
    }
}

export const getMemberRoleInfo=async(hotelId)=>{
    if (!hotelId) {
        throw new Error("Hotel ID is not provided");
    }

    await connectDB();

    try {
        // Authenticate seller
        const  seller  = await isSellerAuthenticated();

        // Check if the seller is a member of the hotel
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: seller._id
        });

        if (!member) {
            throw new Error("Seller is not a member of this hotel");
        }

        // Fetch the associated role
        const role = await Role.findById(member.roleId);

        if (!role) {
            throw new Error("Role not found");
        }

        return {
            success: true,
            role:JSON.parse(JSON.stringify(role))
        };
    } catch (error) {
        console.error(error);
        throw new Error(error.message || "Failed to fetch member role info");
    }
}
///////////////////////////roles////////////////////////
export const deleteRole=async(hotelId, roleId)=>{
    if (!hotelId || !roleId) {
        throw new Error("Hotel ID and Role ID are required");
    }

    await connectDB();

    try {
        // Authenticate seller
        const  seller  = await isSellerAuthenticated();

        // Verify the seller is a member of the hotel
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: seller._id
        });

        if (!member) {
            throw new Error("Seller is not a member of this hotel");
        }

        // Fetch the seller's role
        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId
        });

        if (!memberRole) {
            throw new Error("Seller role not found");
        }

        // Get the role to be deleted
        const role = await Role.findById(roleId);

        if (!role) {
            throw new Error("Role not found");
        }

        // Check if the role is protected (e.g., "Owner" role or top-order)
        if (role.roleName === "Owner" || role.order === 1) {
            throw new Error("You are not authorized to delete this role");
        }

        // Ensure the seller has the right permissions
        if (role.order <= memberRole.order) {
            throw new Error("You are not authorized to delete this role");
        }

        if (!memberRole.adminPower && !memberRole.canAddMember) {
            throw new Error("You do not have permission to delete roles");
        }

        // Delete all members associated with the role
        const deleteMembers = role.memberList.map((item) =>
            Member.deleteOne({ _id: item._id })
        );
        await Promise.all(deleteMembers);

        // Delete the role itself
        await Role.deleteOne({ _id: roleId });

        return {
            success: true,
            message: "Role deleted successfully"
        };
    } catch (error) {
        console.error(error);
        throw new Error(error.message || "Failed to delete role");
    }
}
