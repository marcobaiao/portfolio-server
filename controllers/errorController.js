module.exports = (err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") {
      res.status(err.statusCode).json(
        {
          status: "fail",
          statusCode: 400,
          message: `Invalid ${err.path}: ${err.value}.`,
        },
        400
      );
    } else if (err.code === 11000) {
      const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
      res.status(err.statusCode).json(
        {
          status: "fail",
          message: `${value} already exists.`,
        },
        400
      );
    } else if (err.name === "ValidationError") {
      res.status(err.statusCode).json(
        {
          status: "fail",
          message: err.message,
        },
        400
      );
    } else if (err.name === "JsonWebTokenError") {
      res.status(401).json({
        status: "fail",
        message: "Invalid token. Please log in again.",
        code: 0,
      });
    } else if (err.name === "TokenExpiredError") {
      res.status(401).json({
        status: "fail",
        message: "Your token has expired. Please log in again",
        code: 0, //this code says that the it is an error for an expired token
      });
    } else {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
  }
};
