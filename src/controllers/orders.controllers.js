import Product from "../models/products.models.js"
import User from "../models/users.models.js"
import Order from "../models/orders.models.js"
import mongoose from "mongoose";

const orderProducts = async (req, res) => {
    const user = req.user;
    const { products } = req.body;
    if (!products || products.length === 0) {
        return res.status(400).json({
            message: "No product found!"
        })
    }
    let session;
    const invalidProducts = products.filter(item => !item.quantity || item.quantity <= 0 || !item.productId || !mongoose.Types.ObjectId.isValid(item.productId));
    if (invalidProducts.length > 0) {
        return res.status(400).json({
            message: "Each product must have a valid id and a quantity of atleast one!",
            invalidProducts
        })
    }
    try {
        const productIds = products.map(item => item.productId);
        const productDetails = await Product.find({ _id: { $in: productIds } });
        if (productDetails.length !== products.length) {
            return res.status(404).json({
                message: "Some products do not exist!"
            })
        }
        let totalPrice = 0;
        const orderDetails = products.map(item => {
            const product = productDetails.find(p => p._id.toString() === item.productId);
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
            totalPrice: totalPrice
        }], { session });
        await User.findByIdAndUpdate(user._id, { $push: { orders: createOrder[0]._id } }, { session });
        await Product.updateMany({ _id: { $in: productIds } }, { $push: { orders: createOrder[0]._id } }, { session });
        await session.commitTransaction();
        return res.status(200).json({
            message: "Order taken",
            order: createOrder
        });
    } catch (error) {
        console.log(error);
        if (session) await session.abortTransaction();
        return res.status(500).json({
            message: "Something went wrong!"
        })
    } finally {
        if (session) await session.endSession();
    }
}

const getAllOrders = async (req,res) => {
    const page = req.query?.page || 1;
    const limit = req.query?.limit || 10;
    const skip = (+page - 1) * +limit;
    try {
        const orders = await Order.find({}).skip(skip).limit(limit);
        if(orders.length === 0) return res.status(200).json({
            message: "no orders left!"
        })
        res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
        })
    }
}

const getSingleOrder = async (req,res) => {
    const {id} = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Order Id is required and must be valid!"
        })
    }
    try {
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({
            message: "Order does not exist!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

export { orderProducts,getAllOrders,getSingleOrder }