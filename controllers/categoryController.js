const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const NotFoundError = require("../errors/NotFoundError");

const validateCategory = [
    body("name")
        .trim()
        .isAlpha().withMessage("Name must contain only letters.")
        .isLength({ min: 1, max: 45 }).withMessage("Name must be between length 1 and 45 characters."),
    body("description")
        .trim()
        .notEmpty().withMessage("Description cannot be empty.")
];

module.exports = {
    get: asyncHandler(async (req, res) => {
        const categories = await db.getCategories();

        res.render("category/category", {
            categories: categories
        });
    }),

    getCreate: (req, res) => {
        res.render("category/createCategory");
    },

    postCreate: [
        validateCategory,
        asyncHandler(async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).render("category/createCategory", {
                    errors: errors.array()
                });
            }
            const { name, description } = req.body;
            await db.createCategory(name, description);
            res.redirect("/category");
        })
    ],

    getRead: asyncHandler(async (req, res) => {
        const { category, items } = await db.readCategory(req.params.id);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        res.render("category/readCategory", {
            category: category,
            items:items
        });
    }),

    getUpdate: asyncHandler(async (req, res) => {
        const { category } = await db.readCategory(req.params.id);
        if (!category) {
            throw new NotFoundError("Category not found");
        }

        res.render("category/updateCategory", {
            category: category
        })
    }),

    postUpdate: [
        validateCategory,
        asyncHandler(async (req, res) => {
            const { category } = await db.readCategory(req.params.id);
            if (!category) {
                throw new NotFoundError("Category not found");
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).render("category/updateCategory", {
                    category: category,
                    errors: errors.array()
                });
            }
            const { name, description } = req.body;
            await db.updateCategory(req.params.id, name, description);
            res.redirect("/category");
        })
    ],

    postDelete: asyncHandler(async (req, res) => {
        await db.deleteCategory(req.params.id);
        res.redirect("/category");
    })
};