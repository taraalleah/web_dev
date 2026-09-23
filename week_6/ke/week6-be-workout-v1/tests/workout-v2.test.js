const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Workout = require("../models/workoutModel");


beforeEach(async () => {
  await Workout.deleteMany({});
  let workoutObject = new Workout(initialWorkouts[0]);
  await workoutObject.save();
  workoutObject = new Workout(initialWorkouts[1]);
  await workoutObject.save();
});

afterAll(() => {
  mongoose.connection.close();
});


const initialWorkouts = [
  {
    title: "test workout 1",
    reps: 11,
    load: 101,
  },
  {
    title: "test workout 2",
    reps: 12,
    load: 102,
  },
];


describe("when there is initially some notes saved", () => {

  test("Workouts are returned as json", async () => {
    await api
      .get("/api/workouts")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all workouts are returned", async () => {
    const response = await api.get("/api/workouts");

    expect(response.body).toHaveLength(initialWorkouts.length);
  });


  test("New workout added successfully", async () => {
    const newWorkout = {
      title: "test workout x",
      reps: 19,
      load: 109,
    };
    await api.post("/api/workouts").send(newWorkout).expect(201);
  });


  test("a valid workout can be added", async () => {
    const newWorkout = {
      title: "Situps",
      reps: 25,
      load: 10,
    };

    await api
      .post("/api/workouts")
      .send(newWorkout)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/workouts");
    expect(response.body).toHaveLength(initialWorkouts.length + 1);

  });

  test("workout without title is not added", async () => {
    const newWorkout = {
      reps: 23,
    };
    await api.post("/api/workouts").send(newWorkout).expect(400);

  });
});




