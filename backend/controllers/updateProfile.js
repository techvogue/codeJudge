import User from "../models/user.js";

const updateProfile = async (req, res) => {
  try {
    // 1. Extract original email and updated fields from the request
    const { email: originalEmail, updatedName, updatedEmail, updatedRole } = req.body;

    // 2. Find the user by original email
    const user = await User.findOne({ email: originalEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 3. Prepare the fields to be updated
    const updatedFields = {};
    if (updatedName && updatedName !== user.name) {
      updatedFields.username = updatedName;
    }
    if (updatedEmail && updatedEmail !== user.email) {
      updatedFields.email = updatedEmail;
    }
    if (updatedRole !== undefined && updatedRole !== user.role) {
      updatedFields.role = updatedRole;
    }

    // 4. If any fields were updated, update them in the database
    let updatedUser = user;
    if (Object.keys(updatedFields).length > 0) {
      updatedUser = await User.findOneAndUpdate(
        { email: originalEmail },
        { $set: updatedFields },
        { new: true, runValidators: true }
      );
    } else {
      return res.status(200).json({
        success: false,
        message: "No fields were updated",
      });
    }

    // 5. Return the updated user data
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedFields,
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ success: false, message: "An error occurred while updating profile" });
  }
};

export default updateProfile;
