const userModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "workmail.sujit@gmail.com",
    pass: "Alpha1997#",
  },
});

exports.postRegister = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const name = req.body.name;
    var result = await userModel.findAll({ where: { email: email } });
    if (result.length > 0) {
      return res.json({
        status: false,
        message: "User Already Registered",
      });
    }
    if (password == confirmPassword) {
      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new userModel({
            email: email,
            password: hashedPassword,
            name: name,
          });
          return user.save();
        })
        .then(() => {
          return res.json({
            status: true,
            message: "User Registered Sucessfully",
          });
        })
        .catch((err) => {
          console.log(err);
          return res.json({
            status: false,
            message: err.message,
          });
        });
    } else {
      return res.json({
        status: false,
        message: "Password Not Matched",
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

exports.postLogin = async (req, res, next) => {
  try {
    var result = await userModel.findAll({ where: { email: req.body.email } });
    if (result.length < 1) {
      return res.status(401).json({
        status: false,
        message: "Auth failed",
      });
    }
    bcrypt.compare(req.body.password, result[0].password, (err, passed) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: "Auth failed",
        });
      }
      if (passed) {
        const token = jwt.sign(
          {
            email: result[0].email,
            name: result[0].name,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          status: true,
          message: "Auth Successful",
          token: token,
        });
      }
      res.status(401).json({
        status: true,
        message: "Auth failed",
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

exports.forgotPassword = async (req, res, next) => {
  try {
    var result = await userModel.findAll({ where: { email: req.body.email } });
    if (result.length == 0) {
      return res.json({
        status: false,
        message: "User Not Found",
      });
    }
    otp = Math.floor(100000 + Math.random() * 900000);

    if (result.length > 0) {
      name = result[0].name;
      transporter.sendMail(
        {
          to: req.body.email,
          from: "workmail.sujit@gmail.com",
          subject: "Forgot Password",
          html: `<h1>Hello! "${name}"<h3>Your Email is "${req.body.email}" and Your OTP is "${otp}"</h3>`,
        },
        (err, info) => {
          if (err) {
          } else {
            console.log(info);
          }
        }
      );
      userModel
        .update({ otp: otp }, { where: { email: req.body.email } })
        .then(() => {
          return res.json({
            status: true,
            message: "OTP Sent to email",
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

exports.resetPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;
    const password = req.body.newPassword;
    const cpassword = req.body.confirmPassword;
    const result = await userModel.findAll({
      where: { otp: otp, email: email },
    });

    if (result.length == 0) {
      return res.json({
        status: false,
        message: "OTP or Email is Incorrect",
      });
    }
    if (result.length > 0) {
      if (password === cpassword) {
        bcrypt.hash(password, 12).then((hashedPassword) => {
          return userModel
            .update(
              { password: hashedPassword },
              { where: { otp: otp, email: email } }
            )
            .then(() => {
              return res.json({
                status: true,
                message: "Password Updated Sucessfully",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      } else {
        return res.json({
          status: false,
          message: "Password Not Mached",
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    var photo = req.file.path;
    var email = req.body.email;
    var name = req.body.name;
    var dob = req.body.dob;
    var gender = req.body.gender;
    const result = await userModel.findAll({
      where: { email: email },
    });
    if (result.length > 0) {
      return userModel
        .update(
          { name: name, dob: dob, gender: gender, photo: photo },
          { where: { email: email } }
        )
        .then(() => {
          return res.json({
            status: true,
            message: "User Updated Sucessfully",
          });
        });
    } else {
      return res.json({
        status: false,
        message: "User not found",
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
