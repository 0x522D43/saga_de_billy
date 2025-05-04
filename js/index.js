'use strict';
import { set_list_billy, default as Display } from './modules/view/display.js';
import {default as Event, import_files} from './modules/view/events.js';
import utilities from './modules/view/utilities.js';

const my_billy = utilities.get_billy();
let billy = utilities.current_billy;

set_list_billy(my_billy);

Event();

if (billy) {
    Display(billy);
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./js/sw.js").then(
        registration => console.log("Service worker registration successful:", registration),
        error => console.error(`Service worker registration failed: ${error}`),
    );
} else {
    console.error("Service workers are not supported.");
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

$( document ).ready(function() {
    const web = urlParams.get('web') ? new URL(urlParams.get('web')) : null;
    const action = (web != null) ? web.host : urlParams.get('action');
    switch (action){
        case 'create':
            setTimeout(() => $('#create-billy-button').click(), 50);
            break;
        case 'import':
            $('#import_billy_list').click();
            break;
        case 'export':
            $('#export_billy_list').click();
            break;
        case 'load_file':
            load_file(web?.searchParams.get('content') || urlParams.get('content'));
            break;
        default:
            if(action){
                console.warn(`action "${action}" is not supported`);
            }
            break;
    }
    const url = new URL(window.location);
    url.searchParams.delete('action');
    url.searchParams.delete('web');
    window.history.pushState({}, document.title, url);
});

const load_file = (content) => {
    if(content){
        console.log(content);
        const file = decodeURIComponent(atob(content));
        console.log(file);
        import_files([file], true);
    } else if ('launchQueue' in window) {
        console.log('File Handling API is supported!');
        launchQueue.setConsumer(launchParams => {
            import_files(launchParams.files, true);
        });
    } else if (!content) {
        console.error('File Handling API is not supported!');
    } else {
        console.error('No file content provided!');
    }
}