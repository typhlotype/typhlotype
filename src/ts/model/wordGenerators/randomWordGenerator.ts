import { WordGenerator } from "../wordGenerator";

export class RandomWordGenerator implements WordGenerator {
	words: string[];
	previousWords: RepetitionMemory<string> = new RepetitionMemory(20);

	constructor(words: string[]) {
		this.words = words;
	}

	getNextWord(): string {
		while (true) {
			let word = this.words[Math.floor(Math.random()*this.words.length)].toLowerCase();
			if (!this.previousWords.includes(word)) {
				this.previousWords.push(word);
				return word;
			}
		}
	}
}

class RepetitionMemory<T> {
	index: number = -1;
	size: number;
	arr: T[] = [];
	constructor(size: number) {
		this.size = size;
	}

	includes(searchElement: T) {
		return this.arr.includes(searchElement);
	}

	push(element: T) {
		this.index += 1;
		this.index %= this.size;
		if (this.arr.length < this.size) {
			this.arr.push(element);
		} else {
			this.arr[this.index] = element;
		}
	}
}
