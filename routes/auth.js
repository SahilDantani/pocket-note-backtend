const express =require("express");
const User = require("../modules/User");
const router = express.Router();
const {body,validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser")

const JWT_SECRET = process.env.JWT_SECRETS;

router.post("/createuser",[
    body("name","Enter a valid name").isLength({min:3}),
    body("email","Enter valid Email").isEmail(),
    body("password","Enter Valid Password").isLength({min:5})
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    try{
        
    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({error:"user with this email already exist"});
    }

    const salt = await bcrypt.genSalt(10);
    const setPass = await bcrypt.hash(req.body.password,salt)
    user = await User.create({
        name:req.body.name,
        password:setPass,
        email:req.body.email
    })

    const data = {
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,JWT_SECRET);
    res.json({token})
}catch(error){
    console.error(error.message);
    res.status(500).send("Internal server Error")
}

})

// for Login

router.post("/login",[
    body("email","Enter valid Email").isEmail(),
    body("password","Password can't be blank").exists()
],async (req,res)=>{
    let success = false
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            success = false;
            return res.status(400).json({error:"Please try to login with correct Credentials"});

            
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            success = false;
            return res.status(400).json({success,error:"Please try to login with correct Credentials"});
            
        }
        const data = {
            user:{
                id:user.id
            }
        }
        const token = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,token})
    } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error")

    }
})

// get Logged User detail

router.post("/getuser",fetchuser,async (req,res)=>{
try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error")
}
})
module.exports = router;