const express = require("express");
const path = require("path");
const app = express();
const morgan = require("morgan");
const db = require("./database/connection");
const bodyParser = require("body-parser");
const routes = require("./routes/router");
const routeNotFound = require("./controllers/404Controller");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/", routes);
app.use(routeNotFound.get404);
db.sync()
  .then(() => {
    app.listen(process.env.PORT || 4000);
    console.log("DB CONNECTED");
    console.log("SERVER ON http://localhost:4000 ");
  })
  .catch((err) => {
    console.log(err.message);
  });
