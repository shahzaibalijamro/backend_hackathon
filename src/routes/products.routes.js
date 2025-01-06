import express from "express"
import { addProduct, deleteProduct, editProduct, getAllProducts, getSingleProduct } from "../controllers/products.controllers.js";
import { verifyRequest } from "../middlewares/auth.middelware.js";
import { upload } from "../middlewares/multer.middleware.js";
const productRouter = express.Router();

//add product
productRouter.post("/products",verifyRequest,upload.single("image"), addProduct)

//get all products
productRouter.get("/products", getAllProducts)

//get single product
productRouter.get("/products/:id",verifyRequest, getSingleProduct)

//edit product
productRouter.put("/products/:id",verifyRequest,upload.single("image"), editProduct)

//delete product
productRouter.delete("/products/:id",verifyRequest, deleteProduct)

export {productRouter}