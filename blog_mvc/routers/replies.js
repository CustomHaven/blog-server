const { Router } = require("express");

const replyController = require("../controllers/replies");


const replyRouter = Router();

replyRouter.get("/", replyController.index);
replyRouter.post("/association/reply/:id", replyController.createAssociation);
replyRouter.get("/association/:id", replyController.showAssociation);
replyRouter.get("/:id", replyController.show);
replyRouter.post("/", replyController.create);
replyRouter.patch("/:id", replyController.update);
replyRouter.delete("/:id", replyController.destroy);


module.exports = replyRouter;