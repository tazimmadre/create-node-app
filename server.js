// packages
import express, { urlencoded, json } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "dotenv";
import cors from "cors";
import expressListRoutes from "express-list-routes";
import { connect } from "./util/db.js";
import { SECRETS } from "./util/config.js";
import { upload } from './util/upload';
import { forgotPassword } from "./src/controllers/user.controllers.js"
import { signup, signin, requiresLogin, adminSignin, adminSignUp, requiresAdminLogin } from "./util/auth.js";
import { User } from "./src/models/user.model.js";
import UserRouter from "./src/routes/user.router.js";

config();

const app = express();
const PORT = process.env.PORT || 3000;

export const userModel = (req, res, next) => {
  req.model = User;
  next();
};

import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: (60 * 1000), // 1 minute
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter)


app.use(helmet());
app.use((req, res, next) => {
  res.set('X-XSS-Protection', '1; mode=block');
  res.set('X-Frame-Options', 'deny');
  res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next()
})
app.use(helmet.hidePoweredBy());

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

//endpoint shows Server Running
app.get("/", (req, res) => {
  res.json("Server is Running");
});

//util single file upload API
app.post("/upload", upload.single('file'), (req, res) => res.send({ imageURL: req.file.path }));

//Auth Routes for user
app.post("/register", userModel, signup);
app.post("/login", userModel, signin);

//user crud API'S
app.use("/api/user", userModel, requiresLogin, UserRouter);

//change Password without login
app.put("/changePassword", forgotPassword)

//admin auth 
app.post("/admin-register", userModel, adminSignUp);
app.post("/admin-login", userModel, adminSignin);


export const start = async () => {
  try {
    connect();
    app.listen(PORT, () => {
      if (SECRETS.node_env === "development") {
        expressListRoutes(app);
      }
      console.log(`REST API on http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.error(e);
  }
};
