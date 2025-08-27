import userModel from "../models/userModel.js";

// Add products to user cart
const addToCart = async (req, res) => {
    try {
        const userId = req.userId; // From middleware
        const { itemId, size } = req.body;

        console.log("AddToCart - userId:", userId); // Debug

        if (!userId) {
            return res.json({ success: false, message: "User ID not found" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {}; // Handle null cartData

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added To Cart" });

    } catch (error) {
        console.log("AddToCart error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Update user cart
const updateCart = async (req, res) => {
    try {
        const userId = req.userId; // From middleware
        const { itemId, size, quantity } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID not found" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};
        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });

    } catch (error) {
        console.log("UpdateCart error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const userId = req.userId; // From middleware

        if (!userId) {
            return res.json({ success: false, message: "User ID not found" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};
        res.json({ success: true, cartData });

    } catch (error) {
        console.log("GetUserCart error:", error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, getUserCart, updateCart };

