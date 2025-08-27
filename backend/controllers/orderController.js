import Stripe from 'stripe';
import orderModel from "../middleware/orderModel.js";
import userModel from "../models/userModel.js";
// import razorpay from 'razorpay'

//global variables

const currency = 'usd'
const deliveryCharge = 2

//gateway initialize

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const placeOrder = async (req, res) => {
    try {
        const userId = req.userId;

        console.log("PlaceOrder - req.userId:", userId);
        console.log("PlaceOrder - req.body:", req.body);
        if (!userId) {
            return res.json({ success: false, message: 'User ID not found in request' });
        }

        const { items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        };

        console.log("Order data before saving:", orderData);

        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: 'Order Placed' });
    } catch (error) {
        console.log("PlaceOrder error:", error);
        res.json({ success: false, message: error.message });
    }
};


// Placing Order Using Stripe Method

const placeOrderStripe = async (req, res) => {

    try {

        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        }


        const newOrder = new orderModel(orderData)
        await newOrder.save()
        const line_items = items.map((item) => (
            {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price * 100
                },
                quantity: item.quantity
            }
        ))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({

            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',


        })
        res.json({ success: true, session_url: session.url });


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }



}

// Verify Stripe

const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body
    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true })

        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })




    }

}



// All Orders Data For Admin Panel

const allOrders = async (req, res) => {

    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })



    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }


}

// User Orders data For Frontend

const userOrders = async (req, res) => {
    try {
        const userId = req.userId;

        console.log("UserOrders - req.userId:", userId);
        console.log("UserOrders - typeof req.userId:", typeof userId);
        console.log("UserOrders - req.headers:", req.headers);

        if (!userId) {
            return res.json({ success: false, message: "User ID not found" });
        }

        console.log("Searching for orders with userId:", userId);


        const orders1 = await orderModel.find({ userId: userId });
        console.log("Query 1 - Direct match results:", orders1.length);


        const orders2 = await orderModel.find({ userId: userId.toString() });
        console.log("Query 2 - String conversion results:", orders2.length);

        const allOrders = await orderModel.find({});
        console.log("All orders in database:", allOrders.length);
        allOrders.forEach(order => {
            console.log("Order userId:", order.userId, "Type:", typeof order.userId);
        });


        const orders = orders1.length > 0 ? orders1 : orders2;
        console.log("Final orders to return:", orders.length);

        res.json({ success: true, orders });

    } catch (error) {
        console.log("UserOrders error:", error);
        res.json({ success: false, message: error.message });
    }
};

// update order status from admin panel

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status })

        res.json({ success: true, message: 'Status Updated' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }


}

export { allOrders, placeOrder, placeOrderStripe, updateStatus, userOrders, verifyStripe };

