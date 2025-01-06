import Product from "../models/products.models.js"
import User from "../models/users.models.js"
import Order from "../models/orders.models.js"

const orderProducts = async (req,res) => {
    const user = req.user;
    const {products} = req.body;
    if (!products) {
        return res.status(400).json({
            message: "No product found!"
        })
    }
    try {
        return res.status(200).json(products);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

export {orderProducts}