import Subscription from "@/models/subscription";
import Seller from "@/models/seller";
import { compareIsoDateWithUnixTime } from "./basicFunction";
import { SubscriptionPlans } from "./SubscriptionPlans";

export const checkForSellerSubscription = async (sellerInfo) => {
    try {
        const seller = sellerInfo;
        if (!seller?.subscriptionIds?.length) return null;

        let subscription = await Subscription.findOne({
            _id: seller.subscriptionIds[0],
            sellerId: seller._id,
        });

        if (compareIsoDateWithUnixTime(subscription?.endingDate, Date.now())) {
            subscription.active = false;
            await subscription.save();

            const updatedSeller = await Seller.findOneAndUpdate(
                { _id: seller._id },
                { $pull: { subscriptionIds: subscription._id } },
                { new: true }
            );

            if (updatedSeller?.subscriptionIds?.length) {
                subscription = await Subscription.findOne({
                    _id: updatedSeller.subscriptionIds[0]
                });

                const subscriptionPlan = SubscriptionPlans.find(
                    (plan) => plan.id === subscription?.subscriptionId
                );

                const durationInMs = {
                    month: 86400000 * 30,
                    year: 86400000 * 365,
                }[subscriptionPlan?.duration] || 86400000;

                const updatedSubscription = await Subscription.findOneAndUpdate(
                    { _id: subscription._id },
                    {
                        startingDate: Date.now(),
                        endingDate: Date.now() + durationInMs,
                        active: true,
                    },
                    { new: true }
                );

                return updatedSubscription;
            }

            return null;
        }

        return subscription;
    } catch (error) {
        console.error("Error checking seller subscription:", error);
        return null;
    }
};
