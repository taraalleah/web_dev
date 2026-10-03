const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Job = require("../models/jobModel");
const User = require("../models/userModel");

const api = supertest(app);

const userData = {
    name: "Protected Route Tester",
    email: "protected.jobs@example.com",
    password: "JobSearch123!",
    phone_number: "+358409876543",
    gender: "other",
    date_of_birth: "1990-01-20",
    membership_status: "active",
};

const initialJobs = [
    {
        title: "Senior React Developer",
        type: "Full-Time",
        description: "Build frontend features for a growing product team.",
        company: {
            name: "NewTek Solutions",
            contactEmail: "contact@newtek.example",
            contactPhone: "555-555-5555",
        },
    },
    {
        title: "Junior Backend Developer",
        type: "Part-Time",
        description: "Help build and maintain API endpoints.",
        company: {
            name: "Tech Innovators",
            contactEmail: "hr@techinnovators.example",
            contactPhone: "555-555-1234",
        },
    },
];

const jobsInDb = async () => {
    const jobs = await Job.find({});
    return jobs.map((job) => job.toJSON());
};

let token = null;

beforeAll(async () => {
    await User.deleteMany({});
    await Job.deleteMany({});

    const signupResponse = await api
        .post("/api/users/signup")
        .send(userData)
        .expect(201);

    token = signupResponse.body.token;
});

beforeEach(async () => {
    await Job.deleteMany({});

    for (const job of initialJobs) {
        await api
            .post("/api/jobs")
            .set("Authorization", `Bearer ${token}`)
            .send(job)
            .expect(201);
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});

// GET /api/jobs

describe("GET /api/jobs", () => {
    it("should return all jobs", async () => {
        const response = await api.get("/api/jobs").expect(200);

        expect(response.body).toHaveLength(initialJobs.length);
    });

    it("should return jobs as JSON with status 200", async () => {
        await api
            .get("/api/jobs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    it("should include a specific job in the returned list", async () => {
        const response = await api.get("/api/jobs");

        expect(response.body.map((job) => job.title)).toContain(
            "Senior React Developer"
        );
    });
});

// GET /api/jobs/:jobId

describe("GET /api/jobs/:jobId", () => {
    describe("when the id is valid", () => {
        it("should return one job by ID", async () => {
            const job = await Job.findOne({ title: "Junior Backend Developer" });

            const response = await api
                .get(`/api/jobs/${job._id}`)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            expect(response.body.title).toBe(job.title);
        });
    });

    describe("when the id is invalid", () => {
        it("should return status 404", async () => {
            const response = await api.get("/api/jobs/not-a-valid-id").expect(404);

            expect(response.body).toHaveProperty("error", "No such job");
        });
    });
});

// POST /api/jobs

describe("POST /api/jobs", () => {
    describe("when the user is authenticated", () => {
        it("should return status 201", async () => {
            const newJob = {
                title: "DevOps Engineer",
                type: "Contract",
                description: "Support deployment pipelines and cloud infrastructure.",
                company: {
                    name: "Cloud Solutions",
                    contactEmail: "jobs@cloud.example",
                    contactPhone: "555-555-6789",
                },
            };

            await api
                .post("/api/jobs")
                .set("Authorization", `Bearer ${token}`)
                .send(newJob)
                .expect(201)
                .expect("Content-Type", /application\/json/);
        });

        it("should persist the new job with a user_id", async () => {
            const newJob = {
                title: "DevOps Engineer",
                type: "Contract",
                description: "Support deployment pipelines and cloud infrastructure.",
                company: {
                    name: "Cloud Solutions",
                    contactEmail: "jobs@cloud.example",
                    contactPhone: "555-555-6789",
                },
            };

            const response = await api
                .post("/api/jobs")
                .set("Authorization", `Bearer ${token}`)
                .send(newJob)
                .expect(201);

            expect(response.body.title).toBe(newJob.title);
            expect(response.body).toHaveProperty("user_id");

            const jobsAtEnd = await jobsInDb();
            expect(jobsAtEnd).toHaveLength(initialJobs.length + 1);
        });
    });

    describe("when the user is not authenticated", () => {
        it("should return status 401", async () => {
            await api.post("/api/jobs").send(initialJobs[0]).expect(401);
        });

        it("should not increase the number of jobs in the database", async () => {
            await api.post("/api/jobs").send(initialJobs[0]).expect(401);

            const jobsAtEnd = await jobsInDb();
            expect(jobsAtEnd).toHaveLength(initialJobs.length);
        });
    });
});

// Put /api/jobs/:jobId

describe("PUT /api/jobs/:jobId", () => {
    describe("when the user is authenticated", () => {
        it("should return status 200", async () => {
            const job = await Job.findOne({ title: "Senior React Developer" });

            await api
                .put(`/api/jobs/${job._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ type: "Remote", description: "Updated job description." })
                .expect(200)
                .expect("Content-Type", /application\/json/);
        });

        it("should persist the updated fields in the database", async () => {
            const job = await Job.findOne({ title: "Senior React Developer" });

            await api
                .put(`/api/jobs/${job._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ type: "Remote", description: "Updated job description." })
                .expect(200);

            const updatedJob = await Job.findById(job._id);
            expect(updatedJob.type).toBe("Remote");
            expect(updatedJob.description).toBe("Updated job description.");
        });
    });

    describe("when the user is not authenticated", () => {
        it("should return status 401", async () => {
            const job = await Job.findOne({ title: "Senior React Developer" });

            await api
                .put(`/api/jobs/${job._id}`)
                .send({ type: "No Auth Update" })
                .expect(401);
        });
    });

    describe("when the id is invalid", () => {
        it("should return status 404", async () => {
            const response = await api
                .put("/api/jobs/not-a-valid-id")
                .set("Authorization", `Bearer ${token}`)
                .send({ type: "Invalid" })
                .expect(404);

            expect(response.body).toHaveProperty("error", "No such job");
        });
    });
});

// DELETE /api/jobs/:jobId

describe("DELETE /api/jobs/:jobId", () => {
    describe("when the user is authenticated", () => {
        it("should return status 204", async () => {
            const job = await Job.findOne({ title: "Senior React Developer" });

            await api
                .delete(`/api/jobs/${job._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(204);
        });

        it("should remove the job from the database", async () => {
            const jobsAtStart = await jobsInDb();
            const jobToDelete = jobsAtStart[0];

            await api
                .delete(`/api/jobs/${jobToDelete.id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(204);

            const jobsAtEnd = await jobsInDb();
            expect(jobsAtEnd).toHaveLength(jobsAtStart.length - 1);
            expect(jobsAtEnd.map((job) => job.title)).not.toContain(
                jobToDelete.title
            );
        });
    });

    describe("when the user is not authenticated", () => {
        it("should return status 401", async () => {
            const job = await Job.findOne({ title: "Senior React Developer" });

            await api.delete(`/api/jobs/${job._id}`).expect(401);
        });
    });

    describe("when the id is invalid", () => {
        it("should return status 404", async () => {
            const response = await api
                .delete("/api/jobs/not-a-valid-id")
                .set("Authorization", `Bearer ${token}`)
                .expect(404);

            expect(response.body).toHaveProperty("error", "No such job");
        });
    });
});