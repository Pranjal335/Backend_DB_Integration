// redisClient.js
const redis = require("redis");

const redisClient = redis.createClient({
  url: "redis://127.0.0.1:6379", // Force IPv4 to avoid ::1 issues
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

// Immediately connect
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("❌ Redis connection failed:", err.message);
  }
})();

module.exports = redisClient;
