import request from "supertest";
import app from "../index";
import User from "../models/User";

beforeEach(() => {
    return User.deleteMany();
})

describe("User registration", () => {
    test("return 200 OK when signup request is valid", (done) => {
        request(app)
            .post("/users/signup")
            .send({
                "username": "test_user",
                "email": "test_user@gmail.com",
                "password": "test_user_pwd"
            })
            .then((res) => {
                expect(res.status).toBe(201);
                done();
            })
    });

    test("save the user to database", (done) => {
        request(app)
            .post("/users/signup")
            .send({
                "username": "test_user",
                "email": "test_user@gmail.com",
                "password": "test_user_pwd"
            })
            .then((res) => {
                User.find().then((userList) => {
                    expect(userList.length).toBe(1);
                })
                done();
            })
    });
    test("save the username and email to database", (done) => {
        request(app)
            .post("/users/signup")
            .send({
                "username": "test_user",
                "email": "test_user@gmail.com",
                "password": "test_user_pwd"
            })
            .then((res) => {
                User.findOne().select("+email").then((user) => {
                    expect(user?.username).toBe("test_user");
                    expect(user?.email).toBe("test_user@gmail.com");
                })
                done();
            })
    });

    test("return same username and email back to a client", (done) => {
        request(app)
            .post("/users/signup")
            .send({
                "username": "test_user",
                "email": "test_user@gmail.com",
                "password": "test_user_pwd"
            })
            .then((res) => {
                expect(res.body.data.username).toBe("test_user");
                expect(res.body.data.email).toBe("test_user@gmail.com");

                done();
            })
    });

});
