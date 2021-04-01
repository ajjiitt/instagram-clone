const express = require("express");
const app = express();
const cors = require('cors');
const morgan = require("morgan");
require("dotenv").config();

require("./db.js");
// require("./models/user.js");

const port = process.env.port || 5000;

// middleware & register's
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

// listening
app.listen(port, () => {
  console.log(`running on port ${port}`);
});
