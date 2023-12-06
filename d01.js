// Advent of Code 2023, Day 1

const helper = require("./helper.js");
let data = helper.fileToArr("input/d01_input.txt");
console.log("Part 1:", sum_calibration_vals_int(data));
console.log("Part 2:", sum_calibration_vals_any(data));

// Step 1
function sum_calibration_vals_int(data) {
  noAlpha = data.map((line) => {
    return line.replace(/[a-z]+/g, "");
  });
  let sum = 0;
  noAlpha.forEach((item) => {
    let firstLast = item[0] + item[item.length - 1];
    sum += parseInt(firstLast);
  });
  return sum;
}

// Step 2
function sum_calibration_vals_any(data) {
  const numDict = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
  };
  let sum = 0;
  data.forEach((item) => {
    // regex lookahead and matchall required to ensure overlapping matches captured
    // see https://mtsknn.fi/blog/how-to-do-overlapping-matches-with-regular-expressions/
    matchArr = [
      ...item.matchAll(
        /(?=(one|two|three|four|five|six|seven|eight|nine|[1-9]))/g
      ),
    ];
    // items from matchAll store match in second index (1)
    num =
      numDict[matchArr[0][1]] * 10 + numDict[matchArr[matchArr.length - 1][1]];
    sum += num;
  });
  return sum;
}
