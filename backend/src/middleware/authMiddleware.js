const jwt = require("jsonwebtoken");

// Basic token verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const bearerToken = token.split(" ")[1];
  try {
    const decoded = jwt.verify(
      bearerToken,
      process.env.JWT_SECRET || "defaultSecretKey"
    );
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      isAdmin: decoded.role === "admin",
    };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Unauthorized", message: err.message });
  }
};

// User can access their own data or admin
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Not allowed" });
    }
  });
};

// Only admin can access
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Admins only" });
    }
  });
};

// Only creator can access
const verifyTokenAndCreator = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "creator" || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Creators only" });
    }
  });
};

// Check if user has specific role
const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    verifyToken(req, res, () => {
      if (allowedRoles.includes(req.user.role)) {
        next();
      } else {
        res.status(403).json({ 
          message: `Forbidden: Requires one of these roles: ${allowedRoles.join(", ")}` 
        });
      }
    });
  };
};

// For backward compatibility
const auth = verifyToken;

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAndCreator,
  verifyRole,
  auth,
};
