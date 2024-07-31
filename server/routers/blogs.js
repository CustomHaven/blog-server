const { Router } = require("express");

const blogController = require("../controllers/blogs");


const countryRouter = Router();

// countryRouter.get("/", blogController.index);
countryRouter.get("/:id", blogController.show);
// countryRouter.post("/", blogController.create);
// countryRouter.patch("/:id", blogController.update);
// countryRouter.delete("/:id", blogController.destroy);


module.exports = countryRouter;