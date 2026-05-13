const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { verifyJWT } = require("./middlewares/auth.middleware");

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("uploads"));

// Routes Import
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const categoryRouter = require("./routes/category.routes");
const templateRouter = require("./routes/template.routes");
const subscriptionRouter = require("./routes/subscription.routes");
const shareRouter = require("./routes/share.routes");

// Route Declarations
app.use("/api/auth", authRouter);
app.use("/api/users", verifyJWT, userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/templates", templateRouter);
app.use("/api/subscriptions", verifyJWT, subscriptionRouter);
app.use("/api/share", verifyJWT, shareRouter);

// Global Error Handler
const { errorHandler } = require("./middlewares/error.middleware");
app.use(errorHandler);

module.exports = app;
