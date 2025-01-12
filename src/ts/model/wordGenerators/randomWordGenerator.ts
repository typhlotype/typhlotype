import { WordGenerator } from "../wordGenerator.js";
import { WordSet } from "./wordSet.js";

export class RandomWordGenerator implements WordGenerator {
	words: string[];
	wordSetId: string;
	previousWords: RepetitionMemory<string>;

	constructor(words: WordSet) {
		this.words = words.words;
		this.wordSetId = words.id;
		this.previousWords = new RepetitionMemory(Math.floor(this.words.length / 10));
	}

	getNextWord(): string {
		while (true) {
			const word = this.getRandomWord();
			if (!this.previousWords.includes(word)) {
				this.previousWords.push(word);
				return word;
			}
		}
	}

	getRandomWord(): string {
		return this.words[Math.floor(Math.random()*this.words.length)].toLowerCase();
	}
}

class RepetitionMemory<T> {
	index: number = -1;
	arr: T[] = [];
	readonly size: number;

	constructor(size: number) {
		this.size = size;
	}

	includes(searchElement: T) {
		return this.arr.includes(searchElement);
	}

	push(element: T) {
		this.index += (this.index + 1) % this.size;

		if (this.arr.length < this.size) {
			this.arr.push(element);
		} else {
			this.arr[this.index] = element;
		}
	}
}
