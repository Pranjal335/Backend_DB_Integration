const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../redisClient");

exports.signup = async (req,res) =>{
    const {name, email, password} = req.body;

    try{
        const exist = await User.findOne({email});
        if(exist) res.status(409).json({message: "User already exist"});

        const hash = await bcrypt.hash(password, 10);
        const user = new User({name, email, password: hash});
        await user.save();

        res.status(201).json({message:"User registered successfully"});
    }catch(err){
        console.error("Signup Error:", err);
        res.status(500).json({message: "Server error"});
    }
};

exports.login = async (req, res) =>{
    const {email, password}= req.body;

    try{
        const user = await User.findOne({email});
        if(!user) return res.status(401).json({message: "Invalid Credentials"})

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(401).json({message: "Invalid Credentials"})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // ✅ Store token manually in Redis with expiry
        await redisClient.set(`auth:token:${user._id}`, token, {
            EX: 60 * 60, // 1 hour
          });
        // ✅ Store user info in session (this gets stored in Redis via express-session + connect-redis)
 
        //   req.session.user = {
        //     id: user._id,
        //     email: user.email,
        // };


        res.json({ message: "Login successful", token });
    }catch(err){
        res.status(500).json({message: "Server error"});
    }
};

