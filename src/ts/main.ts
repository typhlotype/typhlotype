import { Controller } from "./controller/controller.js";

let controller;

Controller.new()
	.then(c => { controller = c; })
	.catch(e => { console.error(e); });
