import {Response, NextFunction} from "express";
import AppError from "../utils/AppError";
import {IVerifiedRequest} from "../utils/catchRequest";
import {authorizationErrorMessages} from "../utils/errorMessages";


const verifyRoles = (allowedRoles: [string]) => {
    return (req:IVerifiedRequest, res:Response, next: NextFunction) => {

        if(!allowedRoles.includes(req.user.role))
            return next(new AppError(authorizationErrorMessages.en.NO_PERMISSION,403));

        next();
    }
}

module.exports = verifyRoles;