const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const projectRouter = require("./routes/projectRoutes");
const projectCategoryRouter = require("./routes/projectCategoryRoutes");
const postRouter = require("./routes/postRoutes");
const postCategoryRouter = require("./routes/postCategoryRoutes");
const informationRouter = require("./routes/informationRoutes");
const adminRouter = require("./routes/adminRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();

app.use(cookieParser());

app.use(cors());
app.use(express.static("public"));

//Set security HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//Limit requests from the same API
const limiter = rateLimit({
  //250 request per 1 hour
  limit: 300,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});

//limiter applied to all routes that start with /api
app.use("/api", limiter);

//Body parser, reading data from body into req.body
app.use(express.json(/*{ limit: "10kb" }*/));

//Data sanitization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS

//Prevent parameter polution
app.use(hpp());

app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/projectCategories", projectCategoryRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/postCategories", postCategoryRouter);
app.use("/api/v1/information", informationRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/auth", authRouter);

app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl}`);
  err.status = "fail";
  err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
