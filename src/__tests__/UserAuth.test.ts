import request from "supertest";
import app from "../index";
import User from "../models/User";
import mongoose from "mongoose";

const errors_en = require('./../locales/en/errors.json');
const errors_ua = require('./../locales/ua/errors.json');

const validUser = {
    username: "test_user",
    email: "test_user@gmail.com",
    password: "test_user_pwd"
}

beforeAll((done) => {
    mongoose.connection.once("open", () => {
        done();
    });
});

beforeAll(async () => {
    await User.deleteMany({});

    await User.create({
        email: validUser.email,
        username: validUser.username,
        password: validUser.password
    });
});

afterAll(async () => {
    await User.deleteMany({});
});

const makeLogin = (userAuth: {}, options?: any) => {
    const agent = request(app)
        .post("/auth/login");

    if (options?.language) {
        agent.set('Accept-Language', options.language)
    }
    return agent.send(userAuth);
}

describe("User authentication", () => {

    describe('User login', () => {
        test.each`
            field         | value            
            ${"email"}    | ${validUser.email}            
            ${"username"} | ${validUser.username}
        `("return 200 OK when already registered user login by $field", ({field, value}, done) => {
            const userCred: any = {
                password: validUser.password
            }
            userCred[field] = value;
            makeLogin(userCred)
                .then((res) => {
                    expect(res.status).toBe(200);
                    done();
                });
        });
        test.each`
            field         | value
            ${"username"} | ${{password: validUser.password, username: null}}
            ${"email"}    | ${{password: validUser.password, email: null}}
            ${"password"} | ${{email: validUser.email, password: null}}
        `("return 400 Bad request when already registered user login by empty $field", ({field, value}, done) => {
            makeLogin(value)
                .then((res) => {
                    expect(res.status).toBe(400);
                    done();
                });
        });
        test("return 401 when password is incorrect", (done) => {
            const userCred: any = {
                username: validUser.username,
                password: validUser.password + "do"
            }
            makeLogin(userCred)
                .then((res) => {
                    expect(res.status).toBe(401);
                    done();
                });
        });
        test("save refresh token to database", (done) => {
            makeLogin(validUser)
                .then(() => {
                    User.findOne({username: validUser.username}).select("+refreshToken")
                        .then((user) => {
                            expect(user?.refreshToken).not.toBe('');
                            done();
                        })
                });
        });

        describe("Internationalization", () => {
            test.each`
                field         | value                          | expectedMessage
                ${"en"}       | ${validUser.password + "dd"}   | ${errors_en.authentication.AUTH_DONT_MATCH}
                ${"ua"}       | ${validUser.password + "dd"}   | ${errors_ua.authentication.AUTH_DONT_MATCH}
            `("return $expectedMessage when password is incorrect and language is set as $field", ({field, value, expectedMessage}, done) => {
                const userCred: any = {
                    username: validUser.username,
                    password: value
                }
                makeLogin(userCred, {language: field})
                    .then((res,) => {
                        expect(res.body.message).toBe(expectedMessage);
                        done();
                    });
            });
            test.each`
                field           | value                          | expectedMessage
                ${"username"}   | ${validUser.username + "dd"}   | ${errors_en.authentication.AUTH_DONT_MATCH}
                ${"email"}      | ${validUser.email + "dd"}      | ${errors_en.authentication.AUTH_DONT_MATCH}
            `("return $expectedMessage when $field is incorrect and language is set as english", ({field, value, expectedMessage}, done) => {
                const userCred: any = {
                    password: validUser.password
                }
                userCred[field] = value;
                makeLogin(userCred, {language: "en"})
                    .then((res) => {
                        expect(res.body.message).toBe(expectedMessage);
                        done();
                    });
            });
            test.each`
                field           | value                          | expectedMessage
                ${"username"}   | ${validUser.username + "dd"}   | ${errors_ua.authentication.AUTH_DONT_MATCH}
                ${"email"}      | ${validUser.email + "dd"}      | ${errors_ua.authentication.AUTH_DONT_MATCH}
            `("return $expectedMessage when $field is incorrect and language is set as ukraine", ({field, value, expectedMessage}, done) => {
                const userCred: any = {
                    password: validUser.password
                }
                userCred[field] = value;
                makeLogin(userCred, {language: "ua"})
                    .then((res) => {
                        expect(res.body.message).toBe(expectedMessage);
                        done();
                    });
            });

        });
    });


});


