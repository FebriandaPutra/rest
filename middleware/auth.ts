import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import User from "../types/user";
import AuthCheckModel from '../models/authCheck';

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function verifyToken(token: string) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

function extractPayload(token: string): Payload {
  return jwt.decode(token);
}

function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: JsonWebTokenError, user: Payload) => {
      if (err) return next(err);
      return next();
    }
  );
}

function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: JsonWebTokenError, user: Payload) => {
      if (err) return next(err);
      if (user.isAdmin) return next();
      else return next(err);
    }
  );
}

function authenticateSpecificUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: JsonWebTokenError, user: Payload) => {
      if (err) return next(err);
      if (user.userId == parseInt(req.params.id)) return next();
      else return res.sendStatus(401);
    }
  );
}

function authenticateUserBySongId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);


  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err: JsonWebTokenError, user: any) => {
      const authCheckModel = new AuthCheckModel();
      const songId = parseInt(req.params.id);
      const userId = user.user_id;
      const checkSong = await authCheckModel.checkSong(songId, userId);
      if (err) return next(err);
      if (user.user_id === req.params.user_id && checkSong) return next();
      else return next(err);
    }
  );
}

export { extractPayload, authenticateUser, authenticateAdmin, authenticateSpecificUser, authenticateUserBySongId };