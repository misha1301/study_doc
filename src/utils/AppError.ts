type errParser = (err: any) => [string, number];

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

class ErrorHandler {
    _errParser: errParser;

    constructor(errParser: errParser) {
        this._errParser = errParser;
    }

    createError(err: any) {
        const [message, status] = this._errParser(err);
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
            return new ErrorHandler(this._parser)
        } else {
            return new ErrorHandler((err) => {
                const message = this._message;
                const status = this._status;
                return [message, status];
            });
        }
    }
}

export class ErrorStrategy {
    strategies: any;

    constructor(strategies: any) {
        this.strategies = {...strategies}
    }

    getAppError(errorName: string, errObject: any) {
        if (!this.strategies?.[errorName])
            return;

        return this.strategies[errorName].createError(errObject);
    }
}

export default AppError;