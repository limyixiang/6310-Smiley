const User = require("../models/userModel");
const {check, validationResult} = require("express-validator");
var jwtToken = require('jsonwebtoken');
var { expressjwt: jwt } = require("express-jwt");
const nodemailer = require('nodemailer');

//SIGNUP
exports.signup = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
        })
    }

    const user = new User(req.body);
    user.save()
    .then(user => {
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
        });
    })
    .catch(err => {
        let errorMessage = 'Something went wrong.';
        if (err.code === 11000) {
            errorMessage = 'User already exists, please sign in.'; 
        }
        return res.status(500).json({ error: errorMessage });
    });
}


//SIGNIN
exports.signin = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
        })
    }

    const {email, password} = req.body;
    await User.findOne({email: `${email}`})
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    error: "User not found."
                })
            }

            if (!user.authenticate(password)){
                return res.status(401).json({
                    error: "Email or Password does not exist."
                })
            }

            //Setting Cookies
            const token = jwtToken.sign({ _id: user._id }, 'shhhhh');
            res.cookie("token", token, {expire: new Date() + 9999})
            const {_id, name, email} = user
            return res.json({token, user: {_id, name, email}});
        })

}

//FORGET PASSWORD
exports.forgetPassword = async (req, res) => {
    try {
        //Find user by email
        const user = await User.findOne({ email: req.body.email });
        
        //If user is not found
        if (!user) {
            return res.status(404).json({ error: "User with this email does not exist." });
        }

        //Generate a unique JWT token for the user that contains the user's id
        const token = jwtToken.sign({ _id: user._id }, 'shhhhh', { expiresIn: '10m' });

        //Send the token to the user's email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        //Email configurations
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Reset Password Link',
            html: `<h1>Reset Password</h1>
                <h2>Please click on the link below to reset your password:</h2>
                <a href='${process.env.CLIENT_URL}/resetpassword/${token}'>${process.env.CLIENT_URL}/resetpassword/${token}</a>
                <p>This link is valid for 10 minutes.</p>
            `
        };

        //Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            } else {
                return res.status(200).json({ message: 'Email has been sent to the user.' });
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//RESET PASSWORD
exports.resetPassword = async (req, res) => {
    try {
        //Verify the token
        let decoded_token;
        try {
            decoded_token = jwtToken.verify(req.params.token, 'shhhhh');
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Session expired. Generate a new link and try again.' });
            } else {
                // Token is invalid
                return res.status(401).json({ error: 'Session is invalid. Check the link in your email and try again.' });
            }
        }

        //Find the user by the decoded id
        const user = await User.findById(decoded_token._id);
        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        //Update the user's password
        user.encrypted_password = user.securedPassword(req.body.password);
        await user.save();

        //Send success message
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//SIGNOUT
exports.signout = async (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "User has signed out."
    });
}

//Protected Route 
exports.isSignedIn = jwt({
    secret: 'shhhhh',
    userProperty: "auth",
    algorithms: ['HS256']
})

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    } 
    next();
}