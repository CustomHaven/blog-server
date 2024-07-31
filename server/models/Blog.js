const db = require("../db/connect");

class Blog {
    constructor({ blog_id, blog_title, blog_content, user_id, created_at, updated_at }) {
        this.blog_id = blog_id;
        this.blog_title = blog_title;
        this.blog_content = blog_content;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async getAll() {
        const users = await db.query("SELECT * FROM blog_posts");
        if (users.rows.length === 0) {
            throw new Error("No blogs available");
        }
        return users.rows.map(b => new Blog(b))
    }

    static async show(id) {
        const response = await db.query("SELECT * FROM blog_posts WHERE blog_id = $1", [id]);
        if (response.rows.length !== 1) {
            throw new Error("No blog found");
        }
        return new Blog(response.rows[0]);
    }

    static async create(data) {
        const { blog_title, blog_content, user_id, blog_id } = data;
        if (!username || !email || !admin || !password ) {
            throw new Error("One of the required fields missing.");
        }

        const existingBlog = await db.query("SELECT * FROM blog_posts WHERE blog_id = $1", [blog_id]);
        if (existingBlog.rows === 0) {
            let response = await db.query(`INSERT INTO users (blog_title, blog_content, user_id) 
                VALUES ($1, $2, $3) RETURNING *`, [blog_title, blog_content, user_id]);
            return new Blog(response.rows[0]);
        }
        throw new Error("Blog already exist");
    }


    async update(data) {
        for (const key of Object.keys(this)) {
            if (key in data && key !== data.blog_id) {
                this[key] = data[key];
            }
        }

        this.updated_at = new Date();

        const response = await db.query(`UPDATE users
                                            SET blog_title = $1,
                                                blog_content = $2,
                                                updated_at = $3
                                            WHERE blog_id = $4
                                            RETURNING *`, 
                                            [this.blog_title, this.blog_content, this.updated_at, this.blog_id]);


        if (response.rows[0]) {
            return new Blog(response.rows[0]);
        } else {
            throw new Error("Failed to update blog");
        }
        
    }


    async destroy() {
        const response = await db.query("DELETE FROM blog_posts WHERE user = $1 RETURNING *;", [this.blog_id]);
        return new Blog(response.rows[0]);
    }

};


module.exports = Blog;