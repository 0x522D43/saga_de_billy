

'use strict';
import Display from './modules/view/display.js';
import { set_list_billy } from './modules/view/display.js';
import Event from './modules/view/events.js';
import Billy from './modules/data/billy.js';
import { books } from './modules/data/book.js';
import { materiel_initial } from './modules/data/materiel.js';

$().ready(() => {
    //$('#modal_my-billy').modal('hide');
});

const c= {
    book: books.FDCN.name,
    //book: books.CDSI.name,
    materiel: [
        materiel_initial.arc.name, 
        materiel_initial.fourche.name, 
        materiel_initial.sac_de_grain.name,
    ],
    bonus: {
        HAB: 1, 
        END: 1, 
        CHA: 1, 
        DEG: 1,
        gloire: 3, 
        richesse: 4,
    },
    restant: {
        CHA: 2, 
        PV: 16,
    },
    sac: [],
    notes: [
        'Clef A',
        'Clef B', 
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas metus non lobortis ultricies. Proin sapien velit, dapibus et egestas id, tincidunt vitae ante. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec vitae velit posuere, sodales turpis sed, consequat diam. Cras posuere dolor ex. Nulla facilisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sed est ultrices, euismod dolor vel, consectetur eros. Aliquam vitae faucibus urna, sit amet malesuada est. Vestibulum eu nulla quis tellus molestie porta id sed augue. Donec ac mauris eu nibh maximus feugiat eget sed ligula. Phasellus efficitur lorem risus, vitae molestie erat imperdiet et. Praesent porttitor lectus sed aliquet laoreet. Nulla ut mi ultricies, commodo lacus vel, pellentesque risus. ', 
        'Vin aux carrotte (full PV)', 
        'Maecenas a mollis felis, sed fringilla diam. Aliquam sagittis mauris placerat libero commodo, condimentum posuere metus venenatis. Vestibulum feugiat rutrum mi eget feugiat. Nulla sit amet nulla nec dui rhoncus aliquet. Mauris ac bibendum sem. Quisque sed turpis dui. Sed ultrices sit amet magna quis condimentum. Integer blandit, mi ut accumsan vehicula, tortor lectus dignissim augue, sit amet volutpat lorem eros eu velit. Cras tempor orci urna, a varius sem blandit eget. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer pellentesque mauris quis tortor volutpat suscipit. Nullam malesuada eu urna vel pretium. Nunc massa odio, dignissim quis nisi eget, suscipit tincidunt dolor. Pellentesque ac ipsum blandit, placerat metus a, vulputate arcu. Cras bibendum magna ut nisl elementum pellentesque.',
        'toto',
        'tutu',
    ],
};

//sessionStorage.clear();
//sessionStorage.setItem('Billy#Calto-Magnus',JSON.stringify(Billy({...c, name: 'Calto-Magnus'}).export));
//sessionStorage.setItem('Billy#Victirius', JSON.stringify(Billy({...c,  name: 'Victirius', book: books.CDSI.name}).export));
//sessionStorage.setItem('Billy#Stramica', JSON.stringify(Billy({...c, name: 'Stramica', materiel: [materiel_initial.epee.name, materiel_initial.morgenstern.name, materiel_initial.panphlet.name]}).export));
//sessionStorage.setItem('Billy#aoiuzhoide', JSON.stringify(Billy({...c, name: 'aoiuzhoide', materiel: [materiel_initial.cotte_de_maille.name, materiel_initial.kit_de_soin.name, materiel_initial.panphlet.name]}).export));
//sessionStorage.setItem('Billy#zaeae', JSON.stringify(Billy({...c, name: 'zaeae', book: books.CDSI.name, materiel: [materiel_initial.sac_de_grain.name, materiel_initial.morgenstern.name, materiel_initial.panphlet.name]}).export));

const my_billy = Object.keys(sessionStorage)
    .filter(key => key.startsWith('Billy#'))
    .map(key => JSON.parse(sessionStorage?.getItem(key)))
    .sort( billy => billy.modified )
    .map(billy => Billy(billy));


let billy = my_billy
    .reduce( (prev, curr) => prev?.modified > curr?.modified ? prev : curr, undefined ) || c;

set_list_billy(my_billy);
Display(billy);

