module.exports = {
  apps: [{
    name: "kupi-backend",
    script: "./dist/main.js",
    env: {
      NODE_ENV: "production",
      PORT: 3000,
    },
  }],
};
