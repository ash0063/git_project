const express = require("express")
console.log("INDEX FILE LOADED");
const app = express()
const port = 8081
const urlroutes = require("./controllers/route")
app.use(express.urlencoded({extended:true}));

console.log(urlroutes);
app.use('/profile', (req, res, next) => {
    console.log("PROFILE MIDDLEWARE HIT");
    next();
}, urlroutes);

app.listen( port, ()=>{
    console.log(`app is listening on port ${port}`)
})


