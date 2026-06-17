require("dotenv").config();
const mysql = require("mysql2");


console.log(process.env.MYSQL_URL);
const db = mysql.createConnection( process.env.MYSQL_URL);

db.connect((err) => {
    if (err) {
        console.log("DB Error:", err);
    } else {
        console.log("DB Connected");
    }
});

module.exports = db;