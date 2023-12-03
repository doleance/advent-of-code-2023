import { readFile } from "./utils.mjs";

const separator = ".";
const snowflakes = ["*", "+", "#", "$", "&", "@", "/", "=", "%"];

const engine = readFile("./input_03");

const mappedEngine = getMappedEngine(engine);

console.log(mappedEngine);

function getMappedEngine(lines) {
	const isolatedNumbers = [];
	let enginePartNumberSum = 0;
	lines.forEach((line, lineIndex) => {
		let i = 0;
		while (i < line.length) {
			const curChar = line.at(i);
			if (curChar !== separator && !isNaN(curChar)) {
				const [foundNumber, numberLength] = getFirstNumberAsString(line.substring(i));
				console.log(foundNumber);
				const isFoundNumberEnginePart = getHasNeighbour(lines, lineIndex, i, i + numberLength - 1);
				if (isFoundNumberEnginePart) {
					enginePartNumberSum += Number(foundNumber);
				} else {
					isolatedNumbers.push(foundNumber);
				}
				i += numberLength;
			} else {
				i++;
			}
		}
	});
	console.log(isolatedNumbers);
	return enginePartNumberSum;
}

function getFirstNumberAsString(word) {
	let foundNumber = '';
	let i = 0;
	while (!isNaN(word.at(i))) {
		foundNumber += word.at(i);
		i++;
	}
	return [foundNumber, i];
}

function hasSnowFlake(word) {
	if (!word) {
		return false;
	}
	return word.split('').reduce((acc, cur) =>  acc || isNaN(cur) && cur !== separator, false);
}

function getHasNeighbour(lines, lineIndex, startIndex, endIndex) {
	const hasFlakeBefore = startIndex === 0 ? false : hasSnowFlake(lines[lineIndex].at(startIndex - 1));
	const hasFlakeAfter = endIndex >= lines[lineIndex].length ? false : hasSnowFlake(lines[lineIndex].at(endIndex + 1));
	const hasFlakeBeforeLine = lineIndex === 0 ? false : hasSnowFlake(lines[lineIndex - 1].slice((startIndex === 0 ? startIndex : startIndex - 1), (endIndex >= (lines[lineIndex - 1].length - 1) ? (endIndex + 1) : endIndex + 2)));
	const hasFlakeAfterLine = lineIndex >= (lines.length - 1) ? false : hasSnowFlake(lines[lineIndex + 1].slice((startIndex === 0 ? startIndex : startIndex - 1), (endIndex >= (lines[lineIndex + 1].length - 1) ? (endIndex + 1) : endIndex + 2)));
	return hasFlakeBefore || hasFlakeAfter || hasFlakeBeforeLine || hasFlakeAfterLine;
}
