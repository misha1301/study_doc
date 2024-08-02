import {TFunction} from "i18next";

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

type errParser = (err: any, translation: TFunction) => [string, number];

class ErrorCallback {
    _errParser: errParser;

    constructor(errParser: errParser) {
        this._errParser = errParser;
    }

    createError(err: any, translation: TFunction) {
        const [message, status] = this._errParser(err, translation);
        return new AppError(message, status)
    }
}

export class ErrorHandleBuilder {
    private _message: string = "Error!";
    private _status: number = 500;
    _parser: errParser | undefined;

    constructor(errParser?: errParser) {
        this._parser = errParser;
    }

    setMessage(message: string) {
        if (!this._parser)
            this._message = message;
        return this;
    }

    setStatus(status: number) {
        if (!this._parser)
            this._status = status;
        return this;
    }

    build() {
        if (this._parser) {
            return new ErrorCallback(this._parser)
        } else {
            return new ErrorCallback((err, translation) => {
                const message = this._message.startsWith('errors:') ? translation(this._message) : this._message;
                const status = this._status;
                return [message as string, status];
            });
        }
    }
}

export class ErrorStrategy {
    strategies: any;

    constructor(strategies: any) {
        this.strategies = {...strategies}
    }

    getAppError(errorName: string, err: any, translation: TFunction) {
        if (!this.strategies?.[errorName])
            return;

        return this.strategies[errorName].createError(err, translation);
    }
}

export default AppError;