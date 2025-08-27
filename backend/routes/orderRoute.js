import express from 'express'
import { allOrders, placeOrder, placeOrderStripe, updateStatus, userOrders, verifyStripe } from '../controllers/orderController.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', allOrders)
orderRouter.post('/status', updateStatus)

// Payment Features
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
// User Features
orderRouter.post('/userorders', authUser, userOrders);

// verify payment
orderRouter.post('/verifyStripe', authUser, verifyStripe);

export default orderRouter
