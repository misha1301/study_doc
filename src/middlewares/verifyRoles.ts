import {Request, Response, NextFunction} from "express";
import AppError from "../utils/AppError";
import {IVerifiedRequest} from "../utils/catchRequest";

const verifyRoles = (...allowedRoles: string[]) => {
    return (req: Request | IVerifiedRequest, res:Response, next: NextFunction) => {

        if(!allowedRoles.includes((req as IVerifiedRequest).user.role.toLowerCase()))
            return next(new AppError(req.t("errors:authorization.NO_PERMISSION"),403));

        next();
    }
}

export default verifyRoles;