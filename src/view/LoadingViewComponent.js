import { AbstractComponent } from "../framework/view/abstract-component.js";

function createNoTaskTemplate(){
    return(
        `<p class="board__no_tasks">
            Loading...
        </p>`
    );
}

export default class LoadingViewComponent extends AbstractComponent{
    get template() {
        return createNoTaskTemplate();
    }
}