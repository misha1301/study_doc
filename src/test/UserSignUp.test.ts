import request from "supertest";
import app from "../index";
import User from "../models/User";

const errors_en = require('./../locales/en/errors.json');
const errors_ua = require('./../locales/ua/errors.json');

import i18next from "i18next";

beforeEach(() => {
    return User.deleteMany();
})

const validUser = {
    username: "test_user",
    email: "test_user@gmail.com",
    password: "test_user_pwd"
}

const postUser = (userAuth: {}, options?: any) => {
    const agent = request(app).post("/users/signup");

    if(options?.language){
        agent.set('Accept-Language', options.language)
    }

    return agent.send(userAuth);
}

describe("User registration", () => {

    test("return 200 OK when signup request is valid", (done) => {
        postUser(validUser)
            .then((res) => {
                expect(res.status).toBe(201);
                done();
            });
    });

    test("save the user to database", (done) => {
        postUser(validUser)
            .then(() => {
                User.find()
                    .then((userList) => {
                        expect(userList.length).toBe(1);
                        done();
                    })
            });
    });

    test("save the username and email to database", (done) => {
        postUser(validUser)
            .then(() => {
                User.findOne().select("+email")
                    .then((user) => {
                        expect(user?.username).toBe(validUser.username);
                        expect(user?.email).toBe(validUser.email);
                        done();
                    })
            });
    });

    test("return same username and email back to a client", (done) => {
        postUser(validUser)
            .then((res) => {
                expect(res.body.data.username).toBe(validUser.username);
                expect(res.body.data.email).toBe(validUser.email);
                done();
            });
    });

    test("hashes the password to database", (done) => {
        postUser(validUser)
            .then(() => {
                User.findOne().select("+password")
                    .then((user) => {
                        expect(user?.password).not.toBe(validUser.password);
                        done();
                    })
            });
    });

    test("return 400 when username is null", (done) => {
        postUser({
            username: null,
            email: "test_user@gmail.com",
            password: "test_user_pwd"
        }).then((res) => {
            expect(res.status).toBe(400);
            done();
        })
    });
});

describe("Internationalization", () => {
    test.each`
        field         | value                                | expectedMessage
        ${"username"} | ${null}                              | ${errors_en.validation.USERNAME_REQUIRED}
        ${"username"} | ${"ser"}                             | ${errors_en.validation.USERNAME_MIN}
        ${"username"} | ${"useruseruseruseruseruser"}        | ${errors_en.validation.USERNAME_MAX}
        ${"email"}    | ${null}                              | ${errors_en.validation.EMAIL_REQUIRED}
        ${"email"}    | ${"usergmail.com"}                   | ${errors_en.validation.BAD_EMAIL}
        ${"email"}    | ${"ngemailuptofiftycharacterslong" +
                          "emailuptofiftycharact@gmail.com"} | ${errors_en.validation.EMAIL_MAX}
        ${"password"} | ${null}                              | ${errors_en.validation.PASSWORD_REQUIRED}
        ${"password"} | ${"passwo"}                          | ${errors_en.validation.PASSWORD_MIN}
        ${"password"} | ${"userpassworduserpassword"}        | ${errors_en.validation.PASSWORD_MAX}
    `('when $field is $value message $expectedMessage is received when language is set as english', ({field, value, expectedMessage}, done) => {
        const user: any = {...validUser};
        user[field] = value;

        postUser(user, {language: "en"})
            .then((res) => {
                expect(res.body.message).toBe(expectedMessage);
                done();
            });
    });

    test.each`
        field         | value                                | expectedMessage
        ${"username"} | ${null}                              | ${errors_ua.validation.USERNAME_REQUIRED}
        ${"username"} | ${"ser"}                             | ${errors_ua.validation.USERNAME_MIN}
        ${"username"} | ${"useruseruseruseruseruser"}        | ${errors_ua.validation.USERNAME_MAX}
        ${"email"}    | ${null}                              | ${errors_ua.validation.EMAIL_REQUIRED}
        ${"email"}    | ${"usergmail.com"}                   | ${errors_ua.validation.BAD_EMAIL}
        ${"email"}    | ${"ngemailuptofiftycharacterslong" +
                          "emailuptofiftycharact@gmail.com"} | ${errors_ua.validation.EMAIL_MAX}
        ${"password"} | ${null}                              | ${errors_ua.validation.PASSWORD_REQUIRED}
        ${"password"} | ${"passwo"}                          | ${errors_ua.validation.PASSWORD_MIN}
        ${"password"} | ${"userpassworduserpassword"}        | ${errors_ua.validation.PASSWORD_MAX}
    `('when $field is $value message $expectedMessage is received when language is set as ukraine', ({field, value, expectedMessage}, done) => {
        const user: any = {...validUser};
        user[field] = value;

        postUser(user, {language: "ua"})
            .then((res) => {
                expect(res.body.message).toBe(expectedMessage);
                done();
            });
    });
})
