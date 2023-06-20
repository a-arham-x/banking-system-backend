const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const bodyParser = require("body-parser");
const connectToMongo = require("./utils/db");

app.use(cors({
    origin: process.env.FRONTEND_APP
  }))

app.use(bodyParser.json())

connectToMongo()

app.use("/users", require("./routes/users"))

app.get("/", (req, res)=>{
    res.send("Hello World");
})

app.listen(port);