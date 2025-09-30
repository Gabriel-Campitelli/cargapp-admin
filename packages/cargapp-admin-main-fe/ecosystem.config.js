const path = require("path");

module.exports = [
  {
    name: path.basename(__dirname),
    cwd: __dirname,
    script: "npm",
    args: "run start",
  },
];
