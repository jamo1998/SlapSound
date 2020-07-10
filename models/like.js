"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.like.belongsTo(models.user);
    }
  }
  like.init(
    {
      songTitle: DataTypes.STRING,
      artist: DataTypes.STRING,
      album: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      previewUrl: DataTypes.STRING,
      trackId: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "like",
    }
  );
  return like;
};
