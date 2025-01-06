import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: String,
        required: [true, "User is required!"]
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
    ],
    totalPrice: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "completed","shipped"],
        required: true
    }
}, { timestamps: true })

export default mongoose.model("Order", orderSchema, 'orders')