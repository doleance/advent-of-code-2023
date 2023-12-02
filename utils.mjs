import fs from "fs";

export function readFile(fileName) {
	return fs.readFileSync(fileName, "utf8").split(/\r?\n/);
}
