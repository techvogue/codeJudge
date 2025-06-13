const logout = (req, res) => {
    res.status(200).json({ message: "Logged out successfully. Please clear the token." });
  };

export default logout;
  