import express from "express"
import { addProducts, editProducts, getAllProducts, getSingleProduct } from "../controllers/products.controllers.js";
import { verifyRequest } from "../middlewares/auth.middelware.js";
import { upload } from "../middlewares/multer.middleware.js";
const productRouter = express.Router();

//add product
productRouter.post("/addproduct",verifyRequest,upload.single("image"), addProducts)

//edit product
productRouter.put("/editproduct",verifyRequest,upload.single("image"), editProducts)

//get single product
productRouter.get("/product/:id",verifyRequest, getSingleProduct)
export {productRouter}

//get all products
productRouter.get("/products",verifyRequest, getAllProducts)
export {productRouter}