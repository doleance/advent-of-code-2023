import fs from "fs";

fs.readFile("./input_01", "utf8", (err, fileContent) => {
	if (err) {
		console.error(err);
		return;
	}

	const sumOfFirstAndLastDigits = fileContent
		.split(/\r?\n/)
		.reduce((acc, cur) => {
			let firstDigit;
			let lastDigit;
			let i = 0;
			while (
				i < cur.length &&
				(firstDigit === undefined || lastDigit === undefined)
			) {
				if (firstDigit === undefined && !isNaN(cur.at(i))) {
					firstDigit = Number(cur.at(i));
				}
				if (lastDigit === undefined && !isNaN(cur.at(cur.length - 1 - i))) {
					lastDigit = Number(cur.at(cur.length - 1 - i));
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
});
