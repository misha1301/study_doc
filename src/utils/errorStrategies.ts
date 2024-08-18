import {ErrorHandleBuilder, ErrorStrategy} from "./AppError";

const CastError = new ErrorHandleBuilder(
    (err, translation) => {
        const message = `Invalid ${err.path}: ${err.value}.`;
        return [message, 400];
    })
    .build();

const ValidationError = new ErrorHandleBuilder(
    (err, translation) => {
        const errors = Object.values(err.errors).map((val: any) => {
            if (val.message)
                return translation(val.message);//for mongoose`s error object
            else
                return translation(val);//for yup`s error object
        });
        return [errors.join("; "), 400];
    })
    .build();

const MongoDuplicateError = new ErrorHandleBuilder(
    (err, translation) => {
        const duplicateField = err.message.match(/[^{\}]+(?=})/g);
        const message = translation("errors:validation.DUPLICATED_FIELD", {field: duplicateField});
        return [message, 400];
    })
    .build();

const JsonWebTokenError = new ErrorHandleBuilder()
    .setMessage("errors:authentication.BAD_JWT")
    .setStatus(403)
    .build();

const TokenExpiredError = new ErrorHandleBuilder()
    .setMessage("errors:authentication.EXPIRED_JWT")
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