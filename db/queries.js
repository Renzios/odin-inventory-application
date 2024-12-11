const pool = require("./pool");

module.exports = {
    getCategories: async () => {
        const SQL = `
            SELECT *
            FROM categories
        `;
        const { rows: categories } = await pool.query(SQL);

        return categories;
    },

    createCategory: async (name, description) => {
        const SQL = `
            INSERT INTO categories (name, description)
            VALUES($1, $2)
        `;
        await pool.query(SQL, [name, description]);
    },

    readCategory: async (id) => {
        const categorySQL = `
            SELECT *
            FROM categories
            WHERE id = $1
        `;
        const { rows: [category] } = await pool.query(categorySQL, [id]);

        const itemsSQL = `
            SELECT *
            FROM items
            WHERE category_id = $1
        `;
        const { rows: items } = await pool.query(itemsSQL, [id]);

        return {
            category,
            items
        };
    },

    updateCategory: async (id, name, description) => {
        const SQL = `
            UPDATE categories
            SET
                name = $1,
                description = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
        `;
        await pool.query(SQL, [name, description, id]);
    },

    deleteCategory: async (id) => {
        const SQL = `
            DELETE FROM categories
            WHERE id = $1
        `;
        await pool.query(SQL, [id]);
    },
}