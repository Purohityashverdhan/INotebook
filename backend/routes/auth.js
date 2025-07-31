const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser')


const jwtSecret = "Yashis$boy"

//Route1: Create a user using: POST "/api/auth/createuser". no login is required
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    let success=false;

    const errors = validationResult(req);
    //if there are error return bad request and the error
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success,error: "Sorry this email is already exists" })
        }

        //Step for securing the password using bcryptjs
        const salt = await bcrypt.genSaltSync(10); //it will retrun a promise so we have to wait
        const secPass = await bcrypt.hashSync(req.body.password, salt)
        //creating a new user here 
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, jwtSecret)
        success=true;
        res.json({ success,authtoken })
    } catch (error) {
        console.log(error)
        res.status(500).send("Some error occured")
    }
})

//Route2:Aunthticate a user using POST:"/api/auth/login".No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', "This field cannot be blank").exists(),
], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    //if there are error return bad request and the error
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success=false;
            return res.status(400).json({ error: "This is not valid" })
        }
        const comparepass =await bcrypt.compare(password, user.password)
        if (!comparepass) {
            success=false;
            return res.status(400).json({ error: "This is not valid" })
        }
        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, jwtSecret)
        success=true;
        res.json({ success,authtoken })
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }
})

//Route3:For the login of the user to get the their notes on /api/auth/getuser.Login Required   
router.post('/getuser',fetchuser,async (req,res)=>{
try {
    userId=req.user.id;
    const user=await User.findById(userId).select("-password")
    res.send(user);
} catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error")
}
})

module.exports = router