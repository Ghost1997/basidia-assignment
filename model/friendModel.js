const sequelize = require("../database/connection");

const Sequelize = require("sequelize");

const Friend = sequelize.define("friend", {
  from: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  to: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  friend: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "NO",
  },
});

module.exports = Friend;
