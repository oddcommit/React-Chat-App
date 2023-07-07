const express = require("express");
const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const keys = require("../../config/keys");
// const passport = require("passport");

const Message = require('../../models/Messages');

router.get('/', (req, res) => res.json({ msg: "Messages works!"}));

router.get('/history', (req, res) => {
    Message.find({room: req.body.room}).limit(30)
        .then(messages => {
            if(messages) res.json(messages);
        })
        .catch(err => res.status(404).json())
})

module.exports = router;