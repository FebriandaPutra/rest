import { SongModel } from "../models/song";
import { Request, Response } from "express";
import { SongRequest } from "../types/request";
import Song from "../types/song";
import { getSubscribedArtists, updateSubscription } from "../templates/soapTemplates";
import { Subscription } from "../types/subscription";
const util = require("util");
const soapRequest = require("easy-soap-request");
const xml2js = require("xml2js");

const createSongHandler = async (req: Request<Song>, res: Response) => {
  const song: Song = req.body;
  console.log(req.file?.path)
  let filepath = req.file?.path.split("static\\")[1];
  if (filepath === undefined) {
    filepath = req.file?.path.split("static/")[1];
  }
  const createdSong: Song = {
    title: song.title,
    artist_id: song.artist_id,
    audio_path: "/static/" + filepath,
  };
  try {
    const songModel = new SongModel();
    const newSongID = await songModel.create(
      createdSong.title!,
      createdSong.artist_id!,
      createdSong.audio_path!
    );
    res.status(200).json({
      message: `Song ${createdSong.title} created with song id ` + newSongID,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error " + err,
    });
  }
};

const readSongHandler = async (req: Request, res: Response) => {
  const songModel = new SongModel();
  const songID = parseInt(req.params.id);
  try {
    const song = await songModel.findSongById(songID);
    console.log(song);
    const filename = song.audio_path?.slice(8);
    console.log(filename);
    res.status(200).json({
      message: "Song link retrieved",
      data: {
        title: song.title,
        filename: filename,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error " + err,
    });
  }
};

const updateSongHandler = async (req: Request, res: Response) => {
  const songModel = new SongModel();
  const songID = parseInt(req.params.id);
  const song: Song = req.body;
  try {
    const initialSong = await songModel.findSongById(songID);
    let updatedSong: Song;

    if (req.file !== undefined) {
      let filepath = req.file?.path.split("static\\")[1];
      if (filepath === undefined) {
        filepath = req.file?.path.split("static/")[1];
      }
      updatedSong = {
        ...initialSong,
        audio_path: "/static/" + filepath,
      };
    } else {
      updatedSong = {
        ...initialSong,
      };
    }

    if (song.title !== undefined) {
      updatedSong.title = song.title;
    }

    await songModel.update(
      songID,
      updatedSong.title!,
      updatedSong.artist_id!,
      updatedSong.audio_path!
    );
    res.status(200).json({
      message: "Song has been successfully updated.",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error " + err,
    });
  }
};

const deleteSongHandler = async (req: Request, res: Response) => {
  const songModel = new SongModel();
  const songID = parseInt(req.params.id);
  try {
    await songModel.delete(songID);
    res.status(200).json({
      message: "Song with id " + songID + " deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error " + err,
    });
  }
};

const songListManagementHandler = async (req: Request, res: Response) => {
  const songModel = new SongModel();
  const userId = parseInt(req.params.id);
  const page = parseInt(req.query.page as string);

  try {
    const songList = await songModel.findSongsByArtistId(
      userId,
      page * 10 - 10
    );
    res.status(200).json({
      message: "Song list retrieved",
      data: {
        songList: songList,
      },
      page: page,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error " + err,
    });
  }
};

const premiumSongListHandler = async (req: Request, res: Response) => {
  const songModel = new SongModel();
  const userId = parseInt(req.params.id);
  const page = parseInt(req.query.page as string);
  const xml = util.format(getSubscribedArtists.template, userId);
  let subscribedArtists: Subscription[] = [];
  try {
    const { response } = await soapRequest({
      url: getSubscribedArtists.url,
      headers: getSubscribedArtists.headers,
      xml: xml,
    })
    const {headers, body, statusCode } = response;
    const parser = new xml2js.Parser();
    parser.parseString(body, async (err: any, result: any) => {
      const data =
        result["S:Envelope"]["S:Body"][0][
          "ns2:getAllSubscribedArtistsBySubscriberResponse"
        ][0]["return"][0];
      try{
        subscribedArtists = JSON.parse(data).data;
      } catch {
        subscribedArtists = [];
      }
      let artistIds: number[] = [];
      
      for (let i = 0; i < subscribedArtists.length; i++) {
        artistIds[i] = subscribedArtists[i].creator_id;
      }
      
      const songList = await songModel.findPremiumSongs(page * 10 - 10, artistIds);

      res.status(200).json({
        message: "Premium song list retrieved",
        data: {
          songList: songList,
        },
        page: page,
      });
    })
  } catch (err) {
    res.status(500).json({
      message: "Error " + err,
    });
  }
}

export {
  createSongHandler,
  readSongHandler,
  updateSongHandler,
  deleteSongHandler,
  songListManagementHandler,
  premiumSongListHandler,
};
