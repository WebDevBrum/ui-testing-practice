module.exports = {
  local: {
    baseURL: "http://localhost:8080/",
    timeout: 50000,
    username: "admin@gmail.com",
    password: "admin",
    launchOptions: { headless: false },
  },
  test: {},
  prod: {},
}[process.env.TESTENV || "local"];
