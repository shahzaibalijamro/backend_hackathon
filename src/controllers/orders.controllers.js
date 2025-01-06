import Product from "../models/products.models.js"
import User from "../models/users.models.js"
import Order from "../models/orders.models.js"

const orderProducts = async (req, res) => {
    const user = req.user;
    const { products } = req.body;
    if (!products) {
        return res.status(400).json({
            message: "No product found!"
        })
    }
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
        const createOrder = await Order.create({
            user: user._id,
            products: orderDetails,
            total: totalPrice
        })
        return res.status(200).json({
            user: user._id,
            products: orderDetails,
            total: totalPrice
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

export { orderProducts }