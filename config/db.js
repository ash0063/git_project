require("dotenv").config();
const mysql = require("mysql2");


console.log("HOST:", process.env.MYSQLHOST);
console.log("PORT:", process.env.MYSQLPORT);
console.log("USER:", process.env.MYSQLUSER);
console.log("DB:", process.env.MYSQLDATABASE);


const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE
});

db.connect((err) => {
    if (err) {
        console.log("DB Error:", err);
    } else {
        console.log("DB Connected");
    }
});

module.exports = db;