"use server";
import { connectDB } from "@/db/Database";
import path from "path";
import fs from "fs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { isSellerAuthenticated } from "@/lib/authMiddleware";
import { sgMail } from "@/lib/sendmailer";
import { SERVER_URL } from "@/lib/server";
import { SubscriptionPlans } from "@/lib/SubscriptionPlans";
import {
  captureSellerSubscriptionOrder,
  createSellerSubscription,
} from "@/lib/paypal-api";
import { checkForSellerSubscription } from "@/lib/repeatQuery";
import Subscription from "@/models/subscription";
import SubscriptionLog from "@/models/subscriptionlog";
import Member from "@/models/member";
import Hotel from "@/models/hotel";
import Seller from "@/models/seller";
import Role from "@/models/role";

export const getSellerInfo = async () => {
  try {
    const seller = await isSellerAuthenticated(); // Assuming the function fetches the authenticated seller
    if (!seller) {
      throw new Error("Seller not authenticated");
    }
    return {
      success: true,
      seller: JSON.parse(JSON.stringify(seller)),
    };
  } catch (error) {
    throw new Error(error.message || "Failed to fetch seller information");
  }
};

export const createSeller = async ({ name, email, password }) => {
  try {
    if (name && email && password && password.length >= 6) {
      await connectDB(); // Assuming you're using this to connect to your DB
      const sellerEmail = await Seller.findOne({ email });

      if (sellerEmail) {
        throw new Error("User already exists", 400);
      }

      const seller = {
        name,
        email,
        password,
      };

      const token = jwt.sign(seller, process.env.ACTIVATION_TOKEN, {
        expiresIn: "5m",
      });

      // Send email using SendGrid
      const msg = {
        to: seller.email,
        from: process.env.SMTP_MAIL,
        subject: "Account Activation",
        html: `<a href="${SERVER_URL}/seller/activation/${token}">Click on the link to activate your seller account</a>`,
      };

      await sgMail.send(msg);

      return {
        success: true,
        message: `Please check your email (${seller.email}) to activate your seller account.`,
      };
    } else {
      throw new Error("Provide all the details", 400);
    }
  } catch (error) {
    throw new Error(
      error.message || "An error occurred while creating the seller",
      400
    );
  }
};

export const activateSeller = async (token) => {
  try {
    if (token) {
      // Verify token
      const seller = jwt.verify(token, process.env.ACTIVATION_TOKEN);
      if (!seller) {
        throw new Error("Invalid token", 400);
      }

      await connectDB(); // Assuming you're using a connectDB utility

      // Check if the seller already exists in the database
      const sellerExist = await Seller.findOne({ email: seller.email });
      if (sellerExist) {
        throw new Error("Seller already exists", 400);
      }

      // Create the new seller
      const createseller = await Seller.create({
        name: seller.name,
        email: seller.email,
        password: seller.password, // Adjust this based on how you handle passwords
      });

      return {
        success: true,
        message: "Seller created successfully",
      };
    } else {
      throw new Error("Invalid token", 400);
    }
  } catch (error) {
    throw new Error(error.message || "Error during seller activation", 400);
  }
};

export const sellerLogin = async ({ email, password }) => {
  try {
    if (!email || !password || password.length < 6) {
      throw new Error("Please provide all the credentials");
    }

    await connectDB(); // Connect to the DB

    // Find the seller by email
    let seller = await Seller.findOne({ email }).select("password");
    if (!seller) {
      throw new Error("Seller doesn't exist");
    }

    // Validate the password
    const isPasswordValid = await seller.comparePass(password);
    if (!isPasswordValid) {
      throw new Error("Incorrect password");
    }

    // Generate a token for the seller
    const seller_token = await seller.getJwtToken();
    const cookieStore = await cookies();

    cookieStore.set({
      name: "seller_token",
      value: seller_token,
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    });

    // Return the response
    return {
      success: true,
      message: "Logged in successfully",
      seller_token,
    };
  } catch (err) {
    throw new Error(err.message || "Error during login");
  }
};

export const setSellerImage = async (formData) => {
  try {
    // Authenticate and get the seller object
    const seller = await isSellerAuthenticated();

    // Extract the image file from the formData
    const file = formData.get("sellerimage");
    if (!file) {
      throw new Error("No image uploaded");
    }

    // Define the upload directory
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, file.name);

    // Delete the existing avatar if it exists
    if (seller.avatar) {
      const existingPath = path.join(uploadDir, seller.avatar);
      if (fs.existsSync(existingPath)) {
        fs.unlinkSync(existingPath);
      }
    }

    // Write the new file to disk
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Connect to the database
    await connectDB();

    // Update the seller with the new avatar path
    const updatedSeller = await Seller.findByIdAndUpdate(
      seller._id,
      { avatar: file.name },
      { new: true }
    );

    return { success: true, seller: JSON.parse(JSON.stringify(updatedSeller)) };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAllSellerHotels = async () => {
  try {
    const seller = await isSellerAuthenticated();
    await connectDB();
    const sellerdata = await Seller.findById({ _id: seller._id }).populate(
      "restaurantIDs"
    );
    console.log(sellerdata.restaurantIDs);
    return {
      success: true,
      hotel: JSON.parse(JSON.stringify(sellerdata.restaurantIDs)),
    };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getAllManagingHotels = async () => {
  try {
    const seller = await isSellerAuthenticated();
    await connectDB();
    const member = await Member.find({
      sellerId: seller._id,
    }).populate("restaurantId");
    if (!member) {
      return next(
        new ErrorHandler("you are not member of any restaurant", 400)
      );
    }
    const hotels = member.map((item) => {
      return item.restaurantId;
    });
    const hotel = hotels.filter(
      (item) => item.sellerId.toString() != seller._id.toString()
    );
    return { success: true, hotel: JSON.parse(JSON.stringify(hotel)) };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getSellerHotel = async (hotelId) => {
  try {
    if (!hotelId) {
      throw new Error("hotelId not found");
    }
    const seller = await isSellerAuthenticated();
    await connectDB();
    const hotel = await Hotel.findOne({
      _id: hotelId,
      sellerId: seller._id,
    });
    if (!hotel) {
      throw new Error("hotel not found");
    }
    return { success: true, hotel: JSON.parse(JSON.stringify(hotel)) };
  } catch (error) {
    console.log(error);
    return { success: false, message: error };
  }
};

export const updateRestaurantInfo = async (hotelId, updates) => {
  try {
    // Authenticate the seller and get their data
    const { seller } = await isSellerAuthenticated();
    await connectDB(); // Ensure the database connection is established

    // Destructure the update object (assuming it contains the data to update the restaurant)
    const { name, country, city, state, address, zipCode, cusineTypes } =
      updates;

    // Remove any empty strings from cuisine types
    const filteredCuisineTypes = cusineTypes.filter((item) => item !== "");

    // Update the hotel in the database
    const hotel = await Hotel.findOneAndUpdate(
      { _id: hotelId, sellerId: seller._id },
      {
        name,
        "addresses.country": country,
        "addresses.city": city,
        "addresses.state": state,
        "addresses.address": address,
        "addresses.zipCode": zipCode,
        cusineTypes: filteredCuisineTypes,
      },
      { new: true }
    );

    // If no hotel found, throw an error
    if (!hotel) {
      throw new Error("Hotel not found");
    }

    // Return the updated hotel data
    return { success: true, hotel };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error.message || "Error updating restaurant info",
    };
  }
};

export const deleteRestaurant = async (hotelId) => {
  try {
    // Authenticate the seller and get their data
    const seller = await isSellerAuthenticated();
    await connectDB(); // Ensure the database connection is established

    if (!hotelId) {
      throw new Error("hotelId not found");
    }

    // Find and delete the hotel
    const hotel = await Hotel.findOneAndDelete({
      _id: hotelId,
      sellerId: seller._id,
    });

    if (!hotel) {
      throw new Error("Hotel not found or Unauthorized");
    }

    // Delete the image associated with the hotel
    const imagePath = path.join(__dirname, "../../uploads", hotel.imgUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Remove the image file
    }

    // Remove the hotel from the seller's list of restaurants
    const sellerUpdated = await Seller.findOneAndUpdate(
      { _id: seller._id },
      { $pull: { restaurantIDs: hotelId } },
      { new: true }
    );

    // Return success with updated seller
    return { success: true, seller: sellerUpdated };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error.message || "Error deleting restaurant",
    };
  }
};

export const createSubscription = async (subscriptionData) => {
  try {
    const seller = await isSellerAuthenticated();
    // Find the subscription plan that matches the ID
    const subscriptionPack = SubscriptionPlans.find(
      (item) => item.id === subscriptionData.id
    );
    if (!subscriptionPack) {
      throw new Error("Subscription not found");
    }
    await connectDB();
    // Check if the seller has any active subscription
    if (seller.subscriptionIds.length < 1) {
      // Check if seller has more restaurants than the new plan allows
      if (seller.restaurantIDs.length > subscriptionPack.hotelLimits) {
        throw new Error(
          "You can't downgrade your subscription while you have more restaurants than the subscription pack allows"
        );
      }
    } else {
      // Check the current subscription and prevent downgrade
      const currentSubscription = await Subscription.findOne({
        _id: seller.subscriptionIds[seller.subscriptionIds.length - 1],
        sellerId: seller._id,
      });

      const currentSubscriptionPack = SubscriptionPlans.find(
        (item) => item.id === currentSubscription.subscriptionId
      );
      if (subscriptionPack.level < currentSubscriptionPack.level) {
        throw new Error(
          "You can't downgrade your subscription while it's running"
        );
      }
    }

    // Create the seller's subscription order
    const { jsonResponse, httpStatusCode } = await createSellerSubscription(
      subscriptionPack
    );

    // Log the subscription initiation
    const subscriptionLog = await SubscriptionLog.create({
      orderID: jsonResponse.id,
      sellerId: seller._id,
      subscriptionId: subscriptionPack.id,
      plan: subscriptionPack.title,
      status: "subscriptionInitiated",
    });

    // Return response
    return { success: true, jsonResponse, statusCode: httpStatusCode };
  } catch (error) {
    console.error("Failed to create subscription:", error);
    return {
      success: false,
      message: error.message || "Failed to create subscription",
    };
  }
};

const calculateSubscriptionEndDate = (duration) => {
  let endDate;
  if (duration === "month") {
    endDate = Date.now() + 86400000 * 30;
  } else if (duration === "year") {
    endDate = Date.now() + 86400000 * 365;
  } else {
    endDate = Date.now() + 86400000 * 1; // Default to 1 day duration if invalid
  }
  return endDate;
};

export const captureSubscription = async (orderID) => {
  try {
    const seller = await isSellerAuthenticated();
    // Capture the subscription order
    const { jsonResponse, httpStatusCode } =
      await captureSellerSubscriptionOrder(orderID);

    // Check if the transaction was completed successfully
    if (jsonResponse.status === "COMPLETED") {
      // Update subscription log status to "transactionCompleted"
      const subscriptionLog = await SubscriptionLog.findOneAndUpdate(
        { orderID, sellerId: seller._id },
        { status: "transactionCompleted" },
        { new: true }
      );

      // Check if the seller already has an active subscription
      const currentSubscriptionPack = await checkForSellerSubscription(seller);

      // Find the subscription pack associated with the subscription order
      const subscriptionPack = SubscriptionPlans.find(
        (item) => item.id === subscriptionLog.subscriptionId
      );
      if (!subscriptionPack) {
        throw new Error("Subscription pack not found");
      }

      let subscription;
      const endDate = calculateSubscriptionEndDate(subscriptionPack.duration);

      // If no current subscription, create a new one
      if (!currentSubscriptionPack) {
        subscription = await Subscription.create({
          sellerId: seller._id,
          orderID: jsonResponse.id,
          active: true,
          price: jsonResponse.purchase_units[0].payments.captures[0].value,
          currencyCode:
            jsonResponse.purchase_units[0].payments.captures[0].currency_code,
          subscriptionId: subscriptionPack.id,
          plan: subscriptionPack.title,
          orderLimit: subscriptionPack.orderLimit,
          startingDate: Date.now(),
          endingDate: endDate,
        });
      } else {
        // Create an inactive subscription if the seller already has an active one
        subscription = await Subscription.create({
          sellerId: seller._id,
          orderID: jsonResponse.id,
          active: false,
          price: jsonResponse.purchase_units[0].payments.captures[0].value,
          currencyCode:
            jsonResponse.purchase_units[0].payments.captures[0].currency_code,
          subscriptionId: subscriptionPack.id,
          plan: subscriptionPack.title,
          orderLimit: subscriptionPack.orderLimit,
        });
      }

      // Update seller with new subscription ID
      await Seller.findOneAndUpdate(
        { _id: seller._id },
        { $push: { subscriptionIds: subscription._id } }
      );

      return { success: true, jsonResponse, httpStatusCode };
    } else {
      throw new Error("Transaction not completed");
    }
  } catch (error) {
    console.error("Failed to capture subscription:", error);
    throw new Error(error.message || "Failed to capture subscription order");
  }
};

export const getHotelData = async (hotelId) => {
  try {
    if (!hotelId) {
      throw new Error("Hotel ID not provided");
    }

    const seller = await isSellerAuthenticated();

    await connectDB();
    const hotel = await Hotel.findOne({ _id: hotelId }).populate("roleIds");

    // Check if the seller is a member of the restaurant
    const member = await Member.findOne({
      restaurantId: hotel._id,
      sellerId: seller._id,
    });

    if (!member) {
      throw new Error("Unauthorized access");
    }

    // Fetch the role data for the member in the hotel
    const role = await Role.findOne({
      _id: member.roleId,
      restaurantId: hotelId,
    });

    return {
      success: true,
      role: JSON.parse(JSON.stringify(role)),
      hotel: JSON.parse(JSON.stringify(hotel)),
      member: JSON.parse(JSON.stringify(member)),
    };
  } catch (error) {
    console.error("Error fetching hotel data:", error);
    throw new Error(error.message || "Failed to fetch hotel data");
  }
};

export const searchInviteSeller = async (query) => {
  try {
    if (!query || query.length < 2) {
      throw new Error("Invalid search query", 400);
    }
    const  seller  = await isSellerAuthenticated();
    await connectDB();
    const data = await Seller.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });
    if (data.length > 0) {
      const parsingData = data.map((item) => {
        return {
          _id: item._id,
          name: item.name,
          email: item.email,
          avatar: item.avatar,
        };
      });
      return { success: true, data: JSON.parse(JSON.stringify(parsingData)) };
    }
    throw new Error("member not found")
  } catch (error) {
    console.error("Error fetching hotel data:", error);
    throw new Error(error.message || "Failed to fetch hotel data");
  }
};

export const searchInviteSellerById = async (query) => {
  try {
    if (!query || query.length !== 24) {
      throw new Error("Invalid search query");
    }

    const seller = await isSellerAuthenticated(); // Fetch seller details
    await connectDB(); // Ensure DB connection

    const data = await Seller.findOne({ _id: query }); // Search by seller ID
    if (!data) {
      return { success: false, message: "Member not found" };
    }

    const parsedData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    };

    return { success: true, data: JSON.parse(JSON.stringify(parsedData)) };
  } catch (error) {
    console.error("Error fetching seller data:", error);
    throw new Error(error.message || "Failed to fetch seller data");
  }
};

// export const getAllColorsSeller = async () => {
//     try {
//         return { success: true, colors: static_colors }; // static_colors should be imported from your data
//     } catch (error) {
//         console.error("Error fetching colors:", error);
//         throw new Error(error.message || "Failed to fetch colors");
//     }
// };

// export const changeColorSeller = async (color) => {
//     try {
//         // Validate the color
//         if (!static_colors.includes(color)) {
//             throw new Error("Invalid color");
//         }

//         const {seller}=await isSellerAuthenticated()
//         await connectDB()

//         // Update the seller's color
//         const updatedSeller = await Seller.findOneAndUpdate(
//             { _id: seller._id },
//             { colors: color },
//             { new: true }
//         );

//         if (!updatedSeller) {
//             throw new Error("Seller not found");
//         }

//         return { success: true, message: "Color updated successfully" };
//     } catch (error) {
//         console.error("Error updating color:", error);
//         throw new Error(error.message || "Failed to update color");
//     }
// };
