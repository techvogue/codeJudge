import User from "../models/user.js";
import createSecretToken from "../utils/createToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "Incorrect password or email" });
        }
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({ message: "Incorrect password or email" });
        }

        const token = createSecretToken(user._id);
        console.log("Generated Token:", token); // Log the generated token

        // Decode the token to verify its contents
        console.log("Decoded Token:", jwt.decode(token)); // Log decoded token to check its payload

        res.status(201).json({
            token: token,
            email: user.email, // Adding email to the response
            message: "User logged in successfully",
            success: true,
            userid: user._id,
        });
        next();
    } catch (error) {
        console.error(error);
    }
};

export default login;
