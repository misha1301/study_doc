import catchRequest, {IVerifiedRequest} from "../utils/catchRequest";
import jwt from 'jsonwebtoken';
import AppError from "../utils/AppError";

import User from "../models/User";

import {verifyToken} from "../utils/JWTHandler";


const verifyJWT = catchRequest(
    async (req, res, next) => {

        const authHeader = req.header('Authorization') || req.header('authorization');

        if (!authHeader?.startsWith('Bearer'))
            return next(new AppError("JWT token are missed!", 401));

        const token = authHeader?.split(' ')[1];

        if (!token)
            return next(new AppError("You are unauthorized!", 401));

        const decodedJWT = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string);

        const currentUser = await User.findById(decodedJWT.id)

        if (!currentUser)
            return next(new AppError("User does not exist!", 401));

        if(currentUser.isPasswordChangedAfterJWT(decodedJWT.iat as number))
            return next(new AppError("Token are not valid, due to password was changed", 401));

        (req as IVerifiedRequest).user = currentUser;

        next();
    }
)

export default verifyJWT;
