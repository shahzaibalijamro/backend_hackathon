import mongoose from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Username is required!'],
        unique: [true, 'Username must be unique!'],
        lowercase: true,
    },
    fullName: {
        type: String,
        required: [true, 'Fullname is required!'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            },
            message: props => `${props.value} is not a valid email address!`,
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    role:{
        type: String,
        enum: ["Admin", "Customer"]
    },
    profilePicture: {
        type: String,
        required: [true, "Profile picture is required!"]
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        },
    ]
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified()) return next()
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    try {
        if (!regex.test(this.password)) return next(new Error("Password does not meet the required criteria"));
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
})

export default mongoose.model("User", userSchema, 'users')