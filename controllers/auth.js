const express = require("express");
const router = express.Router();
const db = require("../models");
// import middleware
const flash = require("flash");
const passport = require("../config/passportConfig");

// register get route
router.get("/register", function (req, res) {
  res.render("auth/register");
});
// register post route
router.post("/register", function (req, res) {
  db.user
    .findOrCreate({
      where: {
        email: req.body.email,
      },
      defaults: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
        profilePicUrl: req.body.profilePicUrl,
      },
    })
    .then(function ([user, created]) {
      // if user was created
      if (created) {
        console.log("User created! 🎉");
        passport.authenticate("local", {
          successRedirect: "/profile",
          successFlash: "Thanks for signing up!",
        })(req, res);
      } else {
        console.log("User email already exists 🚫.");
        req.flash("error", "Error: email already exists for user. Try again.");
        res.redirect("/auth/register");
      }
    })
    .catch(function (err) {
      console.log(
        `Error found. \nMessage: ${err.message}. \nPlease review - ${err}`
      );
      req.flash("error", err.message);
      res.redirect("/auth/register");
    });
});

// login get route
router.get("/login", function (req, res) {
  res.render("auth/login");
});

// login post route
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (error, user, info) {
    // if no user authenticated
    console.log("Step 1:");
    if (!user) {
      console.log("error here");
      req.flash("error", "Invalid username or password");
      return res.redirect("/auth/login");
    }
    if (error) {
      console.log("error here!!!!!!!");
      return next(error);
    }

    req.login(user, function (error) {
      console.log("Step 2:");
      // if error move to error
      if (error) next(error);
      // if success flash success message
      req.flash("success", "You are validated and logged in.");
      // if success save session and redirect user
      req.session.save(function () {
        return res.redirect("/profile");
      });
    });
  })(req, res, next);
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// export router
module.exports = router;
