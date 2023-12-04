import { readFile } from "./utils.mjs";

const SEPARATOR = ".";
const GEAR_SYMBOL = "*";

const cards = readFile("./input_04");

const [scoreOfCardsWithPrivateRules, totalScratchCards] = getScores(cards);

console.log({scoreOfCardsWithPrivateRules, totalScratchCards});

function getScores(cards) {
	let score = 0;
	const cardWins = [];
	cards.forEach((card) => {
		const [,drawn,chosen] = card.split(/[:|]/);
		const drawnNumbers = drawn.split(' ').filter((item) => item).map((item) => Number(item));
		const chosenNumbers = chosen.split(' ').filter((item) => item).map((item) => Number(item));
		const winningNumbersCount = getWinningNumbersCount(drawnNumbers, chosenNumbers);
		score += winningNumbersCount ? Math.pow(2, winningNumbersCount - 1) : 0;
		cardWins.push(winningNumbersCount);
	});
	const winningCardCount = countWinningCardCounts(cardWins).reduce((acc, cur) => acc + cur, 0);
	
	return [score, winningCardCount];
}

function getWinningNumbersCount(drawnNumbers, chosenNumbers) {
	const winningNumbers = chosenNumbers.filter((chosen) => drawnNumbers.includes(chosen));
	return winningNumbers.length;
}

// TODO: somehow make it work

/* function countWins(cardWins, currentIndex) {
	const currentWinCount = cardWins[currentIndex];
	if (currentWinCount === 0) {
		return 1;
	}
	const winnedCopies = cardWins.slice(currentIndex + 1, Math.min(currentIndex + currentWinCount + 1, cardWins.length));
	return winnedCopies.reduce((acc, cur, index) => {
		return acc + 1 + cur * countWins(cardWins, currentIndex + index + 1);
	}, 0);
} */

function countWinningCardCounts(cardWins) {
	const winningCardCounts = Array(cardWins.length).fill(1);
	for (let i = 0; i < cardWins.length; i++) {
		for (let j = 0; j < cardWins[i]; j++) {
			winningCardCounts[i + 1 + j] += winningCardCounts[i];
		}
	}
	return winningCardCounts;
}
