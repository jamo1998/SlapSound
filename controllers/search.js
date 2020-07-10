require("dotenv").config();
const express = require("express");
const router = express.Router();
const Spotify = require("node-spotify-api");
const db = require("../models");
const { route } = require("./auth");

let spotify = new Spotify({
  id: process.env.SPOTIFY_CLIENT_ID,
  secret: process.env.SPOTIFY_CLIENT_SECRET,
});

router.get("/", (req, res) => {
  res.render("search/songSearch");
});

router.get("/song-search", (req, res) => {
  spotify
    .search({ type: "track", query: req.query.userInput })
    .then(function (response) {
      // console.log(response.tracks.items);
      let result = response.tracks.items;
      // res.send(result);
      res.render("search/songResult", { songData: result });
    })
    .catch(function (err) {
      console.log(err);
    });
});

module.exports = router;
