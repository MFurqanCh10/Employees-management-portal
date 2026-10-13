
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in."
    });
  }

  const token = authorization.slice(7);

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token"
      });
    }

    req.user = {
      id: decoded.userId
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Your session is invalid or has expired"
    });
  }
};
