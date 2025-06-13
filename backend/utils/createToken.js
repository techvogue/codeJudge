import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const createsecrettoken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60, // Expires in 3 days
    });
};

export default createsecrettoken;
