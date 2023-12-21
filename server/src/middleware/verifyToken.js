import pkg from "jsonwebtoken";
const { verify } = pkg;

const verifyToken = async (req, res, next) => {
  try {
    let token = req?.headers?.authorization?.split(`"`)[1];
    if (!token) return res.status(401).send({ message: "Unauthorized" });
    let decoded = await verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    if (error.message === "jwt expired")
      return res.status(401).send({ message: "Unauthorized" });

    res.status(400).send({ message: "Error" });
  }
};

export default verifyToken;
