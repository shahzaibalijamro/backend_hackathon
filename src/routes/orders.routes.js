import express from "express"
import { orderProducts } from "../controllers/orders.controllers.js";
import { verifyRequest } from "../middlewares/auth.middelware.js";
const orderRouter = express.Router();

orderRouter.post("/orders",orderProducts)

export {orderRouter};