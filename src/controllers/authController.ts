import User, {IUserDocument} from "./../models/User";
import catchRequest, {IVerifiedRequest} from "../utils/catchRequest";
import {Response} from "express";
import AppError from "../utils/AppError";
import responseFactory from "../utils/responseFactory";
import {signAccessToken, signRefreshToken, verifyToken} from "../utils/JWTHandler"

type TCookieOptions = {
    expires: Date,
    httpOnly: boolean,
    secure?: boolean
}

const cookieOptions: TCookieOptions = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true
}

const createSendAccessToken = async (user: IUserDocument, statusCode: number, res: Response) => {9

    const accessToken = await signAccessToken({id: user._id as string});
    return responseFactory.sendSuccess(res, statusCode, {data: user, accessToken: accessToken});
}

const createSendTokens = async (user: IUserDocument, statusCode: number, res: Response) => {

    const accessToken = await signAccessToken({id: user._id as string});
    const refreshToken = await signRefreshToken({id: user._id as string});

    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;

    res.cookie('jwt', refreshToken, cookieOptions)

    return responseFactory.sendSuccess(res, statusCode, {data: user, accessToken: accessToken});
}

export const signup = catchRequest(
    async (req, res, next) => {

        const newUser = await User.create({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });

        await createSendTokens(newUser, 201, res);
    });

export const login = catchRequest(
    async (req, res, next) => {

        const user = await User
            .findOne({$or: [{email: req.body.email}, {username: req.body.username}]})
            .select('+password');

        if (!user || !(await user.comparePassword(req.body.password, user.password))) {
            return next(new AppError('errors:authentication.AUTH_DONT_MATCH', 401))
        }

        await createSendTokens(user, 200, res);
    });

//need mailer implementation
export const forgotPassword = catchRequest(
    async (req, res, next) => {
        if (!req.body.email)
            return next(new AppError("Please provide email to reset your password!", 400));

        const user = await User.findOne({email: req.body.email})

        if (!user)
            return next(new AppError(req.t("errors:authentication.USER_NO_EXIST", {identifier: "email"}), 401));

        const resetToken = user.createPasswordResetToken();

        await user.save({validateBeforeSave: false});

        responseFactory.sendSuccess(res, 200, {data: ""});
    });

export const changePassword = catchRequest(
    async (req, res, next) => {

        if (!req.user || req.user._id)
            return next(new AppError("errors:authorization.UNAUTHORIZED", 401));

        const user = await User.findById(req.user._id).select('+password');

        if (!user)
            return next(new AppError(req.t("errors:authentication.USER_NO_EXIST", {identifier: "email"}), 401));

        if (!(await user.comparePassword(req.body.password, user.password)))
            return next(new AppError("errors:authentication.PASSWORD_NOT_SAME", 401));

        user.password = req.body.newPassword;

        await user.save();

        await createSendAccessToken(user, 200, res);
    });

export const refreshToken = catchRequest(
    async (req, res, next) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken)
            return next(new AppError("e", 500));

        const decodedJWT = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);

        const user = await User.findById(decodedJWT.id);

        if (!user)
            return next(new AppError(req.t("errors:authentication.USER_NO_EXIST", {identifier: "token`s id"}), 401));

        if (user.isPasswordChangedAfterJWT(decodedJWT.iat as number))
            return next(new AppError(req.t("errors:authentication.PASSWORD_WAS_CHANGED"), 401));

        if (!user.compareRefreshToken(refreshToken, user.refreshToken))
            return next(new AppError('errors:authentication.BAD_JWT', 401));

        await createSendAccessToken(user, 200, res);
    });

