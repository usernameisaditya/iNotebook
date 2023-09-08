const express = require('express')
const router = express.Router();
const User = require('../models/User')
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'Thisisasecretkey';
// Create a User using : POST "/api/v1/auth/". Doesn't require auth
router.post('/createuser', [
    body('name', 'Please enter a valid name').isLength({ min: 3 }),
    body('email', 'Email address already exist!').isEmail(),
    body('password', 'Password must be atleast 5 characters long').isLength({ min: 5 })
]
    , async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            const salt = await bcrypt.genSalt(10)
            const secPass = await bcrypt.hash(req.body.password, salt)
            //create a new user
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET)
            res.send({ authToken })
        } catch (error) {
            res.status(500).send('Internal Server Error')
        }
    })

// Authenticate a user using : POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
]
    , async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body
        try {
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ error: "Please login with correct email" })
            }

            const comparePass = await bcrypt.compare(password, user.password)
            if (!comparePass) {
                return res.status(400).json({ error: "Please login with correct password" })
            }

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET)
            res.json({ authToken })
        } catch (error) {
            res.status(500).send('Internal Server')
        }
    })

const fetchuser = require('../middlewares/fetchuser');
//Route 3: Get loggedin user details using: POST 'api/auth/getuser'.Login required
router.post('/getuser',fetchuser, async (req, res) => {
    try {
        userId = userdata.id
        const user = await User.findById(userId).select('-password')
        res.send(user)
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
})

module.exports = router 
