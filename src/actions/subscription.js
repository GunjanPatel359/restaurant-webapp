"use server"

import { SubscriptionPlans } from "@/lib/SubscriptionPlans";

export const getAllSubscriptionPlans=async()=>{
    try {
        const plans = SubscriptionPlans;
        return {
            success: true,
            data: plans
        };
    } catch (error) {
        throw new Error("Failed to fetch subscription plans");
    }
}
