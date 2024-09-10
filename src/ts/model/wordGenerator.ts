// NOTE: Implementations are located in the `wordGenerators` directory.

export interface WordGenerator {
	getNextWord(): string;
}
