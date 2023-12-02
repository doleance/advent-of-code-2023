import { readFile } from "./utils.mjs";

const spelledNumbers = [
	{ value: 1, word: "one" },
	{ value: 2, word: "two" },
	{ value: 3, word: "three" },
	{ value: 4, word: "four" },
	{ value: 5, word: "five" },
	{ value: 6, word: "six" },
	{ value: 7, word: "seven" },
	{ value: 8, word: "eight" },
	{ value: 9, word: "nine" },
];

const sumOfFirstAndLastDigits = readFile("./input_01").reduce((acc, cur) => {
	let firstDigit;
	let lastDigit;
	let i = 0;
	while (
		i < cur.length &&
		(firstDigit === undefined || lastDigit === undefined)
	) {
		if (firstDigit === undefined) {
			if (!isNaN(cur.at(i))) {
				firstDigit = Number(cur.at(i));
			} else {
				const firstSpelledNumber = findStartingSpelledNumber(cur.substring(i));
				if (firstSpelledNumber) {
					firstDigit = firstSpelledNumber.value;
				}
			}
		}
		if (lastDigit === undefined) {
			if (!isNaN(cur.at(cur.length - 1 - i))) {
				lastDigit = Number(cur.at(cur.length - 1 - i));
			} else {
				const lastSpelledNumber = findStartingSpelledNumber(
					cur.substring(cur.length - 1 - i)
				);
				if (lastSpelledNumber) {
					lastDigit = lastSpelledNumber.value;
				}
			}
		}
		i++;
	}
	if (!firstDigit && !lastDigit) {
		return acc + 0;
	}
	const numberFromFirstAndLastDigit = firstDigit * 10 + lastDigit;
	return acc + numberFromFirstAndLastDigit;
}, 0);

console.log(sumOfFirstAndLastDigits);

function findStartingSpelledNumber(word) {
	return spelledNumbers.find((spelled) => word.startsWith(spelled.word));
}
