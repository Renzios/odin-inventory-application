require("dotenv").config();

const express = require("express");
const path = require("node:path");

const indexRouter = require("./routes/indexRouter");
const categoryRouter = require("./routes/categoryRouter");
const itemRouter = require("./routes/itemRouter");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/category", categoryRouter);
app.use("/item", itemRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

app.listen(process.env.PORT || 3000);