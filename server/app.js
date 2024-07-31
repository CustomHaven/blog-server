const express = require("express");
const cors = require("cors");

const logger = require("./logger");
const userRouter = require("./routers/users");
const blogRouter = require("./routers/blogs");
const commentRouter = require("./routers/comments");
const replyRouter = require("./routers/replies");

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/users", userRouter);
app.use("/blogs", blogRouter);
app.use("/comments", commentRouter);
app.use("/replies", replyRouter);

module.exports = app;