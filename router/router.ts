import express, { Request, Response, Express } from "express";

import { checkUsernameHandler, loginHandler, registerHandler } from "../service/auth";

const router = express.Router();

import {
  createSongHandler,
  readSongHandler,
  updateSongHandler,
  deleteSongHandler,
  songListManagementHandler,
  premiumSongListHandler,
} from "../service/song";

import { songListHandler, artistListHandler, getNameHandler } from "../service/artist";

import { getAllSubscriptionRequestsHandler, updateSubscriptionHandler, newSubscriptionHandler, resubscribeHandler } from "../service/subscription";

import {
  authenticateUser,
  authenticateAdmin,
  authenticateSpecificUser,
  authenticateUserBySongId,
} from "../middleware/auth";

router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server - Hello World!");
});

router.post("/login", loginHandler);

router.post("/register", registerHandler);


router.use("/song", authenticateUser);

router.post("/song", createSongHandler);

router.get("/song/:id", readSongHandler);

router.use("/song/:id", authenticateUserBySongId);

router.use("/songlist/:id", authenticateSpecificUser)

router.get("/songlist/:id", songListManagementHandler);

router.put("/song/:id", updateSongHandler);

router.delete("/song/:id", deleteSongHandler);

router.get("/artist/song/:id", songListHandler);

router.get("/artist", artistListHandler);

router.put("/resubscribe", resubscribeHandler);

router.use("/subscription", authenticateAdmin);

router.get("/subscription", getAllSubscriptionRequestsHandler);

router.put("/subscription/update", updateSubscriptionHandler);


router.post("/artist/subscribe", newSubscriptionHandler);

router.get("/username", checkUsernameHandler);

router.get("/name/:id", getNameHandler)

router.get("/premium/:id", premiumSongListHandler)

module.exports = router;
