const sequelize = require("../database/connection");

const Sequelize = require("sequelize");

const Post = sequelize.define("post", {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  pid: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Post;
