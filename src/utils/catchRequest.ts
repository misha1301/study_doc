import {NextFunction, Request, Response} from "express";
import User from "../models/User";

export interface IVerifiedRequest extends Request{
    user: typeof User;
}

type requestFunctionType = (req: Request | IVerifiedRequest, res: Response, next: NextFunction) => Promise<void>;

const catchRequest = (requestFunction: requestFunctionType) => {
    return (req: Request | IVerifiedRequest, res: Response, next: NextFunction) => {
        requestFunction(req, res, next)
            .catch(next);
    }
}

export default catchRequest;