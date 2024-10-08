const { Pool } = require("pg");


const option = process.env.NODE_ENV === "test" ? {
    connectionString: process.env.DB_TEST_URL } : {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432
};

const db = new Pool(option);


module.exports = db;