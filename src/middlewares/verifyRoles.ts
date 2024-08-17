import {Request, Response, NextFunction} from "express";
import AppError from "../utils/AppError";
import {IVerifiedRequest} from "../utils/catchRequest";

const verifyRoles = (...allowedRoles: string[]) => {
    return (req: IVerifiedRequest, res:Response, next: NextFunction) => {

        if (!req.user || req.user._id)
            return next(new AppError("errors:authorization.UNAUTHORIZED", 401));

        if(!allowedRoles.includes(req.user.role.toLowerCase()))
            return next(new AppError(req.t("errors:authorization.NO_PERMISSION"),403));

        next();
    }
}

export default verifyRoles;

