import {NextFunction, Request, Response} from "express";
import {IUserDocument} from "../models/User";

export interface IVerifiedRequest extends Request{
    user?: IUserDocument;
}

// export type CustomRequest = Request & {  user?: IUserDocument;}

type requestFunctionType = (req: IVerifiedRequest, res: Response, next: NextFunction) => Promise<void>;

const catchRequest = (requestFunction: requestFunctionType) => {
    return (req: IVerifiedRequest, res: Response, next: NextFunction) => {
        requestFunction(req, res, next)
            .catch(next);
    }
}

export default catchRequest;