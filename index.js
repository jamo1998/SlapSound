// Required NPM libraries
require("dotenv").config();
const Express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const helmet = require("helmet");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./config/passportConfig");
const db = require("./models");
const isLoggedIn = require("./middlewares/isLoggedIn");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const Spotify = require("node-spotify-api");
const methodOverride = require("method-override");

// app setup
const app = Express();
app.use(Express.urlencoded({ extended: false }));
app.use(Express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(methodOverride("_method"));
app.use(require("morgan")("dev"));
app.use(helmet());

// create new instance of class Sequelize Store
const sessionStore = new SequelizeStore({
  db: db.sequelize,
  expiration: 1000 * 60 * 30,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
  })
);

sessionStore.sync();

// initialize passport and session info
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;

  next();
});

// ROUTES
app.get("/", function (req, res) {
  // check to see if user logged in
  res.render("index");
});

// GET PROFILE AFTER USER LOGS IN
app.get("/profile", isLoggedIn, function (req, res) {
  res.render("profile");
});

let spotify = new Spotify({
  id: process.env.SPOTIFY_CLIENT_ID,
  secret: process.env.SPOTIFY_CLIENT_SECRET,
});

// GET ALL LIKES FOR A SPECIFIC USER
app.get("/:id/likes", (req, res) => {
  db.like
    .findAll({
      where: {
        userId: req.params.id,
      },
      include: [db.user],
    })
    .then((likes) => {
      res.render("likes", { likes: likes });
    })
    .catch((err) => {
      console.log(err);
    });
});

// ADD SONG TO LIKES
app.post("/likes", (req, res) => {
  db.like
    .findOrCreate({
      where: {
        trackId: req.body.trackId,
      },
      // If song with ^^ trackId doesn't exist, create new like
      defaults: {
        songTitle: req.body.songTitle,
        artist: req.body.artist,
        album: req.body.album,
        imageUrl: req.body.imageUrl,
        previewUrl: req.body.previewUrl,
        userId: req.body.userId,
      },
    })
    .then(([like, created]) => {
      console.log(`🌎 ${like.songTitle} was ${created ? "created" : "found"}!`);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/:id/artists", (req, res) => {
  db.artist
    .findAll({
      where: {
        userId: req.params.id,
      },
      include: [db.user],
    })
    .then((artists) => {
      res.render("artists", { artists: artists });
    })
    .catch((err) => {
      console.log(err);
    });
});

// ADD ATISTS TO LIKES
app.post("/artists", (req, res) => {
  db.artist
    .findOrCreate({
      where: {
        artistId: req.body.artistId,
      },
      // If song with ^^ trackId doesn't exist, create new like
      defaults: {
        artistName: req.body.artistName,
        artistFollowers: req.body.artistFollowers,
        genre: req.body.genre,
        userId: req.body.userId,
      },
    })
    .then(([artist, created]) => {
      console.log(
        `🌎 ${artist.artistName} was ${created ? "created" : "found"}!`
      );
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

// DELETE ARTIST BY ID
app.delete("/artists/delete/:id", (req, res) => {
  db.artist
    .destroy({
      where: {
        artistId: req.params.id,
      },
    })
    .then((artists) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

// DELTE LIKE BY ID
app.delete("/likes/delete/:id", (req, res) => {
  db.like
    .destroy({
      where: {
        id: req.params.id,
      },
    })
    .then((likes) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

// GET ALBUMS BY USER ID
app.get("/:id/albums", (req, res) => {
  db.album
    .findAll({
      where: {
        userId: req.params.id,
      },
      include: [db.user],
    })
    .then((albums) => {
      res.render("albums", { albums: albums });
    })
    .catch((err) => {
      console.log(err);
    });
});

// ADD ALBUMS TO LIKES
app.post("/albums", (req, res) => {
  db.album
    .findOrCreate({
      where: {
        albumId: req.body.albumId,
      },
      // If song with ^^ trackId doesn't exist, create new like
      defaults: {
        albumName: req.body.albumName,
        albumArtist: req.body.albumArtist,
        releaseDate: req.body.releaseDate,
        tracks: req.body.tracks,
        userId: req.body.userId,
      },
    })
    .then(([album, created]) => {
      console.log(
        `🌎 ${album.albumName} was ${created ? "created" : "found"}!`
      );
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

// include auth controller
app.use("/auth", require("./controllers/auth"));
app.use("/search", require("./controllers/search"));

// initialize App on Port
app.listen(process.env.PORT || 3000, function () {
  console.log(`Listening on localhost: ${process.env.PORT}!!`);
});
