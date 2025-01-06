import express from "express"
import { getAllOrders, orderProducts,getSingleOrder } from "../controllers/orders.controllers.js";
import { verifyRequest } from "../middlewares/auth.middelware.js";
const orderRouter = express.Router();

//order
orderRouter.post("/orders",verifyRequest,orderProducts)

//all orders
orderRouter.get("/orders",verifyRequest,getAllOrders)

//single order
orderRouter.get("/orders/:id",verifyRequest,getSingleOrder)

export {orderRouter};