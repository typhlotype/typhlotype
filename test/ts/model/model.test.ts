import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { Model } from "../../../src/ts/model/model.ts";
import { WordGenerator } from "../../../src/ts/model/wordGenerator.ts";
import { KeyboardLayout } from "../../../src/ts/model/keyboardLayout.ts";

// Mock implementations for dependencies
class MockWordGenerator implements WordGenerator {
	private count = 0;

	getNextWord(): string {
		return "test" + this.count++;
	}
}

class MockKeyboardLayout implements KeyboardLayout {
	fingerLocationHint(letter: string): string {
		return `Finger location for ${letter}`;
	}

	contains(letter: string): boolean {
		return true;
	}
}

Deno.test("Model: Initialization", () => {
	const wordGenerator = new MockWordGenerator();
	const keyboardLayout = new MockKeyboardLayout();
	const model = new Model(wordGenerator, keyboardLayout);

	assertEquals(model.word, "test0");
	assertEquals(model.position, 0);
	assertEquals(model.keyboardLayout, keyboardLayout);
	assertEquals(model.wordGenerator, wordGenerator);
});

Deno.test("Model: Requested Letter", () => {
	const wordGenerator = new MockWordGenerator();
	const keyboardLayout = new MockKeyboardLayout();
	const model = new Model(wordGenerator, keyboardLayout);

	assertEquals(model.requestedLetter(), "t");

	model.position = 1;
	assertEquals(model.requestedLetter(), "e");

	model.position = 5;
	assertEquals(model.requestedLetter(), " ");
});

Deno.test("Model: Advance Letter", () => {
	const wordGenerator = new MockWordGenerator();
	const keyboardLayout = new MockKeyboardLayout();
	const model = new Model(wordGenerator, keyboardLayout);

	model.advanceLetter();
	assertEquals(model.position, 1);
	assertEquals(model.word, "test0");

	model.position = 4;
	model.advanceLetter();
	assertEquals(model.position, 5);

	model.advanceLetter(); // Should go to the next word
	assertEquals(model.position, 0);
	assertEquals(model.word, "test1");
});

Deno.test("Model: Restart", () => {
	const wordGenerator = new MockWordGenerator();
	const keyboardLayout = new MockKeyboardLayout();
	const model = new Model(wordGenerator, keyboardLayout);

	model.restart();
	assertEquals(model.position, 0);
	assertNotEquals(model.word, "test0"); // Should be the next word
});
