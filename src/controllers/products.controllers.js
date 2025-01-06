import Product from "../models/products.models.js"
import User from "../models/users.models.js"
import { uploadImageToCloudinary } from "../utils/cloudinary.utils.js";
import mongoose from "mongoose";

const addProduct = async (req,res) => {
    const user = req.user;
    const {name,description,price} = req.body;
    if (!req.file) return res.status(400).json({
        message: "No file found"
    })
    const image = req.file.path;
    if (!name || !description || !price) {
        return res.status(400).json({
            message: "Product name,description and price are all required!"
        })
    }
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction()
        const productImage = await uploadImageToCloudinary(image);
        const product = await Product.create([{
            name : name,
            description : description,
            price : price,
            image: productImage,
            seller : user._id
        }],{session});
        const updateUser = await User.findByIdAndUpdate(user._id,{
            $push:{products: product[0]._id}
        },{session})
        if(!product || !updateUser) {
            await session.abortTransaction();
            return res.status(500).json({
                message: "Could not add product, please try again"
            })
        }
        await session.commitTransaction()
        return res.status(200).json({
            message: "Product added!",
            product,
        })
    } catch (error) {
        if (session) await session.abortTransaction()
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }finally{
        if (session) await session.endSession()
    }
}

const getAllProducts = async (req,res) => {
    const page = req.query?.page || 1;
    const limit = req.query?.limit || 10;
    const skip = (+page - 1) * +limit;
    try {
        const products = await Product.find({}).skip(skip).limit(limit);
        if(products.length === 0) return res.status(200).json({
            message: "no products left!"
        })
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
        })
    }
}

const getSingleProduct = async (req,res) => {
    const {id} = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Product id is required and must be valid!"
        })
    }
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                message: "Product does not exist!"
            })
        }
        return res.status(200).json(product)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

const editProduct = async (req, res) => {
    const user = req.user;
    const {id : productId} = req.params;
    const {name,description,price} = req.body;
    const mediaPath = req.file ? req.file.path : null;
    try {
        if (!name && !description && !price && !mediaPath) {
            return res.status(400).json({ message: "Atleast update one thing!" });
        }
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Product Id is required and must be valid!"
            })
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }
        console.log(product.seller);
        console.log(user._id);
        if (product.seller.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to edit this product!"
            })
        }
        let media = product.image;
        if (mediaPath) {
            try {
                media = await uploadImageToCloudinary(mediaPath);
            } catch (error) {
                return res.status(500).json({ message: "Failed to upload image!" });
            }
        }
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.image = media
        await product.save();
        return res.status(200).json({
            message: "Product updated!",
            product,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong while editing the product!"
        })
    }
}

const deleteProduct = async (req,res) => {
    const user = req.user;
    const { productId } = req.params;
    try {
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Product Id is required and must be valid"
            })
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product doesn't exist"
            })
        }
        if (product.seller.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this product!"
            })
        }
        await product.remove();
        res.status(200).json({
            message: "Product deleted!"
        })
    } catch (error) {
        console.log(error.message || error);
        res.status(500).json({
            message: "Something went wrong while deleting the product!"
        })
    }
}

export {addProduct,editProduct,getSingleProduct,getAllProducts,deleteProduct}