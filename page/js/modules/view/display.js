import { Stat, stat as Stats, sub_stat as Sub_Stats } from '../data/stat.js';
import Billy from '../data/billy.js';
import { change_billy, load } from './events.js';

const resolve_class_from_stat = (stat) => {
    switch ( stat ) {
        case Stats.HAB: return 'stat-HAB';
        case Stats.ADR: return 'stat-ADR';
        case Stats.END: return 'stat-END';
        case Stats.CHA: return 'stat-CHA';
        case Stats.DEG: return 'stat-DEG';
        case Stats.ARM: return 'stat-ARM';
        case Stats.CRIT: return 'stat-CRIT';
        case Stats.PV: return 'stat-PV';
        case Stats.gloire: return 'stat-gloire';
        case Stats.richesse: return 'stat-richesse';
        case Stats.respect: return 'stat-respect';
        case Stats.rancune: return 'stat-rancune';
        default: throw new Error(`cannot set stat for '${stat}'` );
    }
};

const resolve_class_from_sub_stat = (sub_stat) => {
    switch ( sub_stat ) {
        case Sub_Stats.base: return 'stat-base';
        case Sub_Stats.caractere: return 'stat-caracter';
        case Sub_Stats.materiel: return 'stat-materiel';
        case Sub_Stats.bonus: return 'stat-bonus';
        default: throw new Error(`cannot get sub-stat for '${sub_stat}'`);
    }
};

export const set_stat = stat => {
    try {
        const stat_class_name = resolve_class_from_stat(stat?.name);
        if(stat_class_name){
            set_sub_stat(stat.name, Sub_Stats.base, stat.base );
            set_sub_stat(stat.name, Sub_Stats.caractere, stat.caractere );
            set_sub_stat(stat.name, Sub_Stats.materiel, stat.materiel );
            set_sub_stat(stat.name, Sub_Stats.bonus, stat.bonus );
            $(`.my-billy .${stat_class_name} .stat-total`).text(stat.total);
            $(`.my-billy .stat.${stat_class_name}`).removeClass('d-none');
        }
    } catch(error){
        console.error('Cannot set stap for ',error);
    }
};

const set_sub_stat = (stat_name, sub_stat, value = 0) => {
    const stat_class_name = resolve_class_from_stat(stat_name);
    const sub_stat_class_name = resolve_class_from_sub_stat(sub_stat);
    if(value >= 0 ) {
        $(`.${stat_class_name} .${sub_stat_class_name} span`).text(value);
        $(`.${stat_class_name} .${sub_stat_class_name} i`).addClass('bi-plus-lg').removeClass('bi-dash-lg');
    } else {
        $(`.${stat_class_name} .${sub_stat_class_name} span`).text(-value);
        $(`.${stat_class_name} .${sub_stat_class_name} i`).addClass('bi-dash-lg').removeClass('bi-plus-lg');
    }
};

export const set_title = book => {
    $('header nav .navbar-brand').css('color', book.color);
    $('header nav .navbar-brand img').attr('src', `img/${book.shortname}.png`);
    $('header nav .full-title').text(book.name);
    $('header nav .short-title').text(book.shortname);
};

export const set_caractere = (name, caractere) => {
    $('.my-billy .caractere-name').text(`${name}`);
    $('.my-billy .caractere-type').text(caractere.name)
        .css('background-color', caractere.color+'88');
}
export const set_restant = (stat_name, quantite = 0, min = undefined, max = undefined) => {
    const stat_class_name = resolve_class_from_stat(stat_name);
    $(`.my-billy .${stat_class_name} .stat-restant`).text(quantite);
    $(`.my-billy .${stat_class_name} .stat-restant-change`).data('stat-min', min);
    $(`.my-billy .${stat_class_name} .stat-restant-change`).data('stat-max', max);
}

export const set_materiel = (...materiel) => {
    if(materiel.length != 3){
        throw new Error('3 items should be picked at start, got', materiel?.length);
    } else {
        $('.my-billy .stat-materiel>li').not('.stat-sac').text( idx => materiel[idx].name);
    }
}

export const set_sac = (...sac) => {
    $('.my-billy .stat-sac .stat-total').text(sac.length);
    //todo
}

export const set_note = (...notes) => {
    $('.my-billy .stat-notes .stat-total').text(notes.length || 0);
    //todo
}

export const set_billy = perso => {
    set_title(perso.book);
    set_caractere(perso.name, perso.caractere);
    $('.stat').addClass('d-none');
    Object.keys(perso).filter(stat => Stats[stat]).map(stat => perso[stat]).filter(stat => stat instanceof Stat).forEach(set_stat);
    Object.keys(perso.restant).filter(stat => Stats[stat]).forEach(stat => set_restant(Stats[stat], perso.restant[stat], 0, perso[stat].total));
    set_materiel(...perso.materiel);
    set_sac(...perso.sac);
    set_note(...perso.notes);
    //notes
};

export const set_list_billy = (list_billy) => {
    const billies = list_billy.sort( billy => billy.created.getTime() );
    $('.my-billy-list .accordion-body>ul>li').remove();
    $('.my-billy-list .no-billy-list').removeClass('d-none');
    if(billies.length > 0){
        for(let billy of billies){ 
            $(`.my-billy-list[data-book="${billy.book.shortname}"] .no-billy-list`).addClass('d-none');
            const element = $('#template-my-billy-list').children().clone();
            element.find('.caractere-name').text(billy.name);
            element.find('.caractere-type').text(billy.caractere.name)
                .css('border-color', billy.caractere.color)
                .css('background-color', billy.caractere.color+'88');
            element.find('.billy-date-update').text(new Date(billy.modified).toLocaleString());
            element.data('billy', billy.name);
            element.on('click',function() {
                change_billy(Billy(load($(this).data('billy'))));
            });
            $(`.my-billy-list[data-book="${billy.book.shortname}"]>#my-billy-${billy.book.shortname} ul`).append(element);
        }
    } else {
        $('.no-billy-list').removeClass('d-none');
        $('.my-billy-list>div').remove();
    }
};

export default set_billy;