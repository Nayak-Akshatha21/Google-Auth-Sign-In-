const express= require("express");
const cors = require("cors");
const {OAuth2Client} = require("google-auth-library");
const jwt= require("jsonwebtoken");
require('dotenv').config();

const app=express();
app.use(cors());
app.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/auth/google", async(req,res)=>{
    const {token} = req.body;
    try{
        const ticket = await client.verifyIdToken({
            idToken:token,
            audience:process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const user ={
            name:payload.name,
            email:payload.email,
            picture:payload.picture
        };

        const appToken = jwt.sign(user, process.env.JWT_SECRET,{
            expiresIn:"7d",
        });
        res.json({
            success: true,
            user,
            token:appToken,
        })
    }
    catch(error){
        res.status(401).json({
            error:"Invalid Google token"
        });
    }

});

app.listen(5000,()=>{
    console.log("server is runnning on port 5000")
})