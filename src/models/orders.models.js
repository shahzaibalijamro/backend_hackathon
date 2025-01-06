import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: Number,
                required: true,
            },
            subTotal: {
                type: Number,
                required: true,
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed", "shipped"],
        default: "pending",
    }
}, { timestamps: true })

export default mongoose.model("Order", orderSchema, 'orders')