import jwt from "jsonwebtoken";
import userChaSchemaa from "../models/userSchema.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await userChaSchemaa.findById(verifyUser._id);

    next();
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};

export { authMiddleware };
