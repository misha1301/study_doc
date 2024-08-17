import catchRequest, {IVerifiedRequest} from "../utils/catchRequest";
import jwt from 'jsonwebtoken';
import AppError from "../utils/AppError";
import User from "../models/User";
import {verifyToken} from "../utils/JWTHandler";


const verifyJWT = catchRequest(
    async (req, res, next) => {

        const authHeader = req.header('Authorization') || req.header('authorization');

        if (!authHeader || !authHeader?.startsWith('Bearer'))
            return next(new AppError(req.t("errors:authentication.MISSED_JWT"), 401));

        const token = authHeader?.split(' ')[1];

        if (!token || token === "null")//null is string cuz postman sends null like a string
            return next(new AppError(req.t("errors:authorization.UNAUTHORIZED"), 401));

        const decodedJWT = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string);

        const currentUser = await User.findById(decodedJWT.id)

        if (!currentUser)
            return next(new AppError(req.t("errors:authentication.USER_NO_EXIST", {identifier: "access token"}), 401));

        if(currentUser.isPasswordChangedAfterJWT(decodedJWT.iat as number))
            return next(new AppError(req.t("errors:authentication.PASSWORD_WAS_CHANGED"), 401));

        req.user = currentUser;

        next();
    }
)

export default verifyJWT;
