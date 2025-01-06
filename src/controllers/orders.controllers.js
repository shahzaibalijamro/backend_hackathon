import Product from "../models/products.models.js"
import User from "../models/users.models.js"
import Order from "../models/orders.models.js"
import mongoose from "mongoose";

const orderProducts = async (req, res) => {
    const user = req.user;
    const { products } = req.body;
    if (!products) {
        return res.status(400).json({
            message: "No product found!"
        })
    }
    let session;
    try {
        const productIds = products.map(item => item.productId);
        const productDetails = await Product.find({ _id: { $in: productIds } });
        let totalPrice = 0;
        const orderDetails = products.map(item => {
            const product = productDetails.find(p => p._id.toString() === item.productId);
            if (!product) throw new Error(`Product not found: ${item.productId}`);
            const subTotal = product.price * item.quantity;
            totalPrice += subTotal;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                subTotal
            };
        });
        session = await mongoose.startSession();
        session.startTransaction();
        const createOrder = await Order.create([{
            user: user._id,
            products: orderDetails,
            total: totalPrice
        }],{session});
        const updateUserOrders = await User.findByIdAndUpdate(user._id,{$push: {orders: createOrder[0]._id}},{session});
        if (!createOrder || !updateUserOrders) {
            await session.abortTransaction();
            return res.status(500).json({
                message: "Could not take order!"
            })
        }
        await session.commitTransaction();
        return res.status(200).json({
            message: "Order taken",
            order: createOrder
        });
    } catch (error) {
        console.log(error);
        if(session) await session.abortTransaction();
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }finally{
        if(session) await session.endSession();
    }
}

export { orderProducts }