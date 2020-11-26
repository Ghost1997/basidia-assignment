const postModel = require("../model/postModel");

exports.postPost = async (req, res, next) => {
  try {
    const email = req.body.email;
    const pid = req.body.postId;
    const title = req.body.title;
    const body = req.body.body;

    var result = await postModel.findAll({ where: { pid: pid } });
    if (result.length > 0) {
      return res.json({
        status: false,
        message: "Duplicate Post ID",
      });
    }
    const post = new postModel({
      email: email,
      pid: pid,
      title: title,
      body: body,
    });
    return post
      .save()
      .then(() => {
        return res.json({
          status: true,
          message: "Post Created Sucessfully",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          status: false,
          message: err.message,
        });
      });
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const pid = req.query.postId;
    const result = await postModel.findAll({ where: { pid: pid } });
    if (result.length > 0) {
      postModel
        .destroy({
          where: {
            pid: pid,
          },
        })
        .then(() => {
          return res.json({
            status: true,
            message: "Post Deleted Sucessfully",
          });
        });
    } else {
      return res.json({
        status: false,
        message: "Post Not Exist",
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
