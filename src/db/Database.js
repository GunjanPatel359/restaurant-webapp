"use server"
import mongoose from 'mongoose';
if (!process.env.MONGO_URI) {
    throw Error("database connect error");
}

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log(`MongoDB connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
};
