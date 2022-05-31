const { check } = require('express-validator');
const { validateResult } = require('../lib/validateHelper');

const validateCreate = [
    check('titulo','El titulo no debe ser vacio')
        .isEmail(),
    check('cuerpo')
        .not()
        .isEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];

module.exports = {
    validateCreate
};

