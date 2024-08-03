import request from "supertest";
import app from "../index";
import User from "../models/User";

beforeEach(() => {
    return User.deleteMany();
})

describe("User registration", () => {

    const validUser = {
        username: "test_user",
        email: "test_user@gmail.com",
        password: "test_user_pwd"
    }

    const postValidUser = () => {
        return request(app)
            .post("/users/signup")
            .send(validUser);
    }

    test("return 200 OK when signup request is valid", (done) => {
        postValidUser()
            .then((res) => {
                expect(res.status).toBe(201);
                done();
            });
    });

    test("save the user to database", (done) => {
        postValidUser()
            .then(() => {
                User.find()
                    .then((userList) => {
                        expect(userList.length).toBe(1);
                        done();
                    })
            });
    });

    test("save the username and email to database", (done) => {
        postValidUser()
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
        postValidUser()
            .then((res) => {
                expect(res.body.data.username).toBe(validUser.username);
                expect(res.body.data.email).toBe(validUser.email);
                done();
            });
    });

    test("hashes the password to database", (done) => {
        postValidUser()
            .then(() => {
                User.findOne().select("+password")
                    .then((user) => {
                        expect(user?.password).not.toBe(validUser.password);
                        done();
                    })
            });
    });

});
