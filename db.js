const mongoose = require("mongoose");
require("dotenv").config();
mongoose
  .connect(process.env.mongoDBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
