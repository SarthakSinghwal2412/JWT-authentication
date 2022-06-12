const express = require("express");
const app = express();
const jwt = require("jsonwebtoken")
app.use(express.json())
const users = [
    {
      id: "1",
      username: "john",
      password: "John0908",
      isAdmin: true,
    },
    {
      id: "2",
      username: "jane",
      password: "Jane0908",
      isAdmin: false,
    },
];


app.post("/api/login",(req,res)=>{
    const {username,password} = req.body;
    const user = users.find(u=>{
        return u.username === username && u.password === password
    })
    if(user){
        // generate an access token
        const accessToken = jwt.sign({id:user.id,isAdmin:user.isAdmin},"mySecretKey",{expiresIn:"20s"});
        res.json({
            username:user.username,
            password:user.password,
            accessToken,
        })
    }
    else{
        res.status(400).json("Username or password incorrect")
    }
})
app.post("/api/refresh",(req,res)=>{
    // take the refresh token from user

    // send the error if there is no token or the token is invalid

    // if everything is fine , create new access token, refersh token and sendn  it to the user 
})

const verify =  (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1];

        jwt.verify(token,"mySecretKey",(err,user)=>{//token is validated using verify function
            if(err){
                return res.status(403).json("Token is not valid !")
            }
            req.user = user;
            next();
        });

    }
    else{
        res.status(401).json("not authenticated")
    }
};

app.delete("/api/users/:userId",verify,(req,res)=>{
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("user has been deleted");
    }
    else{
        res.status(403).json("You are not allowed to delete this account")
    }
})



app.listen(5000, () => console.log("Backend server is running!"));