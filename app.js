const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const bodyParser = require('body-parser')

const sequelize = require("./utils/database");
const User = require("./models/user");

const userRoutes = require("./routes/user");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/user", userRoutes);

app.use(bodyParser.urlencoded({ extended: true }));


sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {console.log('server running on port 3000')});
  })
  .catch((err) => console.log(err));