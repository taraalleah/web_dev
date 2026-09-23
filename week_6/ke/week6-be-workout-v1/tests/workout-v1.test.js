const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

afterAll(() => {
  mongoose.connection.close();
});


describe("when there is initially some notes saved", () => {

  test("Workouts are returned as json", async () => {
    await api
      .get("/api/workouts")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("New workout added successfully", async () => {
    const newWorkout = {
      title: "test workout x",
      reps: 19,
      load: 109,
    };
    await api.post("/api/workouts").send(newWorkout).expect(201);
  });


  test("workout without title is not added", async () => {
    const newWorkout = {
      reps: 23,
    };

    await api.post("/api/workouts").send(newWorkout).expect(400);

  });
});




