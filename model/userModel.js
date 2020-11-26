const sequelize = require("../database/connection");

const Sequelize = require("sequelize");

const User = sequelize.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  dob: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  otp: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  photo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = User;
