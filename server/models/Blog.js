const db = require("../db/connect");
const Comment = require("./Comment");

class Blog {
    constructor(blog) {
        console.log("REACGED")
        this.blog_id = blog.blog_id;
        this.blog_title = blog.blog_title;
        this.blog_content = blog.blog_content;
        this.user_id = blog.user_id;
        this.created_at = blog.created_at;
        this.updated_at = blog.updated_at;
        if (blog.comments) {
            this.comments = blog.comments.map(comment => new Comment(comment))
        }
    }

    static async showBlogAssociateComments(id) {
        const response = await db.query(`SELECT 
                        bp.blog_id AS bp_blog,
                        bp.blog_title,
                        bp.blog_content,
                        bp.user_id AS bp_user,
                        bp.created_at AS bp_created_at,
                        bp.updated_at AS bp_updated_at,
                        c.comment_id,
                        c.comment,
                        c.blog_id AS c_blog_id,
                        c.user_id AS c_user_id,
                        c.created_at AS c_created_at,
                        c.updated_at AS c_updated_at 
                    FROM blog_posts AS bp
                    LEFT JOIN comments AS c
                    ON bp.blog_id = c.blog_id
                    WHERE bp.blog_id = $1`, [id]);
        
        const r = response.rows;

        if (r.length === 0) {
            throw new Error("Blog post not found");
        }



        const blogPost = { 
            blog_id: r[0].bp_blog, 
            blog_title: r[0].blog_title, 
            blog_content: r[0].blog_content, 
            user_id: r[0].bp_user, 
            created_at: r[0].bp_created_at.toISOString(), 
            updated_at: r[0].bp_updated_at.toISOString(),
            comments: []
        };

        r.forEach(row => {
            if (row.comment_id) {
                blogPost.comments.push({
                    comment_id: row.comment_id,
                    comment: row.comment,
                    blog_id: row.c_blog_id,
                    user_id: row.c_user_id,
                    created_at: row.c_created_at.toISOString(),
                    updated_at: row.c_updated_at.toISOString()
                });
            }
        });

        return new Blog(blogPost);

    }

    static async getAll() {
        const users = await db.query("SELECT * FROM blog_posts");
        if (users.rows.length === 0) {
            throw new Error("No blogs available");
        }
        return users.rows.map(b => new Blog(b))
    }

    static async showAllById(id) {
        const response = await db.query("SELECT * FROM blog_posts")
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
            const response = await db.query(`INSERT INTO users (blog_title, blog_content, user_id) 
                VALUES ($1, $2, $3) RETURNING *`, [blog_title, blog_content, user_id]);
            return new Blog(response.rows[0]);
        }
        throw new Error("Blog already exist");
    }


    async update(data) {
        for (const key of Object.keys(this)) {
            if (key in data && key !== "blog_id") {
                this[key] = data[key];
            }
        }

        this.updated_at = new Date();

        const response = await db.query(`UPDATE blog_posts
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
        const response = await db.query("DELETE FROM blog_posts WHERE blog_id = $1 RETURNING *;", [this.blog_id]);
        return new Blog(response.rows[0]);
    }

};


module.exports = Blog;



