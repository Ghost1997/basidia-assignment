const { request } = require("express");
const friendModel = require("../model/friendModel");
const userModel = require("../model/userModel");
const axios = require("axios");
exports.sendRequest = async (req, res, next) => {
  try {
    const from = req.body.from;
    const to = req.body.to;

    var fromResult = await userModel.findAll({ where: { email: from } });
    var toResult = await userModel.findAll({ where: { email: to } });

    if (fromResult.length == 0 && toResult.length == 0) {
      return res.json({
        status: false,
        message: "User Not Found",
      });
    } else if (fromResult.length == 1 && toResult.length == 1) {
      const friendRequest = new friendModel({
        to: to,
        from: from,
      });

      return friendRequest.save().then(() => {
        return res.json({
          status: true,
          message: "Request Sent Sucessfully",
        });
      });
    }
    return res.json({
      status: false,
      message: "User Not Found",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.allRequets = async (req, res, next) => {
  try {
    const email = req.query.email;
    const request = await friendModel.findAll({
      where: { to: email, status: 0 },
    });
    if (request.length == 0) {
      return res.json({
        status: false,
        message: "User Not Found",
      });
    }
    var requestList = [];
    for (var i = 0; i < request.length; i++) {
      requestList.push(request[i].from);
    }
    return res.json({
      status: true,
      requestList: requestList,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.respondRequest = async (req, res, next) => {
  try {
    var userEmail = req.query.email;
    var friendEmail = req.body.friendEmail;
    var resonse = req.body.resonse;

    const request = await friendModel.findAll({
      where: { from: friendEmail, to: userEmail, status: 0 },
    });
    if (request.length == 0) {
      return res.json({
        status: false,
        message: "Check User and try again",
      });
    }
    if (request.length > 0 && resonse == "Accept") {
      return friendModel
        .update(
          { status: 1, friend: "YES" },
          { where: { from: friendEmail, to: userEmail, status: 0 } }
        )
        .then(() => {
          return res.json({
            status: true,
            message: "Friend Request Accepted",
          });
        });
    }
    if (request.length > 0 && resonse == "Reject") {
      return friendModel
        .destroy({
          where: { from: friendEmail, to: userEmail, status: 0 },
        })
        .then(() => {
          return res.json({
            status: true,
            message: "Friend Request Rejected",
          });
        });
    }
    return res.json({
      status: false,
      message: "Check User and try again",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.getFriends = async (req, res, next) => {
  try {
    var email = req.query.email;
    var resultTo = await friendModel.findAll({
      where: { to: email, status: 1 },
    });
    var resultFrom = await friendModel.findAll({
      where: { from: email, status: 1 },
    });

    var friendList = [];
    if (resultTo.length > 0 || resultFrom.length > 0) {
      for (var i = 0; i < resultTo.length; i++) {
        friendList.push(resultTo[i].from);
      }
      for (var i = 0; i < resultFrom.length; i++) {
        friendList.push(resultFrom[i].to);
      }
      return res.json({
        status: true,
        friendList: friendList,
      });
    }
    return res.json({
      status: false,
      message: "No friends found",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.removeFriend = async (req, res, next) => {
  try {
    var to = req.body.to;
    var from = req.body.from;
    var resultTo = await friendModel.findAll({
      where: { to: to, from: from, status: 1 },
    });
    var resultFrom = await friendModel.findAll({
      where: { to: from, from: to, status: 1 },
    });
    if (resultFrom.length == 0 && resultTo.length == 0) {
      return res.json({
        status: false,
        message: "No friendship exist",
      });
    }
    if (resultFrom.length) {
      friendModel
        .destroy({
          where: { to: from, from: to, status: 1 },
        })
        .then(() => {
          return res.json({
            status: true,
            message: "friend Removed from your Life",
          });
        });
    }
    if (resultTo.length) {
      friendModel
        .destroy({
          where: { to: to, from: from, status: 1 },
        })
        .then(() => {
          return res.json({
            status: true,
            message: "friend Removed from your Life",
          });
        });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.fof = async (req, res, next) => {
  try {
    var myEmail = req.query.myEmail;
    var friendEmail = req.query.friendEmail;
    let resultFirst = await axios.get("http://localhost:4000/getFriend", {
      params: {
        email: myEmail,
      },
    });

    let result = await axios.get("http://localhost:4000/getFriend", {
      params: {
        email: friendEmail,
      },
    });
    var found = false;
    for (var i = 0; i < resultFirst.data.friendList.length; i++) {
      console.log(resultFirst.data.friendList[i]);
      if (resultFirst.data.friendList[i] == friendEmail) {
        found = true;
        break;
      }
    }
    if (found) {
      return res.json({
        status: true,
        friendList: result.data.friendList,
      });
    } else {
      return res.json({
        status: false,
        message: "No Friendship Exist",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.mutualFriend = async (req, res, next) => {
  try {
    var myEmail = req.query.myEmail;
    var friendEmail = req.query.friendEmail;
    var output = [];
    let resultFirst = await axios.get("http://localhost:4000/getFriend", {
      params: {
        email: myEmail,
      },
    });

    let result = await axios.get("http://localhost:4000/getFriend", {
      params: {
        email: friendEmail,
      },
    });
    for (var i = 0; i < resultFirst.data.friendList.length; i++) {
      for (var j = 0; j < result.data.friendList.length; j++) {
        if (resultFirst.data.friendList[i] == result.data.friendList[j]) {
          output.push(resultFirst.data.friendList[i]);
        }
      }
    }
    if (output.length > 0) {
      return res.json({
        status: true,
        mutualFriend: output,
      });
    } else {
      return res.json({
        status: false,
        mutualFriend: "No Mutual Friends",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};
