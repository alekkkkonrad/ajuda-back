const {body} = require("express-validator")

const pedidoInsertValidation = () => {
    return[
        body("titulo")
        .not()
        .equals("undefined")
        .withMessage("O títutlo é obrigatório")
        .isString()
        .withMessage("O título é obrigatório")
        .isLength({min: 3})
        .withMessage("o título precisa de mais de 3 caracteres"),
    ]
}

const pedidoUpdateValidation = () => {
    return [
        body("titulo")
        .optional()
        .isString()
        .withMessage("O título é obrigatório")
        .isLength({min: 3})
        .withMessage("o título precisa de mais de 3 caracteres"),
    ]
}
module.exports = {
    pedidoInsertValidation,
    pedidoUpdateValidation,
}