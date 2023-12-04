import { readFile } from "./utils.mjs";

const SEPARATOR = ".";
const GEAR_SYMBOL = "*";

const cards = readFile("./input_04");

const scoreOfCards = getScores(cards);

console.log(scoreOfCards);

function getScores(cards) {
	let score = 0;
	cards.forEach((card) => {
		const [,drawn,chosen] = card.split(/[:|]/);
		const drawnNumbers = drawn.split(' ').filter((item) => item).map((item) => Number(item));
		const chosenNumbers = chosen.split(' ').filter((item) => item).map((item) => Number(item));
		score += getScoreByCard(drawnNumbers, chosenNumbers);
	});
	return score;
}

function getScoreByCard(drawnNumbers, chosenNumbers) {
	const winningNumbers = chosenNumbers.filter((chosen) => drawnNumbers.includes(chosen));
	return winningNumbers.length ? Math.pow(2, winningNumbers.length - 1) : 0;
}
