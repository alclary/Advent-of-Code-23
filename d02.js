// Advent of Code 2023, Day 2
const helper = require("./helper.js");
let txtFileArray = helper.fileToArr("input/d02_input.txt");
gamesArr = textArrToObjArr(txtFileArray);
console.log("Part 1:", sumPossibleGameNums(gamesArr, 12, 13, 14));
console.log("Part 2:", sumCubeSetPowers(gamesArr));

// Helpers
function textArrToObjArr(txtFileArray) {
  gamesArr = [];
  txtFileArray.forEach((line) => {
    // Create and assign properties to gameObj
    let gameObj = {};
    gameObj["gameNum"] = parseInt(line.match(/(?<=Game )\d+/g)[0]);
    // Parse out sets of each game (3 per game), create set obj, add to setArr
    let setsArr = [];
    rawSets = line.split(": ")[1].split("; ");
    rawSets.forEach((set, index) => {
      let setObj = {};
      // Within a set, a draw represent count of one color drawn during set
      let draws = set.split(", ");
      draws = draws.forEach((draw) => {
        drawArr = draw.split(" ");
        setObj[drawArr[1]] = parseInt(drawArr[0]);
      });
      setsArr.push(setObj);
    });
    gameObj["sets"] = setsArr;
    gamesArr.push(gameObj);
  });
  return gamesArr;
}

// Step 1
function sumPossibleGameNums(gamesArr, totalRed, totalGreen, totalBlue) {
  let possibleSum = 0;

  gamesArr.forEach((game) => {
    if (
      // If even one set contains more than given colors, fail. Otherwise sume gameNum
      game.sets.every((set) => {
        if (
          (set?.red > totalRed) |
          (set?.green > totalGreen) |
          (set?.blue > totalBlue)
        ) {
          return false;
        } else {
          return true;
        }
      })
    ) {
      possibleSum += game.gameNum;
    }
  });

  return possibleSum;
}

// Step 2
function sumCubeSetPowers(gamesArr) {
  let gameSetPowerSum = 0;
  gamesArr.forEach((game) => {
    let [gameRed, gameGreen, gameBlue] = [0, 0, 0];
    game.sets.forEach((set) => {
      set?.red > gameRed ? (gameRed = set?.red) : 0;
      set?.green > gameGreen ? (gameGreen = set?.green) : 0;
      set?.blue > gameBlue ? (gameBlue = set?.blue) : 0;
    });
    gameSetPowerSum += gameRed * gameGreen * gameBlue;
  });
  return gameSetPowerSum;
}
