// user model declaration
"use strict";
const bcrypt = require("bcrypt");

// declare user model format
module.exports = (sequelize, DataTypes) => {
  // define user object
  const user = sequelize.define(
    "user",
    {
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            msg: "Invalid email address",
          },
        },
        unique: {
          args: true,
          msg: "Email address already in use!",
        },
      },
      firstName: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [1, 99],
            msg: "Fisrt name must be between 1 and 99 characters",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [1, 99],
            msg: "Last name must be between 1 and 99 characters",
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [1, 99],
            msg: "Name must be between 1 and 99 characters",
          },
        },
        unique: {
          args: true,
          msg: "Username already in use! Please choose another",
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [8, 99],
            msg:
              "Password is of incorrect length. Double check character number.",
          },
        },
      },
      bio: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: [8, 5000],
            msg:
              "Biography is of incorrect length. Double check character number.",
          },
        },
      },
      profilePicUrl: {
        type: DataTypes.STRING,
      },
    },
    {
      hooks: {
        // take inputed password
        beforeCreate: function (createdUser, options) {
          if (createdUser && createdUser.password) {
            let hash = bcrypt.hashSync(createdUser.password, 12);
            createdUser.password = hash;
          }
        },
      },
    }
  );
  user.associate = function (models) {
    // TODO: any user associations
    models.user.hasMany(models.like);
  };

  // validPassword definition to validate password at user login
  user.prototype.validPassword = function (passwordTyped) {
    return bcrypt.compareSync(passwordTyped, this.password);
  };

  // remove password before any serialization of User object
  user.prototype.toJSON = function () {
    let userData = this.get();
    delete userData.password;
    return userData;
  };

  return user;
};
