const db = require("../db/connect");

class Reply {
    constructor(reply) {
        this.reply_id = reply.reply_id;
        this.reply_message = reply.reply_message;
        this.previous_reply_id = reply.previous_reply_id;
        this.comment_id = reply.comment_id;
        this.user_id = reply.user_id;
        this.blog_id = reply.blog_id;
        this.created_at = reply.created_at;
        this.updated_at = reply.updated_at;
        if (reply.replies) {
            this.replies = reply.replies.map(reply => new Reply(reply))
        }
    }


    static async showReplyAssociateReplies(id) {
        const response = await db.query(`SELECT
                                            r1.reply_id AS r1_reply_id,
                                            r1.reply_message AS r1_reply_message,
                                            r1.previous_reply_id AS r1_previous_reply_id,
                                            r1.comment_id AS r1_comment_id,
                                            r1.user_id AS r1_user_id,
                                            r1.blog_id AS r1_blog_id,
                                            r1.created_at AS r1_created_at,
                                            r1.updated_at AS r1_updated_at,
                                            r2.reply_id AS r2_reply_id,
                                            r2.reply_message AS r2_reply_message,
                                            r2.previous_reply_id AS r2_previous_reply_id,
                                            r2.comment_id AS r2_comment_id,
                                            r2.user_id AS r2_user_id,
                                            r2.blog_id AS r2_blog_id,
                                            r2.created_at AS r2_created_at,
                                            r2.updated_at AS r2_updated_at
                                        FROM
                                            replies AS r1
                                        LEFT JOIN
                                            replies AS r2 
                                        ON r1.reply_id = r2.previous_reply_id
                                        WHERE
                                            r1.reply_id = 1;`, [id]);
        
        const r = response.rows;

        if (r.length === 0) {
            throw new Error("No reply found");
        }



        const reply = { 
            reply_id: r[0].r1_reply_id,       
            reply_message: r[0].r1_reply_message,
            previous_reply_id: r[0].r1_previous_reply_id,
            comment_id: r[0].r1_comment_id,
            user_id: r[0].r1_user_id,
            blog_id: r[0].r1_blog_id,
            created_at: r[0].r1_created_at,
            updated_at: r[0].r1_updated_at,
            replies: []
        };

        r.forEach(row => {
            if (row.r2_reply_id) {
                reply.replies.push({
                    reply_id: row.r2_reply_id,
                    reply_message: row.r2_reply_message,
                    previous_reply_id: row.r2_previous_reply_id,
                    comment_id: row.r2_comment_id,
                    user_id: row.r2_user_id,
                    blog_id: row.r2_blog_id,
                    created_at: row.r2_created_at,
                    updated_at: row.r2_updated_at
                });
            }
        });

        return new Reply(reply);

    }


    static async getAll() {
        const comments = await db.query("SELECT * FROM replies");
        if (comments.rows.length === 0) {
            throw new Error("No replies available");
        }
        return comments.rows.map(c => new Reply(c));
    }


    static async show(id) {
        const response = await db.query("SELECT * FROM replies WHERE reply_id = $1", [id]);
        if (response.rows.length !== 1) {
            throw new Error("No reply found");
        }
        return new Reply(response.rows[0]);
    }





    static async create(data) {
        const { reply_message, comment_id, user_id, blog_id } = data;
        if (!reply_message || !comment_id || !user_id || !blog_id ) {
            throw new Error("One of the required fields missing.");
        }

        const response = await db.query(`INSERT INTO replies (reply_message, comment_id, user_id, blog_id) 
            VALUES ($1, $2, $3, $4) RETURNING *`, [reply_message, comment_id, user_id, blog_id]);
        return new Reply(response.rows[0]);
    }


    async update(data) {
        for (const key of Object.keys(this)) {
            if (key === "reply_message" && "reply_message" in data) {
                this[key] = data[key];
            }
        }

        this.updated_at = new Date().toISOString();

        const response = await db.query(`UPDATE replies
                                            SET reply_message = $1,
                                            updated_at = $2
                                            WHERE reply_id = $3
                                            RETURNING *`, 
                                            [this.reply_message, this.updated_at, this.reply_id]);


        if (response.rows[0]) {
            return new Reply(response.rows[0]);
        } else {
            throw new Error("Failed to update the reply");
        }
        
    }


    async destroy() {
        const response = await db.query("DELETE FROM replies WHERE reply_id = $1 RETURNING *;", [this.reply_id]);
        return new Reply(response.rows[0]);
    }
}



module.exports = Reply;