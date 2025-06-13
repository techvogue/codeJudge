import User from "../models/user.js";

const profile = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);

        if (!email) {
            return res.status(400).json({ message: "Email is missing in the request body" });
        }

        const userProfile = await User.findOne({ email });

        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        const { _id, password, ...filteredUserProfile } = userProfile.toObject();

        return res.status(200).json({ success: true, profile: filteredUserProfile });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default profile;
