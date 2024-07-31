DROP TABLE IF EXISTS replies;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT FALSE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);

CREATE TABLE blog_posts (
    blog_id INT GENERATED ALWAYS AS IDENTITY,
    blog_title VARCHAR(150) NOT NULL,
    blog_content TEXT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blog_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE comments (
    comment_id INT GENERATED ALWAYS AS IDENTITY,
    comment TEXT NOT NULL,
    blog_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (blog_id) REFERENCES blog_posts(blog_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE replies (
    reply_id INT GENERATED ALWAYS AS IDENTITY,
    reply_message TEXT NOT NULL,
    previous_reply_id INT,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    blog_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (reply_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (blog_id) REFERENCES blog_posts(blog_id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE,
    FOREIGN KEY (previous_reply_id) REFERENCES replies(reply_id) ON DELETE CASCADE
);

-- -------------------------------------------------------------- SEEDING DATA! -------------------------------------------------------

-- users
INSERT INTO users (username, email, admin, password, created_at, updated_at) VALUES
('john_doe', 'john.doe@example.com', FALSE, 'hashed_password_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('jane_smith', 'jane.smith@example.com', FALSE, 'hashed_password_2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('admin_user', 'admin@example.com', TRUE, 'hashed_password_admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('alice_johnson', 'alice.johnson@example.com', FALSE, 'hashed_password_3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bob_brown', 'bob.brown@example.com', FALSE, 'hashed_password_4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- blog_posts
INSERT INTO blog_posts (blog_title, blog_content, user_id, created_at, updated_at) VALUES
('The Future of Technology', 'In this blog post, we explore the latest advancements in technology and their potential impact on our future.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Healthy Living Tips', 'Discover some practical tips for living a healthier lifestyle, from diet to exercise and mental wellness.', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Traveling on a Budget', 'Learn how to travel the world without breaking the bank with these money-saving tips and tricks.', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Art of Coding', 'A deep dive into the creative side of coding and how to cultivate a passion for programming.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gardening for Beginners', 'Everything you need to know to start your own garden, including tools, techniques, and tips for success.', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- comments
INSERT INTO comments (comment, blog_id, user_id, created_at, updated_at) VALUES
('Great post! Very informative.', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Interesting read, thanks for sharing!', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('I learned a lot from this article.', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Thanks for the tips, I will definitely try them out.', 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Very helpful advice!', 2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('I appreciate the practical tips.', 2, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('I’ve always wanted to travel more. This is really helpful!', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('This is exactly what I needed, thanks!', 3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Budget travel tips are the best!', 3, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Coding is indeed an art form. Nice article!', 4, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('I found this post very inspiring.', 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Great insights on coding.', 4, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('I love gardening, and these tips are great!', 5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('This is very useful for beginners.', 5, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Can’t wait to start my own garden!', 5, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- replies
INSERT INTO replies (reply_message, previous_reply_id, comment_id, user_id, blog_id, created_at, updated_at) VALUES
('I agree, the tips are fantastic!', NULL, 1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Very true, learned a lot.', NULL, 1, 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Great discussion here!', NULL, 1, 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('I’m glad you found it helpful!', NULL, 2, 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Happy to help!', NULL, 2, 4, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Thanks for the support!', NULL, 2, 5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Traveling is a lot of fun, isn’t it?', NULL, 3, 3, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Absolutely, can’t wait for my next trip.', NULL, 3, 4, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Travel is life!', NULL, 3, 5, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Absolutely! The creativity involved is amazing.', NULL, 4, 4, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Totally agree with you!', NULL, 4, 2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Coding is both art and science.', NULL, 4, 3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Thanks! Gardening has been a passion of mine for years.', NULL, 5, 5, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gardening is so rewarding!', NULL, 5, 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Love the tips shared here.', NULL, 5, 3, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('That’s a great addition to the article.', 1, 1, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Couldn’t agree more!', 1, 1, 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Excellent point!', 2, 2, 4, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Very well said!', 2, 2, 5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nicely put!', 3, 3, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Totally on point!', 3, 3, 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
