import pkg from "jsonwebtoken";
const { sign } = pkg;

const generateJwtToken = (payload) => {
  return sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

class CustomError extends Error {
  status;

  constructor({ message, status }) {
    super(message);
    this.status = status;
  }
}

const asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ message: error?.message || "Internal Server Error" });
      console.log(error);
    }
  };
};

export { CustomError, asyncHandler, generateJwtToken };
