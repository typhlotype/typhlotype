import { createApp } from 'vue';
import App from './App.vue';
import { Controller } from "./ts/controller/controller.js";

let controller;

createApp(App).mount('#app');

Controller.new()
	.then(c => { controller = c; })
	.catch(e => { console.error(e); });
