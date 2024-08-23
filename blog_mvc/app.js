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

console.log("app js inside! NODE_ENV is?!", process.env.NODE_ENV);
console.log("app js inside! JWT BIG SECRET? is?!", process.env.JWT_SECRET);
console.log("app js inside! CHECK_OUT_DOCKER_ENV FROM DOCKER!", process.env.CHECK_OUT_DOCKER_ENV);
console.log("app js inside! CHECK_OUT_DOCKER_ENV FROM DOCKER! value = ", process.env.CHECK_OUT_DOCKER_ENV);
console.log("app js inside! INNER_SECRET I from inside the app! value = ", process.env.INNER_SECRET);


app.use("/users", userRouter);
app.use("/blogs", blogRouter);
app.use("/comments", commentRouter);
app.use("/replies", replyRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Sever is healthy and it is running!"
  });
});

module.exports = app;