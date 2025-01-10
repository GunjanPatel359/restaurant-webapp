"use server";

import jwt from 'jsonwebtoken';
import User from '@/models/user';
import Seller from '@/models/seller';
import { cookies } from 'next/headers';
import { connectDB } from '@/db/Database';

export async function isAuthenticated() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            throw new Error('Please login to continue');
        }
        await connectDB()
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        throw new Error(error.message || 'Authentication failed');
    }
}

export async function isSellerAuthenticated() {
    try {
        const cookieStore = await cookies();
        const sellerToken = cookieStore.get('seller_token')?.value;

        if (!sellerToken) {
            throw new Error('Please login to proceed', 401);
        }
        await connectDB()
        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET_KEY);
        const seller = await Seller.findById(decoded.id);

        if (!seller) {
            throw new Error('Seller not found', 404);
        }
        return seller;
    } catch (error) {
        throw new Error(error.message || 'Authentication failed');
    }
}
