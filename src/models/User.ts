import crypto from 'crypto'
import bcrypt from 'bcryptjs';
import mongoose, {Schema, Document, Model} from 'mongoose';

const validator = require('validator');

interface IUSerPreferences {
    language: string,
    theme: string,
    notification: boolean,
}

export interface IUser {
    email: string,
    username: string,
    password: string,
    passwordChangedAt: Date,
    passwordResetToken: string,
    passwordResetExpires: Date,
    imgURL: string,
    connectionList: typeof mongoose.Schema.ObjectId
    gitHubLink: string,
    role: string,
    registerDate: Date,
    lastActiveDate: Date,
    refreshToken: string,
    accountStatus: string,
    preferences: IUSerPreferences
}

export interface IUserDocument extends IUser, Document {
    isPasswordChangedAfterJWT: (JWTTimestamp: number) => boolean,
    comparePassword: (candidatePassword: string, userPassword: string) => Promise<boolean>,
    createPasswordResetToken: () => number,
    compareRefreshToken: (candidateToken: string, userToken: string) => boolean
}

const userSchema = new Schema<IUserDocument>({
    email: {
        type: String,
        select: false,
        unique: true,
        lowercase: true,
        required: [true, "errors:validation.EMAIL_REQUIRED"],
        maxlength: [50, "errors:validation.EMAIL_MAX"],
        validate: [validator.isEmail, "errors:validation.BAD_EMAIL"]
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "errors:validation.USERNAME_REQUIRED"],
        maxlength: [20, "errors:validation.USERNAME_MAX"],
        minlength: [4, "errors:validation.USERNAME_MIN"]
    },
    password: {
        type: String,
        select: false,
        required: [true, "errors:validation.PASSWORD_REQUIRED"],
        maxlength: [20, "errors:validation.PASSWORD_MAX"],
        minlength: [7, "errors:validation.PASSWORD_MIN"]
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    imgURL: {
        type: String,
        default: undefined
    },
    connectionList: [{
        type: [mongoose.Schema.ObjectId],
        ref: "User"
    }],
    gitHubLink: {
        type: String,
        default: undefined
    },
    role: {
        type: String,
        enums: ["Admin", "User"],
        default: "User",
        mutable: false
    },
    registerDate: {
        type: Date,
        default: Date.now,
    },
    lastActiveDate: {
        type: Date,
        default: Date.now,
    },
    refreshToken: {
        type: String,
        select: false
    },
    accountStatus: {
        type: String,
        enums: ["deleted", "unconfirmed", "active"],
        default: "unconfirmed",
        select: false
    },
    preferences: {
        language: {
            type: String,
            default: "en"
        },
        theme: {
            type: String,
            default: "System"
        },
        notification: {
            type: Boolean,
            default: true
        }
    }
});

userSchema.pre("save",
    async function (next): Promise<void> {
        if (!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, 12);
        next();
    });

userSchema.pre("save",
    function (next) {

        if (!this.isModified('password') || this.isNew)
            return next();

        const oneSec = 1000;
        this.passwordChangedAt = new Date(Date.now() - oneSec);

        next();
    });

userSchema.methods.isPasswordChangedAfterJWT = function (JWTTimestamp: number): boolean {
    if (this.passwordChangedAt) {
        const pwdChangedTimestamp = this.passwordChangedAt.getTime() / 1000;

        return JWTTimestamp < pwdChangedTimestamp;
    }
    return false;
}

userSchema.methods.comparePassword = async function (candidatePassword: string, userPassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.compareRefreshToken = function (candidateToken: string, userToken: string): boolean {
    return candidateToken === userToken;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetDigits = Math.floor(100000 + Math.random() * 900000); // 6 digits

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(`${resetDigits}`)
        .digest('hex');

    const tenMin = 10 * 60 * 1000;

    this.passwordResetExpires = Date.now() + tenMin;

    return resetDigits;
}

const User = mongoose.model<IUserDocument>("User", userSchema);
export default User;