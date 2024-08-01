const db = require("../db/connect");
const Reply = require("./Reply");

class Comment {
    constructor(comment) {
        this.comment_id = comment.comment_id;
        this.comment = comment.comment;
        this.blog_id = comment.blog_id;
        this.user_id = comment.user_id;
        this.created_at = comment.created_at;
        this.updated_at = comment.updated_at;
        if (comment.replies) {
            this.replies = comment.replies.map(reply => new Reply(reply))
        }
    }

    static async getAll() {
        const comments = await db.query("SELECT * FROM comments");
        if (comments.rows.length === 0) {
            throw new Error("No comments available");
        }
        return comments.rows.map(c => new Comment(c));
    }


    static async show(id) {
        const response = await db.query("SELECT * FROM comments WHERE comment_id = $1", [id]);
        if (response.rows.length !== 1) {
            throw new Error("No comment found");
        }
        return new Comment(response.rows[0]);
    }


    static async showCommentAssociateReplies(id) {
        const response = await db.query(`SELECT
                                            c.comment_id,
                                            c.comment,
                                            c.blog_id AS c_blog_id,
                                            c.user_id AS c_user_id,
                                            c.created_at AS c_created_at,
                                            c.updated_at AS c_updated_at,
                                            r.reply_id,
                                            r.reply_message,
                                            r.previous_reply_id,
                                            r.comment_id AS r_comment_id,
                                            r.user_id AS r_user_id,
                                            r.blog_id AS r_blog_id,
                                            r.created_at AS r_created_at,
                                            r.updated_at AS r_updated_at
                                        FROM
                                            comments AS c
                                        LEFT JOIN
                                            replies AS r 
                                        ON c.comment_id = r.comment_id
                                        WHERE
                                            c.comment_id = $1;`, [id]);
        
        const r = response.rows;

        if (r.length === 0) {
            throw new Error("No comment found");
        }



        const comment = { 
            comment_id: r[0].comment_id, 
            comment: r[0].comment, 
            blog_id: r[0].c_blog_id, 
            user_id: r[0].c_user_id, 
            created_at: r[0].c_created_at.toISOString(), 
            updated_at: r[0].c_updated_at.toISOString(),
            replies: []
        };

        r.forEach(row => {
            if (row.comment_id) {
                comment.replies.push({
                    reply_id: row.reply_id,
                    reply_message: row.reply_message,
                    previous_reply_id: row.previous_reply_id,
                    comment_id: row.r_comment_id,
                    user_id: row.r_user_id,
                    blog_id: row.r_blog_id,
                    created_at: row.r_created_at.toISOString(),
                    updated_at: row.r_updated_at.toISOString()
                });
            }
        });

        return new Comment(comment);

    }


    static async create(data) {
        const { comment, blog_id, user_id } = data;
        if (!comment || !blog_id || !user_id ) {
            throw new Error("One of the required fields missing.");
        }

        const response = await db.query(`INSERT INTO comments (comment, blog_id, user_id) 
            VALUES ($1, $2, $3) RETURNING *`, [comment, blog_id, user_id]);
        return new Comment(response.rows[0]);
    }


    async update(data) {
        for (const key of Object.keys(this)) {
            if (key === "comment") {
                this[key] = data[key];
            }
        }

        this.updated_at = new Date();

        const response = await db.query(`UPDATE comments
                                            SET comment = $1,
                                            updated_at = $2
                                            WHERE comment_id = $3
                                            RETURNING *`, 
                                            [this.comment, this.updated_at, this.comment_id]);


        if (response.rows[0]) {
            return new Comment(response.rows[0]);
        } else {
            throw new Error("Failed to update the comment");
        }
        
    }


    async destroy() {
        const response = await db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [this.comment_id]);
        return new Comment(response.rows[0]);
    }

};


module.exports = Comment;