import pool from "../db.js";

const createUser = async (email, hashedPassword) => {
    try {
        await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [email, hashedPassword]
        );
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const getUserByEmail = async (email) => {
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return user.rows[0];
};

const getUserById = async (id) => {
  const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return user.rows[0];
};

export { createUser, getUserByEmail, getUserById };
