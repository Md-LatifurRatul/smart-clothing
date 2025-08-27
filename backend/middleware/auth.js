import mongoose from 'mongoose';
import userModel from '../models/userModel.js';

const authUser = async (req, res, next) => {
    try {
        // Handle header case sensitivity
        const userId = req.headers.userid || req.headers.userId;

        console.log("Auth middleware - all headers:", req.headers);
        console.log("Auth middleware - extracted userId:", userId);
        console.log("Auth middleware - userId type:", typeof userId);

        if (!userId) {
            return res.json({ success: false, message: 'Not Authorized - No userId provided' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.json({ success: false, message: 'Invalid User ID format' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User Not Found' });
        }

        req.userId = userId; // Set as string
        console.log("Auth middleware - set req.userId to:", req.userId);
        next();

    } catch (error) {
        console.log("Auth middleware error:", error);
        res.json({ success: false, message: error.message });
    }
};

export default authUser;
