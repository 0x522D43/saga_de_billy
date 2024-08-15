import { Stat, stat as Stats, sub_stat as Sub_Stats } from '../data/stat.js';
import Billy from '../data/billy.js';
import { change_billy, load, apply_notes_action, billy_event, sac_add_item as persist_new_sac_item, sac_remove_item as persist_remove_sac_item} from './events.js';
import { books } from '../data/book.js';
import { materiel_by_book_group_by_category } from '../data/materiel.js';
import { objects } from '../data/objet.js';

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
        console.error('Cannot set stat for ',error);
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
    $('header nav .navbar-brand img').attr('src', `../img/${book.shortname}.svg`);
    $('header nav .full-title').text(book.name);
    $('header nav .short-title').text(book.shortname);
    
    $('#change-billy-book').val(book.shortname);
};

export const set_caractere = (name, caractere) => {
    $('.my-billy .caractere-name').text(`${name}`);
    $('#change-billy-name').val(name);
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
        for( let idx = 0; idx < materiel.length; idx++ ){
            $(`#change-materiel-${idx+1}`).val(materiel[idx].name);
             for( let offset = 1; offset < materiel.length; offset++ ){
                 $(`#change-materiel-${idx+1} option[value="${materiel[(idx + offset)%materiel.length].name}"]`).attr('disabled', true);
             }
        }
    }
}

export const set_sac = (...sac) => {
    $('.my-billy .stat-sac .stat-total').text(0);
    sac.forEach(add_sac_item);
}

export const set_sac_search = (book) => {
    const object_list = objects[book.shortname];
    $('#sac_search_result>ul:not(#sac_search_result_template)>li').remove();
    Object.keys(object_list).forEach(add_sac_item_research);
}

const add_sac_item_research = (name) => {
    const element = $('#sac_search_result_template>li').clone();
    element.find('span').text(name);
    element.find('button').data('name', name).on('click', function(){ 
        persist_new_sac_item(name); 
        add_sac_item($(this).data('name'));
    });
    $('#sac_search_result>ul:not(#sac_search_result_template)').append(element);
};

const add_sac_item = function(name){
    const sac_item = $('#sac_list_item_template>li').clone();
    sac_item.find('span').text(name || $(this).data('name'));
    sac_item.find('button').on('click', remove_sac_item);
    $('#sac_list').append(sac_item);
    $('#sac_vide_text').addClass('d-none');
    const nb_item = parseInt($('.my-billy .stat-sac .stat-total').first().text());
    $('.my-billy .stat-sac .stat-total').text(nb_item+1);
};

const remove_sac_item = function(){
    const item_to_drop = $(this).parent();
    persist_remove_sac_item($('#sac_list>li:not(.d-none)').index( item_to_drop ));
    item_to_drop.remove();
    const nb_item = parseInt($('.my-billy .stat-sac .stat-total').first().text());
    $('.my-billy .stat-sac .stat-total').text(nb_item-1);
    if($('#sac_list>li:not(#sac_vide_text)') .length === 0){
        $('#sac_vide_text').removeClass('d-none');
    }
}

export const set_note = (...notes) => {
    $('.my-billy .stat-notes .stat-total').text(notes.length || 0);
    $('.note-list>*:not(.template-note)').remove();
    if((notes.length || 0) === 0){
        $('.no-notes').removeClass('d-none');
    } else {
        for(const note_id in notes){
            const note_element = generate_note(note_id, notes[note_id]);
            $('.note-list').append(note_element);
        }
        $('.no-notes').addClass('d-none');
    }
}

export const generate_note = (index, content) => {
    const note_element = $('.template-note').children().clone();
    note_element.find('.note-content').attr('data-bs-target', `.note-action[data-order='${index}']`).text(content);
    note_element.find('.note-action').attr('data-order', index);
    apply_notes_action(note_element);
    return note_element;
}

export const set_billy = async perso => {
    $('#loading').removeClass('d-none');
    $('#main').removeClass('show');
    await fetch('./billy.html')
    .then(r => r.text())    
    .then(billy => {
        $("#main").html(billy);
        set_title(perso.book);
        set_caractere(perso.name, perso.caractere);
        $('.stat').addClass('d-none');
        Object.keys(perso).filter(stat => Stats[stat]).map(stat => perso[stat]).filter(stat => stat instanceof Stat).forEach(set_stat);
        Object.keys(perso.restant).filter(stat => Stats[stat]).forEach(stat => set_restant(Stats[stat], perso.restant[stat], 0, perso[stat].total));
        set_materiel(...perso.materiel);
        set_sac(...perso.sac);
        set_sac_search(perso.book);
        set_note(...perso.notes);
        billy_event(perso);
        $('#loading').addClass('d-none');
        $('#main').addClass('show');
    });
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
        $('#create-billy').removeClass('show');
    } else {
        $('.no-billy-list').removeClass('d-none');
        $('.my-billy-list>div>ul').remove();
        $('#create-billy,#main').addClass('show');
    }
};

export const create_list_book = (select) => {
    select.find('option').remove();
    const books_ready = Object.values(books).filter(book => book?.ready).sort((p,n) => p.tome - n.tome);
    for(let book of [{shortname: '', name: 'Aucun'},...books_ready]){
        const $option = $('<option>', {value: book.shortname, text: book.name, disabled: !book?.ready});
        select.append($option);
    }
    select.val('');
};

export const create_list_materiel = (book, materiels ) => {
    materiels.find('optgroup').remove();
    materiels.val('');
    if(book.val()){
        const book_materiel = materiel_by_book_group_by_category(book.val());
        for(const categorie in book_materiel){
            const $optgroup = $('<optgroup>', {label: categorie}); 
            for(const materiel in book_materiel[categorie]){
                const $option = $('<option>', {value: materiel, text: book_materiel[categorie][materiel].name}); 
                $optgroup.append($option);
            }
            materiels.append($optgroup);
        }
    }
};

create_list_book($('#create-billy-book'));
create_list_materiel($('#create-billy-book'), $('#create-materiel-1, #create-materiel-2, #create-materiel-3'));

export default set_billy;