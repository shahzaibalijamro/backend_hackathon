import dotenv from "dotenv"
dotenv.config()
import { app } from "./app.js"
import { connectDB } from "./src/db/index.js"
import { authRouter } from "./src/routes/auth.routes.js"
import { serverRouter } from "./src/routes/server.routes.js"
import { userRouter } from "./src/routes/users.routes.js"
import { productRouter } from "./src/routes/products.routes.js"
import { orderRouter } from "./src/routes/orders.routes.js"

app.use("/api/v1", authRouter)
app.use("/api/v1", userRouter)
app.use("/api/v1", serverRouter)
app.use("/api/v1", productRouter)
app.use("/api/v1", orderRouter)

app.get("/", (req,res) => {
    res.send("Hello World!")
})

// app.post("/email", async(req,res) => {
//     const {email} = req.body;
//     if (!email || email.trim() === "") {
//         return res.send("No email found!")
//     }
//     try {
//         await sendWelcomeEmail(email);
//         res.status(201).json({ message: 'User registered and email sent!' });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to send email.' });
//     }
// })


connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Server running on port ", process.env.PORT)
        })
    })
    .catch((err) => {
        console.log("Something went wrong", err)
    })