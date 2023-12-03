require("dotenv").config();
import db from "./config/connection";
import express from "express";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 4000;

// import route setup files
import { UserRoutes } from "./modules/user/routes";
import { urlencoded } from "express";

// use middlewares
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);
app.use(express.json());
app.use(urlencoded({ extended: true }));

//conecting to database
db.authenticate();

app.use(function (req, res, next) {
  console.log(`method=${req.method} route=${req.url}`);
  next();
});

// user routes
UserRoutes(app);

app.get("*", (req: any, res: { send: (arg0: string) => void }) => {
  res.send("404");
});

app.listen(PORT, () => console.log(`Server Running ${PORT}`));
