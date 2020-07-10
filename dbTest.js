const db = require("./models");

const errHandler = (error) => {
  console.log("👾👾👾👾👾👾👾👾");
  console.log(error);
};

// FIND OR CREATE
// db.like
//   .findOrCreate({
//     where: {
//       trackId: "0Tnvt4bDxyiBCRaj03qO8z",
//     },
//     // If user with ^^ email doesn't exist, create new user
//     defaults: {
//       songTitle: "My Collection",
//       artist: "Future",
//       album: "HENDRIXX",
//       imageUrl: "image-url",
//       previewUrl: "preview-url",
//       userId: 1,
//     },
//   })
//   .then(([like, created]) => {
//     console.log(`🌎 ${like.songTitle} was ${created ? "created" : "found"}!`);
//   })
//   .catch(errHandler);

// DESTROY
// db.like
//   .destroy({
//     where: {
//       trackId: "0Tnvt4bDxyiBCRaj03qO8z",
//     },
//   })
//   .then((deleted) => {
//     console.log("👽👽");
//     // Number of items deleted
//     console.log(deleted);
//   })
//   .catch(errHandler);
