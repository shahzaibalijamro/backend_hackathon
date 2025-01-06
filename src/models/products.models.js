import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required!"]
    },
    description: {
        type: String,
        required: [true, "Product description is required!"]
    },
    price: {
        type: Number,
        required: [true, "Product price is required!"]
    },
    image: {
        type: String,
        required: [true, "Product Image is required!"]
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ]
}, { timestamps: true })

export default mongoose.model("Product", productSchema, 'products')