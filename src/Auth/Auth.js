import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    const h = req.headers.authorization;
    if (!h) return res.status(401).json({ success: false, error: "No token provided" });

    const [scheme, token] = h.split(" ");
    if (!/^Bearer$/i.test(scheme) || !token) {
      return res.status(401).json({ success: false, error: "Token malformatted" });
    }

    const TokenKey = 'ezFdYUp5A05KuUXtCab9f4Mf6hUBl8PmxPaUwiVVF3B7eqYayhsHSTTkVms0BXSy';
    const decoded = jwt.verify(token, TokenKey);

    req.userId = decoded.userId || decoded.id || decoded._id;
    if (!req.userId) return res.status(401).json({ success: false, error: "Invalid token payload" });

    next();
  } catch (e) {
    console.error("Auth error:", e);
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

