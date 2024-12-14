const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const NotFoundError = require("../errors/NotFoundError");

const validateItem = [
    body("name")
        .trim()
        .isAlpha().withMessage("Name must contain only letters.")
        .isLength({ min: 1, max: 45 }).withMessage("Name must be between length 1 and 45 characters."),
    body("quantity")
        .trim()
        .isInt().withMessage("Quantity must be an integer"),
    body("price")
        .trim()
        .isDecimal().withMessage("Price must be a decimal"),
    body("description")
        .trim()
        .notEmpty().withMessage("Description cannot be empty."),
    body("category_id")
        .trim()
];

module.exports = {
    get: asyncHandler(async (req, res) => {
        const items = await db.getItems();

        res.render("item/item", {
            items: items
        });
    }),

    getCreate: asyncHandler(async (req, res) => {
        const categories = await db.getCategories();
        res.render("item/createItem", {
            categories: categories
        });
    }),

    postCreate: [
        validateItem,
        asyncHandler(async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const categories = await db.getCategories();
                return res.status(400).render("item/createItem", {
                    categories: categories,
                    errors: errors.array()
                });
            }
            const { name, quantity, price, description, category_id } = req.body;
            await db.createItem(name, quantity, price, description, category_id);
            res.redirect("/item");
        })
    ],

    getRead: asyncHandler(async (req, res) => {
        const item = await db.readItem(req.params.id);
        if (!item) {
            throw new NotFoundError("Item not found");
        }
        const { category } = await db.readCategory(item.category_id);
        res.render("item/readItem", {
            item: item,
            category: category.name
        });
    }),

    getUpdate: asyncHandler(async (req, res) => {
        const item = await db.readItem(req.params.id);
        if (!item) {
            throw new NotFoundError("Item not found");
        }
        const categories = await db.getCategories();
        res.render("item/updateItem", {
            item: item,
            categories: categories
        })
    }),

    postUpdate: [
        validateItem,
        asyncHandler(async (req, res) => {
            const item = await db.readItem(req.params.id);
            if (!item) {
                throw new NotFoundError("Item not found");
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const categories = await db.getCategories();
                return res.status(400).render("item/updateItem", {
                    item: item,
                    categories: categories,
                    errors: errors.array()
                });
            }
            const { name, quantity, price, description, category_id } = req.body;
            await db.updateItem(req.params.id, name, quantity, price, description, category_id);
            res.redirect("/item");
        })
    ],

    postDelete: asyncHandler(async (req, res) => {
        await db.deleteItem(req.params.id);
        res.redirect("/item");
    })
};