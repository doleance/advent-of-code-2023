import { readFile } from "./utils.mjs";

const SEPARATOR = ".";
const GEAR_SYMBOL = "*";

const engine = readFile("./input_03");

const engineParts = getEngineParts(engine);

console.log(engineParts);

function getEngineParts(lines) {
	let gears = {};
	let gearParts = {};
	let enginePartNumberSum = 0;
	lines.forEach((line, lineIndex) => {
		let i = 0;
		while (i < line.length) {
			const curChar = line.at(i);
			if (curChar !== SEPARATOR && !isNaN(curChar)) {
				const [foundNumber, numberLength] = getFirstNumberAsString(line.substring(i));
				const isFoundNumberEnginePart = getHasNeighbour(lines, lineIndex, i, i + numberLength - 1);
				if (isFoundNumberEnginePart) {
					enginePartNumberSum += Number(foundNumber);
					
					const adjacentToGearSymbols = getIsAdjacentToGear(lines, lineIndex, i, i + numberLength - 1);
					if (adjacentToGearSymbols.hasAdjacentGear) {
						gears = mergeFlakeIndices(gears, adjacentToGearSymbols.adjacentFlakeIndices, foundNumber);
					}
				}
				i += numberLength;
			} else {
				i++;
			}
		}
	});
	
	const gearRatioSum = Object.values(gears).reduce((acc, cur) => {
		if (cur.length === 2) {
			return acc + Number(cur[0]) * Number(cur[1]);
		} else {
			return acc;
		}
	}, 0);
	return {enginePartNumberSum, gearRatioSum};
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

function getSymbols(word, onlyAllowedSymbol, forbiddenSymbol = SEPARATOR) {
	if (!word) {
		return false;
	}
	return word.split('').reduce((acc, cur, index) => {
		const hasSymbol = cur === onlyAllowedSymbol || !onlyAllowedSymbol && isNaN(cur) && cur !== forbiddenSymbol;
		return {
			hasSymbol: acc.hasSymbol || hasSymbol,
			symbolIndices: [ ...acc.symbolIndices, ...(hasSymbol ? [index] : []) ]
		}
	}, {hasSymbol: false, symbolIndices: []});
}

function getHasNeighbour(lines, lineIndex, startIndex, endIndex) {
	const hasFlakeBefore = startIndex === 0 ? false : getSymbols(lines[lineIndex].at(startIndex - 1)).hasSymbol;
	const hasFlakeAfter = endIndex >= lines[lineIndex].length ? false : getSymbols(lines[lineIndex].at(endIndex + 1)).hasSymbol;
	const hasFlakeBeforeLine = lineIndex === 0 ? false : getSymbols(lines[lineIndex - 1].slice((startIndex === 0 ? startIndex : startIndex - 1), (endIndex >= (lines[lineIndex - 1].length - 1) ? (endIndex + 1) : endIndex + 2))).hasSymbol;
	const hasFlakeAfterLine = lineIndex >= (lines.length - 1) ? false : getSymbols(lines[lineIndex + 1].slice((startIndex === 0 ? startIndex : startIndex - 1), (endIndex >= (lines[lineIndex + 1].length - 1) ? (endIndex + 1) : endIndex + 2))).hasSymbol;
	return hasFlakeBefore || hasFlakeAfter || hasFlakeBeforeLine || hasFlakeAfterLine;
}

function getIsAdjacentToGear(lines, lineIndex, startIndex, endIndex) {
	let adjacentFlakeIndices = {};
	const symbolBefore = startIndex === 0 ? {} : getSymbols(lines[lineIndex].at(startIndex - 1), GEAR_SYMBOL);
	if (symbolBefore.hasSymbol) {
		adjacentFlakeIndices[getGearId(lineIndex, startIndex - 1)] = [];
	}
	const symbolAfter = endIndex >= lines[lineIndex].length ? {} : getSymbols(lines[lineIndex].at(endIndex + 1), GEAR_SYMBOL);
	if (symbolAfter.hasSymbol) {
		adjacentFlakeIndices[getGearId(lineIndex, endIndex + 1)] = [];
	}
	const symbolBeforeLine = lineIndex === 0 ? false : getSymbols(lines[lineIndex - 1].slice((startIndex === 0 ? startIndex : startIndex - 1), (endIndex >= (lines[lineIndex - 1].length - 1) ? (endIndex + 1) : endIndex + 2)), GEAR_SYMBOL);
	if (symbolBeforeLine.hasSymbol) {
		symbolBeforeLine.symbolIndices.forEach(
			(symbolIndex) => {
				adjacentFlakeIndices[getGearId(lineIndex - 1, startIndex === 0 ? startIndex + symbolIndex : startIndex - 1 + symbolIndex)] = [];
			}
		);
	}
	const symbolAfterLine = lineIndex >= (lines.length - 1) ? false : getSymbols(lines[lineIndex + 1].slice((startIndex === 0 ? startIndex : startIndex - 1), (endIndex >= (lines[lineIndex + 1].length - 1) ? (endIndex + 1) : endIndex + 2)), GEAR_SYMBOL);
	if (symbolAfterLine.hasSymbol) {
		symbolAfterLine.symbolIndices.forEach(
			(symbolIndex) => {
				adjacentFlakeIndices[getGearId(lineIndex + 1, startIndex === 0 ? startIndex + symbolIndex : startIndex - 1 + symbolIndex)] = [];
			}
		);
	}
	return { hasAdjacentGear: symbolBefore.hasSymbol || symbolAfter.hasSymbol || symbolBeforeLine.hasSymbol || symbolAfterLine.hasSymbol, adjacentFlakeIndices};
}

function getGearId(rowIndex, columnIndex) {
	return `${rowIndex}_${columnIndex}`;
}

function mergeFlakeIndices(flakeIndices1, flakeIndices2, addition) {
	Object.keys(flakeIndices2).forEach((flakeKey) => {
		const flakeCount = flakeIndices1[flakeKey];
		flakeIndices1[flakeKey] = [...(flakeIndices1[flakeKey] || []), ...(flakeIndices2[flakeKey] || []), ...(addition ? [addition] : [])];
	});
	return flakeIndices1;
}
