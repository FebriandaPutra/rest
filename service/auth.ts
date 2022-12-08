import dotenv from "dotenv";
import UserModel from "../models/user";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../types/user";
import { LoginRequest } from "../types/request";
import { Cache } from "../core/cache";

const jwt = require("jsonwebtoken");

dotenv.config();

const loginHandler = async (req: Request<LoginRequest>, res: Response) => {
  const userModel = new UserModel();
  const username = req.body?.username;
  const password = req.body?.password;
  try {
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      } else {
        const user = await userModel.findOneByUsername(username);
        if (user) {
          bcrypt.compare(password, user.password!, (err, result) => {
            if (err) {
              res.status(401).json({
                message: "Login failed",
              });
            }
            if (result) {
              const token = jwt.sign(
                {
                  username: user.username,
                  userId: user.userId,
                  isAdmin: user.isAdmin,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                  expiresIn: "7d",
                }
              );
              return res.status(200).json({
                message: "Login successful. Logged in as " + user.username,
                token: token,
              });
            }
            res.status(401).json({
              message: "Login failed. Wrong username or password.",
            });
          });
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

const registerHandler = async (req: Request<User>, res: Response) => {
  const initialUser: User = req.body;
  const user = { isAdmin: false, ...initialUser };
  const cache: Cache = new Cache();
  await cache.connect();
  user.password = await bcrypt.hash(user.password!, 10);
  try {
    const userModel = new UserModel();
    const newUserID = await userModel.create(user);
    res.status(200).json({
      message: "Successfully registered as " + user.username,
    });
    cache.deleteContains("artistList");
  } catch (err) {
    res.status(500).json({
      message: "Error " + err,
    });
  }
};

const checkUsernameHandler = async (req: Request, res: Response) => {
  const userModel = new UserModel();
  const username = req.query.username as string;
  const cache: Cache = new Cache();
  await cache.connect();
  try {
    const userCached = await cache.get("usernameList", async () => {
      return await userModel.findUsernames();
    });
    if (userCached.find(x => x.username === username) !== undefined) {
      res.status(200).json({
        message: "Username already exists",
        data: true,
      });
    } else {
      res.status(200).json({
        message: "Username is available",
        data: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error " + err,
    });
  }
};

export { loginHandler, registerHandler, checkUsernameHandler };
