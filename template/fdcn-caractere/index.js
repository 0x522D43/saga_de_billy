(async () => {
    
    const template = await fetch('./template/fdcn-caractere/index.html')
    .then(response => response.text())
    .then(html => new DOMParser().parseFromString(html, "text/html").querySelector('template'))
    .catch(function(err) {  console.log('Failed to fetch page: ', err); });

     await fetch('./template/fdcn-caractere/style.css')
    .then(response => response.text())
    .then(css => {
        style = document.createElement('style');
        style.innerHTML = css;
        template.content.appendChild(style);
    })
    .catch(function(err) {  console.log('Failed to fetch page: ', err); });

    class fdcnCaractere extends HTMLElement {
        constructor(){
            super();
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }
    }

    customElements.define('fdcn-caractere', fdcnCaractere)

})();