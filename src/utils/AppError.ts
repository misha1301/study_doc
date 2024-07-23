import ErrorController from "../controllers/errorController";

class AppError extends Error {
    status: string;
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {

        super(message);

        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.statusCode = statusCode;
        this.isOperational = true;

        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);

    }
}

export default AppError;