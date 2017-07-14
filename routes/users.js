const express = require('express')
const router = express.Router()
const validator = require("email-validator");
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
    return re.test(email)
};



const Users = mongoose.model('users', {
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    }
})


router.post('/api/users/login', function(req, res) {

    let {
        email,
        password
    } = req.body;

    if ((email && password) === undefined) {
        res.status(400).send('some credintails not exists')
    } else {
        Users.findOne({
            email: email
        }, (err, result) => {
            if (err) throw err;


            bcrypt.compare(password, result.password, function(err, result) {
                	
                	if (result) {
                		jwt.sign({email: email}, 'this is my secret, so keep it as it is', (err, token)=>{
                			res.status(200).send({
                				token: token,
                				errorCode:3232,
                				msg:'logged in successfuly'

                			})
                		})
                	} else {
                		res.status(200).send({
                			errorCode:32342,
                			msg:'incorrect password and email'
                		})
                	}


            });



        })
    }

})

router.post('/api/users/signup', function(req, res) {

    let email = req.body.email
    let username = req.body.username
    let password = req.body.password

    if ((email && username && password) === undefined) {
        res.status(400).send({
            message: 'some credentials not exists'
        })
    } else {


        // TODO: ADD MORE VALIDATION TO USERNSME AND PASSWORD
        if (validator.validate(email) === true) {

            Users.findOne({
                email: email
            }, function(err, result) {
                if (err) throw err;
                if (result) {
                    res.status(200).send({
                        result: result,
                        errorCode: 0,
                        msg: 'user does exist'
                    })
                } else {


                    bcrypt.hash(password, 10, function(err, hash) {
                        if (err) throw err;


                        let user = new Users({
                            username: username,
                            password: hash,
                            email: email
                        })

                        user.save(function(err, result) {
                            if (err) {
                                console.log(err)
                                res.send(err)
                            };
                            if (result) {
                                res.send({
                                    msg: 'new user has been created',
                                    errorCode: 1
                                })
                            }
                        })


                    });





                }

            })


        } else {
            res.send('something bad happend')
        }






    }


    // res.status(200).send('\n a new user created \n')
})


module.exports = router;