import { createApp } from "vue";
import App from "./App.vue";



import { Controller } from "./ts/controller/controller";

// eslint-disable-next-line no-unused-vars
let controller: Controller;

const controllerPromise = Controller.new()
	.then(c => { controller = c; })
	.catch(e => { console.error(e); });

const documentReady = onDocumentReady();

Promise.all([controllerPromise, documentReady]).then(() => {
	createApp(App).mount("#app");
	controller.initDom();
});

function onDocumentReady(): Promise<void> {
    return new Promise(resolve => {
        if (document.readyState !== "loading") {
            resolve();
        } else {
            document.addEventListener("DOMContentLoaded", () => resolve(), { once: true });
        }
    });
}
