require("dotenv").config();
import db from "./config/connection";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./library/passport";

const app = express();
const PORT = process.env.PORT || 4000;

// import route setup files
import { AuthRoutes } from "./modules/auth/routes";
import { UserRoutes } from "./modules/user/routes";
import { urlencoded } from "express";
import { AppRoutes } from "./modules/app/routes";

const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

// Set up CORS options
const corsOptions = {
  origin: (
    origin: string,
    callback: (error?: null | Error, status?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Use middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(urlencoded({ extended: true }));

// Use Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Conecting to database
db.authenticate();

app.use(function (req, res, next) {
  console.log(`method=${req.method} route=${req.url}`);
  next();
});

// routes
AuthRoutes(app);
UserRoutes(app);
AppRoutes(app);

app.get("*", (req: any, res: { send: (arg0: string) => void }) => {
  res.send("404");
});

app.listen(PORT, () => console.log(`Server Running ${PORT}`));
