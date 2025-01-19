"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useModal } from "@/hooks/zusthook"; // Assuming `useModal` is your modal state management hook

// Dynamically import modals
const modals = {
  "add-address": dynamic(() => import("@/components/modalDilogs/AddAddressModal")),
  "create-food-category": dynamic(() => import("@/components/modalDilogs/CreateFoodCategoryModal")),
  "create-food-item": dynamic(() => import("@/components/modalDilogs/CreateFoodItemModal")),
  "create-roles": dynamic(() => import("@/components/modalDilogs/CreateRoleModal")),
  "create-order-table": dynamic(() => import("@/components/modalDilogs/CreateTableModal")),
  "Delete-Food-Category": dynamic(() => import("@/components/modalDilogs/DeleteFoodCategory")),
  "Delete-Food-Item": dynamic(() => import("@/components/modalDilogs/DeleteFoodItemModal")),
  "Delete-Order-Table-Info": dynamic(() => import("@/components/modalDilogs/DeleteOrderTableModal")),
  "Delete-role": dynamic(() => import("@/components/modalDilogs/DeleteRoleModal")),
  "edit-food-category": dynamic(() => import("@/components/modalDilogs/EditCategoryModal")),
  "edit-food-item": dynamic(() => import("@/components/modalDilogs/EditFoodItemModal")),
  "edit-order-table": dynamic(() => import("@/components/modalDilogs/EditOrderTableInfoModal")),
  "Edit-role-Permission": dynamic(() => import("@/components/modalDilogs/EditRolePermissionModal")),
  "invite-member": dynamic(() => import("@/components/modalDilogs/InviteMemberModal")),
  "manage-role-member": dynamic(() => import("@/components/modalDilogs/ManageRoleMemberModal")),
  "table-qr-code": dynamic(() => import("@/components/modalDilogs/QrCodeModal")),
  "create-restaurant": dynamic(() => import("@/components/modalDilogs/SellerAddResturantModal")),
  "purchase-subscription": dynamic(() => import("@/components/modalDilogs/SellerBuyingSubscriptionModal")),
  "delete-restaurant": dynamic(() => import("@/components/modalDilogs/SellerDeleteRestaurantModal")),
  "back-to-available": dynamic(() => import("@/components/modalDilogs/ConfirmBackToAvailableModal")),
  "Ordertable-make-Order-seller": dynamic(() => import("@/components/modalDilogs/ConfirmTableOrderSeller")),
  "Ordertable-make-Order-user": dynamic(() => import("@/components/modalDilogs/UserConfirmTableOrder")),
};

export const ModalProvider = () => {
  const { isOpen, type, onClose } = useModal();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!isOpen || !type) {
    return null;
  }

  const ModalComponent = modals[type];

  if (!ModalComponent) {
    console.warn(`No modal found for type: ${type}`);
    return null;
  }

  return <ModalComponent onClose={onClose} />;
};