var fs = require("fs");

exports.fileToArr = (filename) => {
  try {
    const content = fs.readFileSync(filename, "utf8");
    return content.trim().split(/\r?\n/);
  } catch (err) {
    console.log("Error: ", err);
  }
};
