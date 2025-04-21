const jwt = require("jsonwebtoken");

exports.authMiddleware = async (req, res, next) => {
	try {
		// Typically, tokens are sent in the Authorization header as:
		// "Authorization: Bearer <token>"
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res.status(401).json({ error: "No authorization header" });
		}

		const token = authHeader.split(" ")[1]; // after 'Bearer'
		console.log("🔐 Token received:", token);

		if (!token) {
			return res.status(401).json({ error: "No token provided" });
		}

		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log("✅ Decoded token:", decoded);
		// The decoded object will contain whatever was signed, e.g. { userId: <someId>, iat, exp }

		// Attach user info to req
		req.user = { _id: decoded.userId };

		next(); // proceed to controller
	} catch (error) {
		console.error("authMiddleware error:", error);
		res.status(401).json({ error: "Invalid or expired token" });
	}
};
