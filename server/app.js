const express = require("express");
const cors = require("cors");

const logger = require("./logger");
const blogRouter = require("./routers/blogs");
const commentRouter = require("./routers/comments");



const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/blogs", blogRouter);
app.use("/comments", commentRouter);

module.exports = app;