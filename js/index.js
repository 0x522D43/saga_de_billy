'use strict';
import { set_list_billy, default as Display } from './modules/view/display.js';
import Event from './modules/view/events.js';
import utilities from './modules/view/utilities.js';

const my_billy = utilities.get_billy();
let billy = utilities.current_billy;

set_list_billy(my_billy);

Event();

if(billy){
    Display(billy);
}
