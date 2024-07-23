import {NextFunction, Request, Response} from "express";

type requestFunctionType = (req: Request, res: Response, next?: NextFunction) => Promise<void>;
const catchRequest = (requestFunction: requestFunctionType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        requestFunction(req, res, next)
            .catch(next);
    }
}

export default catchRequest;