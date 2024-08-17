import jwt, {JwtPayload, Secret, SignOptions, VerifyOptions} from "jsonwebtoken";

interface IVerifyTokenPayload extends JwtPayload {
    id?: string | undefined;
}

export const verifyToken = (token: string, secretKey: string, options?: VerifyOptions): Promise<IVerifyTokenPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, options, (error, decoded) => {
            if (error)
                reject(error);
            else
                resolve(decoded as IVerifyTokenPayload);
        })
    })
}

export const signToken = (payload: string | object, secretKey: Secret, options: SignOptions): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            secretKey,
            options,
            (error, decoded) => {
                if (error)
                    reject(error);
                else
                    resolve(decoded as string);
            });
    });
}

export const signAccessToken = (payload: object): Promise<string> => {
    return signToken(
        payload,
        process.env.ACCESS_TOKEN_SECRET as string,
        {expiresIn: process.env.ACCESS_JWT_EXPIRES_IN});
}

export const signRefreshToken = (payload: object): Promise<string> => {
    return signToken(
        payload,
        process.env.REFRESH_TOKEN_SECRET as string,
        {expiresIn: process.env.REFRESH_JWT_EXPIRES_IN});
}


