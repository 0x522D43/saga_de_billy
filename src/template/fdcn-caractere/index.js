import './../stat-principale';

import html from './index.html';
import css from './style.css';
document.querySelector('body').insertAdjacentHTML('afterend', html);

const template = document.querySelector(('#fdcn-caractere'));
const style = document.createElement('style');
style.innerHTML = css;
template.content.appendChild(style);

class FdcnCaractere extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('fdcn-caractere', FdcnCaractere)