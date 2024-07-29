import {ErrorHandleBuilder, ErrorStrategy} from "./AppError";

const CastError = new ErrorHandleBuilder((err) => {
        const message = `Invalid ${err.path}: ${err.value}.`;
        return [message, 400];
    }
).build();

const ValidationError = new ErrorHandleBuilder((err) => {
    return [err.message, 400];
}).build();

const MongoDuplicateError = new ErrorHandleBuilder((err) => {
    const duplicateField = err.message.match(/[^{\}]+(?=})/g);
    const message = `Duplicated field: {${duplicateField}}`;
    return [message, 400];
}).build();

const JsonWebTokenError = new ErrorHandleBuilder()
    .setMessage("Invalid token!")
    .setStatus(403)
    .build();

const TokenExpiredError = new ErrorHandleBuilder()
    .setMessage("Token is expired!")
    .setStatus(403)
    .build();

const clientErrorStrategy = new ErrorStrategy({
    CastError,
    ValidationError,
    MongoDuplicateError,
    JsonWebTokenError,
    TokenExpiredError
});

export default clientErrorStrategy;