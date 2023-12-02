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

const games = readFile("./input_02");

const mappedGames = getMappedGames(games);
const possibleGames = getPossibleGameIndexSum(mappedGames);
const possibleGamesPowerSum = getPossibleGamePowerSum(mappedGames);

console.log(possibleGamesPowerSum);

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

function filterGames(games) {
	return games.filter((game, index) => {
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
		return correctGame;
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

function getPossibleGamePowerSum(games) {
	return games.reduce((acc, game) => {
		const maxCubes = mapCubesToObject(cubes);
		setObjectValuesToZero(maxCubes);
		for (const draw of game) {
			for (const color in draw) {
				if (maxCubes[color] < draw[color]) {
					maxCubes[color] = draw[color];
				}
			}
		}
		const colorValuesMultiplied = Object.keys(maxCubes).reduce(
			(acc, cur) => acc * maxCubes[cur],
			1
		);
		return acc + colorValuesMultiplied;
	}, 0);
}

function mapCubesToObject(cubesArray) {
	return cubesArray.reduce((acc, curr) => {
		return {
			...acc,
			[curr.color]: curr.max,
		};
	}, {});
}

function setObjectValuesToZero(obj) {
	Object.keys(obj).forEach((key) => {
		obj[key] = 0;
	});
}
