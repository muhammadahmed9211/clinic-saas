module.exports = {
  apps: [
    {
      name: "restapi",
      script: "dist/main.js",
      instances: 1,
      exec_mode: "fork"
    }
  ]
}
