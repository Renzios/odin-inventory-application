const { Router } = require("express");
const categoryRouter = Router();
const categoryController = require("../controllers/categoryController");

categoryRouter.get("/", categoryController.get);

categoryRouter.get("/create", categoryController.getCreate);
categoryRouter.post("/create", categoryController.postCreate);

categoryRouter.get("/:id/read", categoryController.getRead);

categoryRouter.get("/:id/update", categoryController.getUpdate);
categoryRouter.post("/:id/update", categoryController.postUpdate);

categoryRouter.post("/:id/delete", categoryController.postDelete);

module.exports = categoryRouter;