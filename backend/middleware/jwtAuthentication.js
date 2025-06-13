import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  console.log("Received Token:", token); // Log the token to verify it's being passed correctly

  if (!token) {
    console.log("No token received!");
    return res.status(401).json({ message: "Unauthorized. Please log in.", authorized: "0"});
  }

  try {
    // Verify the token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token in jwtAuth:", decoded); // Log decoded token for debugging

    req.user = decoded;  // Attach decoded user information to the request object
    next();  // Pass control to the next middleware or route handler
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ message: "Invalid token. Please log in.", authorized:"0"});
  }
};

export default jwtAuth;
