exports.get404 = (req, res, next) => {
  res.send({
    status: false,
    data: "Invalid URL please check and try again",
  });
};
