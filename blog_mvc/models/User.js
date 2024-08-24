const db = require("../db/connect");

class User {
    constructor({ user_id, username, email, admin, password, created_at, updated_at }) {
        this.user_id = user_id;
        this.username = username;
        this.email = email;
        this.admin = admin;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async getAll() {
        const users = await db.query("SELECT * FROM users");
        if (users.rows.length === 0) {
            throw new Error("No users available");
        }
        return users.rows.map(c => new User(c))
    }

    static async show(id) {
        const user = await db.query("SELECT * FROM users WHERE user_id = $1", [id]);
        if (user.rows.length !== 1) {
            throw new Error("No user found");
        }
        return new User(user.rows[0]);
    }

    static async getOneByEmail(email) {
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length !== 1) {
            throw new Error("No user found");
        }
        return new User(user.rows[0]);
    }

    static async create(data) {
        const { username, email, password } = data;
        if (!username || !email || !password ) {
            throw new Error("One of the required fields missing.");
        }

        const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (existingUser.rows.length === 0) {
            let response = await db.query(`INSERT INTO users (username, email, password) 
                VALUES ($1, $2, $3) RETURNING *`, [username, email, password]);
            return new User(response.rows[0]);
        }
        throw new Error("User already exist");
    }

    static async createAdmin(data) {
        const { username, email, admin, password } = data;
        if (!username || !email || !admin || !password ) {
            throw new Error("One of the required fields missing.");
        }

        const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (existingUser.rows.length === 0) {
            let response = await db.query(`INSERT INTO users (username, email, password, admin) 
                VALUES ($1, $2, $3, $4) RETURNING *`, [username, email, password, admin]);
            return new User(response.rows[0]);
        }
        throw new Error("User already exist");
    }


    async update(data) {
        for (const key of Object.keys(this)) {
            if (key in data && key !== "user_id") {
                this[key] = data[key];
            }
        }

        this.updated_at = new Date();

        const response = await db.query(`UPDATE users
                                            SET username = $1,
                                                email = $2,
                                                admin = $3,
                                                password = $4,
                                                updated_at = $5
                                            WHERE user_id = $6
                                            RETURNING *`, 
                                            [this.username, this.email, this.admin, this.password, this.updated_at, this.user_id]);


        if (response.rows[0]) {
            return new User(response.rows[0]);
        } else {
            throw new Error("Failed to update user");
        }
        
    }


    async destroy() {
        const response = await db.query("DELETE FROM users WHERE user_id = $1 RETURNING *;", [this.user_id]);
        return new User(response.rows[0]);
    }

};


module.exports = User;