const { Router } = require("express");

const commentController = require("../controllers/comments");


const commentRouter = Router();

commentRouter.get("/", commentController.index);
commentRouter.get("/association/:id", commentController.showAssociation);
commentRouter.get("/:id", commentController.show);
commentRouter.post("/", commentController.create);
commentRouter.patch("/:id", commentController.update);
commentRouter.delete("/:id", commentController.destroy);


module.exports = commentRouter;