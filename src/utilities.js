const fs = require("fs");

const alreadyInitted = (directoryPath) => fs.existsSync(directoryPath);
const onlyRunIfInitted = (directoryPath, callback) => {
  if (alreadyInitted(directoryPath)) {
    return callback();
  } else {
    console.error("to-git filestructure not created yet");
  }
};

const splitLinesToArraySync = (filePath) =>
  fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    //to remove last line usually, plus any other line that might not have an item
    .filter((item) => item.length > 0);

const lineNumToLetter = (num) => String.fromCharCode(65 + num);

module.exports = {
  alreadyInitted,
  onlyRunIfInitted,
  splitLinesToArraySync,
  lineNumToLetter,
};
