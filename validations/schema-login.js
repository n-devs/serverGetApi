var joi = require('joi');

module.exports = {
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
};