"use client"
import { useEffect, useState } from "react";
import AddAddressModal from "@/components/modalDilogs/AddAddressModal";
import CreateFoodCategoryModal from "@/components/modalDilogs/CreateFoodCategoryModal";
import CreateFoodItemModal from "@/components/modalDilogs/CreateFoodItemModal";
import CreateRoleModal from "@/components/modalDilogs/CreateRoleModal";
import CreateTableModal from "@/components/modalDilogs/CreateTableModal";
import DeleteFoodCategory from "@/components/modalDilogs/DeleteFoodCategory";
import DeleteFoodItemModal from "@/components/modalDilogs/DeleteFoodItemModal";
import DeleteOrderTableModal from "@/components/modalDilogs/DeleteOrderTableModal";
import DeleteRoleModal from "@/components/modalDilogs/DeleteRoleModal";
import EditCategoryModal from "@/components/modalDilogs/EditCategoryModal";
import EditFoodItemModal from "@/components/modalDilogs/EditFoodItemModal";
import EditOrderTableInfoModal from "@/components/modalDilogs/EditOrderTableInfoModal";
import EditRolePermissionModal from "@/components/modalDilogs/EditRolePermissionModal";
import InviteMemberModal from "@/components/modalDilogs/InviteMemberModal";
import ManageRoleMemberModal from "@/components/modalDilogs/ManageRoleMemberModal";
import SellerAddResturantModal from "@/components/modalDilogs/SellerAddResturantModal";
import SellerBuyingSubscriptionModal from "@/components/modalDilogs/SellerBuyingSubscriptionModal";
import SellerDeleteRestaurantModal from "@/components/modalDilogs/SellerDeleteRestaurantModal";
import ConfirmBackToAvailableModal from "@/components/modalDilogs/ConfirmBackToAvailableModal";
import QrCodeModal from "@/components/modalDilogs/QrCodeModal";
import ConfirmTableOrderSeller from "@/components/modalDilogs/ConfirmTableOrderSeller";
import UserConfirmTableOrder from "@/components/modalDilogs/UserConfirmTableOrder";

export const ModalProvider=()=>{
    const [isMounted,setIsMounted]=useState(false);

    useEffect(()=>{
        setIsMounted(true);
    },[])

    if(!isMounted){
        return null 
    }

    return (
        <div>
        <AddAddressModal/>
        <ConfirmBackToAvailableModal />
        <CreateFoodCategoryModal />
        <CreateFoodCategoryModal />
        <CreateFoodItemModal />
        <CreateRoleModal/>
        <CreateTableModal />
        <DeleteFoodCategory />
        <DeleteFoodItemModal />
        <DeleteOrderTableModal/>
        <DeleteRoleModal />
        <EditCategoryModal />
        <EditFoodItemModal />
        <EditOrderTableInfoModal />
        <EditRolePermissionModal />
        <InviteMemberModal />
        <ManageRoleMemberModal />
        <QrCodeModal />
        <SellerAddResturantModal/>
        <SellerBuyingSubscriptionModal />
        <SellerDeleteRestaurantModal />
        <ConfirmTableOrderSeller />
        <UserConfirmTableOrder />
        </div>
    )
}