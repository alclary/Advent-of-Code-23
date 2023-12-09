// Advent of Code 2023, Day 4

const helper = require("./helper.js");
let data = helper.fileToArr("input/d04_input.txt");
// console.log(data);
console.log("Part 1:", sumCardPoints(data));
console.log("Part 2:", sumMagicCards(data));

// Step 1
function sumCardPoints(data) {
  totalPoints = 0;
  data.forEach((line) => {
    let [winNums, yourNums] = line.split(": ")[1].split(" | ");
    const common = yourNums
      .trim()
      .split(/\s+/)
      .filter((yourNum) => winNums.trim().split(/\s+/).includes(yourNum));

    if (common.length > 0) {
      totalPoints += 2 ** (common.length - 1);
    }
  });
  return totalPoints;
}

// Step 2
function sumMagicCards(data) {
  let cardArr = Array(data.length + 1).fill(1);
  cardArr[0] = 0;
  let currentCard = 1;
  data.forEach((line) => {
    let [winNums, yourNums] = line.split(": ")[1].split(" | ");
    const common = yourNums
      .trim()
      .split(/\s+/)
      .filter((yourNum) => winNums.trim().split(/\s+/).includes(yourNum));

    if (common.length > 0) {
      // Repeat for current amount of that card in list (dict by index)
      for (let i = 0; i < cardArr[currentCard]; i++) {
        // Iterate through next n cards (based on matches), adding 1 to index
        for (
          let j = currentCard + 1;
          j < currentCard + 1 + common.length && j <= cardArr.length;
          j++
        ) {
          cardArr[j]++;
        }
      }
    }
    currentCard++;
  });
  sumOfCards = cardArr.reduce((sum, val) => sum + val, 0);
  return sumOfCards;
}
