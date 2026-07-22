const { pool } = require('../config/db');

class UserModel {
    /**
     * Create a new user
     */
    static async create({ name, email, password, role = 'teacher' }) {
        const sql = `
            INSERT INTO Users (name, email, password, role)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.execute(sql, [name, email, password, role]);
        return result.insertId;
    }

    /**
     * Find user by email address
     */
    static async findByEmail(email) {
        const sql = `SELECT * FROM Users WHERE email = ? LIMIT 1`;
        const [rows] = await pool.execute(sql, [email]);
        return rows[0] || null;
    }

    /**
     * Find user by ID
     */
    static async findById(id) {
        const sql = `SELECT user_id, name, email, role, created_at FROM Users WHERE user_id = ? LIMIT 1`;
        const [rows] = await pool.execute(sql, [id]);
        return rows[0] || null;
    }

    /**
     * Get all users
     */
    static async getAll() {
        const sql = `SELECT user_id, name, email, role, created_at FROM Users ORDER BY user_id DESC`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = UserModel;
