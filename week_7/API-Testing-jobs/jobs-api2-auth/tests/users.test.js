const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/userModel");

const api = supertest(app);

const validUser = {
    name: "Jane Jobseeker",
    email: "jane.jobseeker@example.com",
    password: "JobSearch123!",
    phone_number: "+358401234567",
    gender: "female",
    date_of_birth: "1995-06-15",
    membership_status: "active",
};

beforeEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

// POST /api/users/signup
describe("POST /api/users/signup", () => {
    describe("when the payload is valid", () => {
        it("should return status 201", async () => {
            await api
                .post("/api/users/signup")
                .send(validUser)
                .expect(201)
                .expect("Content-Type", /application\/json/);
        });

        it("should return an email and token", async () => {
            const response = await api
                .post("/api/users/signup")
                .send(validUser)
                .expect(201);

            expect(response.body).toHaveProperty("token");
            expect(response.body.email).toBe(validUser.email);
        });

        it("should persist the user in the database", async () => {
            await api.post("/api/users/signup").send(validUser).expect(201);

            const savedUser = await User.findOne({ email: validUser.email });
            expect(savedUser).not.toBeNull();
            expect(savedUser.name).toBe(validUser.name);
        });
    });

    describe("when the payload is invalid", () => {
        it("should return status 400 when required fields are missing", async () => {
            const response = await api
                .post("/api/users/signup")
                .send({ email: "missing@example.com" })
                .expect(400);

            expect(response.body).toHaveProperty("error", "Please add all fields");
        });

        it("should not persist a user in the database", async () => {
            await api
                .post("/api/users/signup")
                .send({ email: "missing@example.com" })
                .expect(400);

            const usersAtEnd = await User.find({});
            expect(usersAtEnd).toHaveLength(0);
        });
    });

    describe("when the email is already registered", () => {
        it("should return status 400", async () => {
            await api.post("/api/users/signup").send(validUser).expect(201);

            const response = await api
                .post("/api/users/signup")
                .send({ ...validUser, name: "Another Jobseeker" })
                .expect(400);

            expect(response.body).toHaveProperty("error", "User already exists");
        });
    });
});

// POST /api/users/login
describe("POST /api/users/login", () => {
    beforeEach(async () => {
        await api.post("/api/users/signup").send(validUser).expect(201);
    });

    describe("when the credentials are valid", () => {
        it("should return status 200", async () => {
            await api
                .post("/api/users/login")
                .send({
                    email: validUser.email,
                    password: validUser.password,
                })
                .expect(200)
                .expect("Content-Type", /application\/json/);
        });

        it("should return an email and token", async () => {
            const response = await api
                .post("/api/users/login")
                .send({
                    email: validUser.email,
                    password: validUser.password,
                })
                .expect(200);

            expect(response.body).toHaveProperty("token");
            expect(response.body.email).toBe(validUser.email);
        });
    });

    describe("when the credentials are invalid", () => {
        it("should return status 400 with a wrong password", async () => {
            const response = await api
                .post("/api/users/login")
                .send({
                    email: validUser.email,
                    password: "WrongPassword!",
                })
                .expect(400);

            expect(response.body).toHaveProperty("error", "Invalid credentials");
        });

        it("should return status 400 with an email that does not exist", async () => {
            const response = await api
                .post("/api/users/login")
                .send({
                    email: "nobody@example.com",
                    password: validUser.password,
                })
                .expect(400);

            expect(response.body).toHaveProperty("error", "Invalid credentials");
        });
    });
});