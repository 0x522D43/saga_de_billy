import html from './index.html';
import css from './style.css';

document.querySelector('body').insertAdjacentHTML('afterend', html);

const template = document.querySelector('#stat-principale');
const style = document.createElement('style');
style.innerHTML = css;
template.content.appendChild(style);

class StatPrincipale extends HTMLElement {

    static get observedAttributes() {
        return ['name','base','carac','materiel','bonus'];
    }

    get name() { 
        return this._name; 
    }

    set name(value) { 
        this._name = value;
        this.nameElement.innerHTML = this._name;
    }

    get base() { 
        return this._base; 
    }

    set base(value) { 
        this.defaultSetter('base', value);
    }

    get carac() { 
        return this._carac; 
    }

    set carac(value) {
        this.defaultSetter('carac', value);
    }

    get materiel() { 
        return this._materiel; 
    }

    set materiel(value) { 
        this.defaultSetter('materiel', value);
    }

    get bonus() { 
        return this._bonus; 
    }

    set bonus(value) { 
        this._bonus = parseInt(value);
        this.setTotal();
        this.bonusLabelElement.innerHTML = '+' + this._bonus;

    }

    get total() {
        return this._total;
    }

    setTotal() {
        this._total = (this?.base || 0) + (this?.carac || 0) + (this?.materiel || 0) + (this?.bonus || 0);
        this.totalElement.innerHTML = this._total;
    }

    defaultSetter(attr, value) {
        this[`_${attr}`] =  parseInt(value);
        this.setTotal();
        this[`${attr}Element`].innerHTML = this[`_${attr}`];
    }


    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.nameElement = this.shadowRoot.querySelector('.name-element');
        this.baseElement = this.shadowRoot.querySelector('.base-element');
        this.caracElement = this.shadowRoot.querySelector('.carac-element');
        this.materielElement = this.shadowRoot.querySelector('.materiel-element');
        this.totalElement = this.shadowRoot.querySelector('.total-element');
        this.bonusInputElement = this.shadowRoot.querySelector('.bonus-stat');
        this.bonusLabelElement = this.shadowRoot.querySelector('.bonus-label');
        this.bonusInputElement.value = this.getAttribute('bonus') || 0;
        let $self = this;
        this.bonusInputElement.addEventListener('change', function(e){
            $self.bonus = e.target.value;
        });
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        switch(attrName){
            case 'name': 
                this.name = newValue;
                break;
            case 'base': 
                this.base = newValue;
                break;
            case 'carac': 
                this.carac = newValue;
                break;
            case 'materiel': 
                this.materiel = newValue;
                break;
            case 'bonus': 
                this.bonus = newValue;
                break;
        }
    }
}

customElements.define('stat-principale', StatPrincipale);
