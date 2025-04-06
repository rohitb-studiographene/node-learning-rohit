import {validationResult} from "express-validator";

export const validateSchema = (schema) => {
    return (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
}

export default validateSchema;