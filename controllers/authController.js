const Admin = require("../models/adminModel");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password exists
  if (!email || !password) {
    next(new AppError("Please provide email and password!", 400));
  }

  //Check if user exists && password is correct
  //Using select because in the model select is false but here the password is needed
  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await admin.isPasswordCorrect(password, admin.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //If everything is okay, login
  const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 //converting to miliseconds,
    ),
    //the cookie cannot be modified in any way from the browser - preventing attacks
    httpOnly: true,
    sameSite: "strict",
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res
    .cookie("refreshToken", refreshToken, { cookieOptions })
    .header("Authorization", accessToken);

  res.status(200).json({
    status: "success",
    accessToken,
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  console.log(req.headers);
  //Get token and check if exists
  let accessToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }

  if (!accessToken) {
    res.status(401).json({
      status: "fail",
      message: "You are not logged in! Please log in to get access",
      code: 0,
    });
    /*return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );*/
  }

  //Verificate accessToken
  const decoded = await promisify(jwt.verify)(
    accessToken,
    process.env.JWT_SECRET
  );

  //Check if user still exists - for cases where the accessToken still exists and is valid but the user was deleted or if changed the password
  const admin = await Admin.findById(decoded.id);

  if (!admin) {
    return next(
      new AppError(
        "The admin belonging to this access token does no longer exist",
        401
      )
    );
  }

  //Grant access to protected route
  req.admin = admin;
  next();
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    return new AppError("Access denied. No refresh token provided", 401);
  }

  const decoded = await promisify(jwt.verify)(
    refreshToken,
    process.env.JWT_SECRET
  );

  const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    accessToken,
  });
});
