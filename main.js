const express = require("express")
const path = require("node:path")
const { Pool } = require("pg")
const passport = require("passport")
const session = require("express-session")
const app = express()
require("dotenv").config()


app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))



const con=new Pool({
    connectionString:process.env.DATABASE
})

con.connect().then(()=>{
    console.log("Database Succesfully connected")
}).catch((error)=>{
    console.log(`Failed to Connect to Database. check: ${error}`)
})


app.use(session({
    secret:"cookie",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.session())


app.get("/",(req,res)=>{
    res.render("index")
})

app.get("/sign-up",(req,res)=>{
    res.render("sign-up")
})

app.post("/sign-up",async(req,res,next)=>{
const {username,password}=req.body
try{
console.log("inserting user...")
await con.query(`INSERT INTO users(username,password)VALUES($1,$2)`,[username,password])
console.log("inserted Succesfully")
res.redirect("/")
}catch(e){
return next(e)
}


})

passport.use(localhost(async(username,password,done)=>{
try{
const {rows}=await con.query(`SELECT * FROM users WHERE username=$1`,[username])
const user=rows[0]
if(!user){
    return done(null,false,{error:"Incorrect Username"})
}
if(user.password !== password){
    return done(null,false,{error:"Incorrect Password"})
}
return done(null,user)
}catch(error){
return done(error)
}

}))


const port=process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})  