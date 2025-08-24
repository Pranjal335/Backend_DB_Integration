const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose'); // if using MongoDB
const User = require('../models/user.model'); // example user model

beforeAll(async () => {
  // ✅ Connect to a Test Database
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // cleanup test db
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({}); // clear users before each test
});

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "testuser",
        email: "test@example.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  it("should login an existing user", async () => {
    // First signup
    await request(app).post("/api/auth/signup").send({
      name: "loginuser",
      email: "login@example.com",
      password: "mypassword"
    });

    // Then login
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@example.com",
        password: "mypassword"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
