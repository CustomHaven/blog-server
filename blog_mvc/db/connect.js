const { Pool } = require("pg");

console.log("from docker", process.env.DOCKER_SECRET);
console.log("NODE_ENV CHECK", process.env.NODE_ENV);

const option = process.env.NODE_ENV === "test" ? {
    connectionString: process.env.DB_TEST_URL } : {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432
};

const db = new Pool(option);
console.log("DB connection established.");

module.exports = db;