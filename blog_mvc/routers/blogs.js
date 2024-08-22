const { Router } = require("express");

const blogController = require("../controllers/blogs");


const blogRouter = Router();

blogRouter.get("/", blogController.index);
blogRouter.get("/association/:id", blogController.showAssociation);
blogRouter.get("/:id", blogController.show);
blogRouter.post("/", blogController.create);
blogRouter.patch("/:id", blogController.update);
blogRouter.delete("/:id", blogController.destroy);


module.exports = blogRouter;