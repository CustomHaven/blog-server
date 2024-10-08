require("dotenv").config();
const fs = require("fs");
const path = require("path");

const db = require("./connect");

const pathJoin = path.join(__dirname + "../../blog_db/seed.sql");
const sql = fs.readFileSync(pathJoin).toString();


db.query(sql)
    .then(() => {
        db.end();
        console.log("Set-up complete");
    })
    .catch(err => console.log(err));