import User, {IUserDocument} from "./../models/User";
import catchRequest, {IVerifiedRequest} from "../utils/catchRequest";
import {Response} from "express";
import AppError from "../utils/AppError";
import {signAccessToken, verifyToken} from "../utils/JWTHandler"


import AppValidator from "../utils/Validator";


type TCookieOptions = {
    expires: Date,
    httpOnly: boolean,
    secure?: boolean
}

// jwt.sign(
//     {id: userID},
//     secretKey,
//     {expiresIn: process.env.JWT_EXPIRES_IN}
// );

const createSendToken = async (user: IUserDocument, statusCode: number, res: Response) => {

    const accessToken = await signAccessToken({id: user._id as string});

    const cookieOptions: TCookieOptions  = {
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === "production")
        cookieOptions.secure = true;

    res.cookie('jwt', accessToken, cookieOptions)

    user.password = '';

    return res.status(statusCode).json({
        status: "success",
        data: user,
        token: accessToken
    });
}


export const signup = catchRequest(
    async (req, res, next) => {

        const newUser = await User.create({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });

        await createSendToken(newUser, 201, res);
    });

export const login = catchRequest(
    async (req, res, next) => {
        const {email, password} = req.body;

        if (!email || !password) {
            return next(new AppError(req.t('errors:authentication.BAD_JWT'), 400))
        }

        const user = await User.findOne({email}).select('+password');

        //refactor
        if (!user || !(await user.comparePassword(password, user.password))) {
            return next(new AppError("Incorrect email or password", 401))
        }

        await createSendToken(user, 200, res);
    }
);

export const forgotPassword = catchRequest(
    async (req, res, next) => {
        if (!req.body.email)
            return next(new AppError("Please provide email to reset your password!", 400));

        const user = await User.findOne({email: req.body.email})

        if (!user)
            return next(new AppError("There is no user with this email!", 401));

        const resetToken = user.createPasswordResetToken();

        await user.save({validateBeforeSave: false});


        res.status(200).json({
            status: "success",
        });
    }
);

export const changePassword = catchRequest(
    async (req, res, next) => {

        const user = await User.findById((req as IVerifiedRequest).user._id).select('+password');

        if(!user)
            return next(new AppError("Please provide your current password", 401));

        if (!req.body.password)
            return next(new AppError("Please provide your current password", 401));

        if (!(await user.comparePassword(req.body.password, user.password)))
            return next(new AppError("Passwords are not the same!", 401));

        user.password = req.body.newPassword;

        await user.save();

        await createSendToken(user, 200, res);
    }
);

export const refreshToken = catchRequest(
    async (req, res, next) => {
        const refreshToken = req.cookies.refresh_jwt

        if(!refreshToken)
            return next(new AppError("e", 500));

        const decodedJWT = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);

        const user = await User.findById(decodedJWT.id)

        if (!user)
            return next(new AppError("User does not exist!", 401));


    });

