import { Drop } from "./droppable";
import { Model } from "./model/model";

export interface Module extends Drop {
	initialize(model: Model, reinit: boolean): void;
}
