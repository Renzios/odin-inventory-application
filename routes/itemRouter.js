const { Router } = require("express");
const itemRouter = Router();
const itemController = require("../controllers/itemController");

itemRouter.get("/", itemController.get);

itemRouter.get("/create", itemController.getCreate);
itemRouter.post("/create", itemController.postCreate);

itemRouter.get("/:id/read", itemController.getRead);

itemRouter.get("/:id/update", itemController.getUpdate);
itemRouter.post("/:id/update", itemController.postUpdate);

itemRouter.post("/:id/delete", itemController.postDelete);

module.exports = itemRouter;