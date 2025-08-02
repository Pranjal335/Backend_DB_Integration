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

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
        res.json({ message: "Login successful", token });
    }catch(err){
        res.status(500).json({message: "Server error"});
    }
};

exports.logout = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }
  
      const token = authHeader.split(" ")[1];
  
      // Decode to get expiry time
      const decoded = jwt.decode(token);
  
      if (!decoded || !decoded.exp) {
        return res.status(400).json({ message: "Invalid token" });
      }
  
      const expiry = decoded.exp - Math.floor(Date.now() / 1000); // time in seconds until expiration
  
      // Blacklist token in Redis
      await redisClient.set(`bl_${token}`, token, 'EX', expiry);
  
      res.json({ message: "Logged out successfully" });
    } catch (err) {
      console.error("Logout Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  