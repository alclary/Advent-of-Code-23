// Advent of Code 2023, Day 3

const helper = require("./helper.js");
let data = helper.fileToArr("input/d03_input.txt");
const charMap = [];
for (let line of data) {
  charMap.push(line.split(""));
}
console.log("Part 1:", sumPartNums(charMap));
console.log("Part 2:", sumGearRatios(charMap));

// Helper functions
function genNumIndicesRight(charMap, searchRow, startCol) {
  var numStart = startCol;
  var numEnd = startCol;
  if (numEnd < charMap[searchRow].length - 1) {
    let next = numEnd + 1;
    while (
      next < charMap[searchRow].length &&
      !isNaN(charMap[searchRow][next])
    ) {
      numEnd = next;
      next += 1;
    }
  }
  return [numStart, numEnd];
}

function genNumIndicesBoth(charMap, searchRow, startCol) {
  var [numStart, numEnd] = genNumIndicesRight(charMap, searchRow, startCol);
  if (numStart > 0) {
    let next = numStart - 1;
    while (next >= 0 && !isNaN(charMap[searchRow][next])) {
      numStart = next;
      next -= 1;
    }
  }
  return [numStart, numEnd];
}

function genPerimeter(charMap, searchRow, numStart, numEnd) {
  var perimeter = [];
  var sliceStart = numStart == 0 ? numStart : numStart - 1;
  var sliceEnd =
    numEnd >= charMap[searchRow].length - 2 ? undefined : numEnd + 2;
  if (searchRow > 0) {
    perimeter.push(...charMap[searchRow - 1].slice(sliceStart, sliceEnd));
  }
  if (numStart > 0) {
    perimeter.push(charMap[searchRow][numStart - 1]);
  }
  if (numEnd < charMap[searchRow].length - 1) {
    perimeter.push(charMap[searchRow][numEnd + 1]);
  }
  if (searchRow < charMap.length - 1) {
    perimeter.push(...charMap[searchRow + 1].slice(sliceStart, sliceEnd));
  }
  return perimeter;
}

function charMapNumToStr(charMap, searchRow, numStart, numEnd) {
  let numSliceEnd =
    numEnd == charMap[searchRow].length - 1 ? undefined : numEnd + 1;
  return parseInt(charMap[searchRow].slice(numStart, numSliceEnd).join(""));
}

function multSurroundingNums(charMap, x, y) {
  triggered = 0;
  product = 1;

  columnLength = charMap.length;
  rowLength = charMap[0].length;

  // Find int left
  if (x > 0 && !isNaN(charMap[y][x - 1])) {
    nextLeft = x - 2;
    while (nextLeft >= 0 && !isNaN(charMap[y][nextLeft])) {
      nextLeft -= 1;
    }
    product *= parseInt(charMap[y].slice(nextLeft + 1, x).join(""));
    triggered += 1;
  }

  // Find int right
  if (x < rowLength - 1 && !isNaN(charMap[y][x + 1])) {
    nextRight = x + 1;
    while (nextRight < rowLength && !isNaN(charMap[y][nextRight])) {
      nextRight += 1;
    }
    if (nextRight != x) {
      if (nextRight === rowLength) {
        nextRight = undefined;
      }
      product *= parseInt(charMap[y].slice(x + 1, nextRight).join(""));
      triggered += 1;
    }
  }

  // Find int(s) top
  if (y > 0) {
    above = y - 1;
    if (!isNaN(charMap[above][x])) {
      let numCoor = genNumIndicesBoth(charMap, above, x);
      numCoor[1] = numCoor[1] === rowLength ? undefined : numCoor[1] + 1;
      product *= parseInt(
        charMap[above].slice(numCoor[0], numCoor[1]).join("")
      );
      triggered += 1;
    } else {
      // Locate top right int, if any
      if (x < rowLength && !isNaN(charMap[above][x + 1])) {
        let numCoor = genNumIndicesRight(charMap, above, x + 1);
        numCoor[1] = numCoor[1] === rowLength ? undefined : numCoor[1] + 1;
        product *= parseInt(
          charMap[above].slice(numCoor[0], numCoor[1]).join("")
        );
        triggered += 1;
      }
      // Locate top left int, if any
      if (x > 0 && !isNaN(charMap[above][x - 1])) {
        let numCoor = genNumIndicesBoth(charMap, above, x - 1);
        product *= parseInt(charMap[above].slice(numCoor[0], x).join(""));
        triggered += 1;
      }
    }
  }

  // Find int(s) bottom
  if (y < columnLength - 1) {
    below = y + 1;
    if (!isNaN(charMap[below][x])) {
      let numCoor = genNumIndicesBoth(charMap, below, x);
      numCoor[1] = numCoor[1] === rowLength ? undefined : numCoor[1] + 1;
      product *= parseInt(
        charMap[below].slice(numCoor[0], numCoor[1]).join("")
      );
      triggered += 1;
    } else {
      // Locate top right int, if any
      if (x < rowLength && !isNaN(charMap[below][x + 1])) {
        let numCoor = genNumIndicesRight(charMap, below, x + 1);
        numCoor[1] = numCoor[1] === rowLength ? undefined : numCoor[1] + 1;
        product *= parseInt(
          charMap[below].slice(numCoor[0], numCoor[1]).join("")
        );
        triggered += 1;
      }
      // Locate top left int, if any
      if (x > 0 && !isNaN(charMap[below][x - 1])) {
        let numCoor = genNumIndicesBoth(charMap, below, x - 1);
        product *= parseInt(charMap[below].slice(numCoor[0], x).join(""));
        triggered += 1;
      }
    }
  }
  // Only return product if 2 numbers were adjacent
  if (triggered === 2 && product != 1) {
    return product;
  } else {
    return 0;
  }
}

// Step 1
function sumPartNums(charMap) {
  symAdjPartSum = 0;
  for (let i = 0; i < charMap.length; i++) {
    const row = charMap[i];
    for (let j = 0; j < row.length; j++) {
      if (isNaN(charMap[i][j])) {
        continue;
      } else {
        // Identify a multidigit number
        var [numStart, numEnd] = genNumIndicesRight(charMap, i, j);
        // Add all characters surrounding that number to a list
        var perimeter = genPerimeter(charMap, i, numStart, numEnd);
        // If list contains even one occurance of symbol, add number to sum
        const syms = ["@", "#", "$", "%", "&", "*", "-", "+", "=", "/"];
        if (
          syms.some((sym) => {
            return perimeter.includes(sym);
          })
        ) {
          symAdjPartSum += charMapNumToStr(charMap, i, numStart, numEnd);
        }
        // Increment past current number
        j = numEnd + 1;
      }
    }
  }
  return symAdjPartSum;
}

// Step 2
function sumGearRatios(charMap) {
  gearRatiosSum = 0;
  for (let i = 0; i < charMap.length; i++) {
    const row = charMap[i];
    for (let j = 0; j < row.length; j++) {
      if (charMap[i][j] === "*") {
        gearRatiosSum += multSurroundingNums(charMap, j, i);
      } else {
        continue;
      }
    }
  }
  return gearRatiosSum;
}
