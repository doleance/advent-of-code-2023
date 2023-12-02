import { readFile } from "./utils.mjs";

const cubes = [
	{
		color: "red",
		max: 12,
	},
	{
		color: "green",
		max: 13,
	},
	{
		color: "blue",
		max: 14,
	},
];

const games = readFile("./input_02_ex_1");

const mappedGames = getMappedGames(games);
const possibleGames = getPossibleGameIndexSum(mappedGames);

console.log(possibleGames);

function getMappedGames(games) {
	return games.map((game) => {
		const draws = game.split(/[:;]/);
		return draws.slice(1).map((draw) => {
			const separatedColors = {};
			draw.split(",").forEach((colorOfADraw) => {
				const pair = colorOfADraw.trim().split(" ");
				separatedColors[pair[1]] = Number(pair[0]);
			});
			return separatedColors;
		});
	});
}

function getPossibleGameIndexSum(games) {
	return games.reduce((acc, game, index) => {
		let correctGame = true;
		for (const draw of game) {
			for (const cube of cubes) {
				if (draw[cube.color] > cube.max) {
					correctGame = false;
					break;
				}
			}
			if (!correctGame) {
				break;
			}
		}
		return acc + (correctGame ? index + 1 : 0);
	}, 0);
}
