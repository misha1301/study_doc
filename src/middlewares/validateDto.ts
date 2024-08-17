import * as yup from 'yup';
import catchRequest from "../utils/catchRequest";

export const validateDto = (schema: yup.ObjectSchema<any>) =>
    catchRequest(async (req, res, next) => {

        req.body = await schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        next();
    });