import { createElement } from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';

function createDeleteButtonComponentTemplate() {
    return (
        `<button type="button" class="button_delete">x Delete</button>`
    );
}

export default class DeleteButtonComponent extends AbstractComponent {
    #handleClick = null;
    #isDisabled = false;

    constructor({ onClick }) {
        super();
        this.#handleClick = onClick; 
        this.element.addEventListener('click', this.#clickHandler); 
    }

    get template() {
        return createDeleteButtonComponentTemplate();
    }

    #clickHandler = (evt) => {
        evt.preventDefault();
        if (this.#handleClick && !this.#isDisabled) {
            this.#handleClick(); 
        }
    }

    setDisabled(isDisabled) {
        this.#isDisabled = isDisabled;
        if (isDisabled) {
            this.element.setAttribute('disabled', 'true'); 
        } else {
            this.element.removeAttribute('disabled'); 
        }
    }
}