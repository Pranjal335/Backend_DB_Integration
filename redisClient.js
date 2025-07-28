const redis = require("redis");

const redisClient = redis.createClient({
    legacyMode: true,
    socket: {
        host: "127.0.0.1",
        port: 6379,
    },
});

redisClient.connect().catch(console.error);

module.exports = redisClient;