import {set_restant, set_stat, set_list_billy, set_billy} from './display.js';
import {stat as Stat, stat_base} from '../data/stat.js';
import Billy from '../data/billy.js';

let billy;

export default function(b) {
    
    $('#create-billy-button').on('click', function(){
        $('.form-create-billy')[0].reset();
        $('#btn-my-billy-list-close').click();
        $('#create-billy').addClass('show');
        $('#close-create-billy-form').removeClass('disabled');
    });

    $('.form-create-billy').on('submit', function(event){
        event.preventDefault();
        event.stopPropagation();
        if (!this.checkValidity()) {
            this.classList.add('was-validated');
            return;
        }
        this.classList.remove('was-validated');
        const data = Object.fromEntries(new FormData(this));
        const billy = Billy({
            book: data.book,
            name: data.name, 
            materiel: [data.materiel_1, data.materiel_2, data.materiel_3]
        });
        sessionStorage.setItem(`Billy#${data.name}`, JSON.stringify(billy.export));
        const my_billy = Object.keys(sessionStorage)
            .filter(key => key.startsWith('Billy#'))
            .map(key => JSON.parse(sessionStorage?.getItem(key)))
            .sort( billy => billy.modified )
            .map(billy => Billy(billy));
            console.log(my_billy);
        set_list_billy(my_billy);
        $('#main').addClass('show');
        $('#create-billy').removeClass('show');
        set_billy(billy);

    });

    if(b){
        billy_event(b);
    }

}

export function billy_event(b){
    billy = b;
    $('.stat-bonus-change').on('click', function() {
        const stat = $(this).data('stat');
        const quantity = parseFloat($(this).data('quantity'));

        if(isNaN(quantity)){
            show_message(`Impossible de mettre à jour ${stat}`,'danger');
        }
        billy[stat].bonus += quantity;
        set_stat(billy[stat]);

        switch (Stat[stat]) {
            case Stat.END: update_PV_restant(billy); break;
            case Stat.CHA: update_CHA_restant(billy); break;
        }
        save(billy);
    });

    $('.stat-restant-change').on('click', function() {
        const stat = $(this).data('stat');
        const quantity_str = $(this).data('quantity');
        let quantity = parseFloat(quantity_str);

        if(quantity_str === 'full'){
            quantity = billy[stat].total - billy.restant[stat];
        } else {
            const min = parseFloat($(this).data('stat-min'));
            const max = parseFloat($(this).data('stat-max'));
            if(!isNaN(max) && max < ( billy.restant[stat] + quantity)) {
                show_message(`[${Stat[stat]}] ne peut pas être supérieur à ${max}`,'warning');
                return;
            } else if (!isNaN(min) && min > ( billy.restant[stat] + quantity)) {
                show_message(`[${Stat[stat]}] ne peut pas être infèrieur à ${min}`,'warning');
                return;
            }
        }

        if(isNaN(quantity)){
            show_message(`Impossible de mettre à jour [${Stat[stat]}]`,'danger');
        }

        billy.restant[stat] += quantity;
        set_restant(Stat[stat], billy.restant[stat]);
        
        save(billy);
    });

}

export const show_message = (message, level = 'info', callback = undefined) => {
    const element = $('#alert-message');
    element.removeClass((_, className) => (className.match (/(^|\s)(bg|border|text)-[a-z]+-(subtle|emphasis)/g) || []).join(' '));
    element.addClass(`bg-${level}-subtle text-${level}-emphasis`);
    element.find('.toast-body .message').text(message);
    const toast = bootstrap.Toast.getOrCreateInstance(element);
    element.find('.toast-body .confirmation').toggleClass('d-none', callback === undefined).on('click', function() {
        callback();
        $(this).off();
    });
    element.data('bs-autohide', callback == undefined);
    toast.show();
};

const update_PV_restant = (billy) => {
    billy.PV.base = stat_base.PV(billy.END.total);
    set_stat(billy.PV);
    billy.restant.PV = Math.min(billy.restant.PV, billy.PV.total);
    set_restant(Stat.PV, billy.restant.PV);
};

const update_CHA_restant = (billy) => {
    billy.restant.CHA = Math.min(billy.restant.CHA, billy.CHA.total);
    set_restant(Stat.CHA, billy.restant.CHA);
}

export const save =  billy => {
    sessionStorage?.setItem(`Billy#${billy.name}`, JSON.stringify(billy.export));
}

export const load = name => JSON.parse(sessionStorage?.getItem(`Billy#${name}`));

export const remove_billy = function(e) {
    const billy = $(this).data('billy-name');
    show_message(`Billy [${billy}] va être supprimé`,'danger', () => {
        sessionStorage.removeItem(`Billy#${billy}`);
        set_list_billy();
    });
}

export const apply_notes_action = function(selector){
    selector.find('.btn-delete').on('click', function(){
        const index = $('.note-list .note').index($(this).closest('.note'));
        billy.notes.splice(index, 1);
        $('.note-list .note').slice(index, index + 1).remove();
    });
    selector.find('.btn-reorder').on('click', function(){
        const index = $('.note-list .note').index($(this).closest('.note'));
        const shift = $(this).data('step');
        console.log(index, shift, index+shift);
        if((index + shift) >= 0 && (index + shift) < billy.notes.length){
            const target_elem = $('.note-list .note').slice(index + shift, index + shift + 1);
            const source_elem = $('.note-list .note').slice(index, index + 1);
            console.log(source_elem, target_elem);
            (index < index + shift) ? source_elem.before(target_elem) : source_elem.after(target_elem);
            billy.notes[index] = billy.notes.splice(index + shift, 1, billy.notes[index])[0];
        }
    });
    selector.find('.btn-edit').on('click', function(){
        const index = $('.note-list .note').index($(this).closest('.note'));
        const note = $('.note-list .note').slice(index, index + 1);
        note.find('.note-edit').text(note.find('.note-content').text()).height(note.find('.note-content')[0].clientHeight).focus();
        note.find('.action-header, .edit-header, .note-edit, .note-content').toggleClass('d-none');
        console.log(note.find('.note-content')[0].clientHeight);
    });
    selector.find('.btn-edit-cancel').on('click', function(){
        const index = $('.note-list .note').index($(this).closest('.note'));
        const note = $('.note-list .note').slice(index, index + 1);
        note.find('.action-header, .edit-header, .note-edit, .note-content').toggleClass('d-none');
    });
    selector.find('.btn-edit-save').on('click', function(){
        const index = $('.note-list .note').index($(this).closest('.note'));
        const note = $('.note-list .note').slice(index, index + 1);
        note.find('.action-header, .edit-header, .note-edit, .note-content').toggleClass('d-none');
        billy.notes[index] = note.find('.note-edit').val();
        console.log(billy.notes[index]);
    });
};


export const change_billy = b => {
    $('#main').addClass('d-none');
    $('#loading').removeClass('d-none');
    
    billy = b;
    set_billy(billy);
    save(billy);
    set_list_billy(Object.keys(sessionStorage)
    .filter(key => key.startsWith('Billy#'))
    .map(key => JSON.parse(sessionStorage?.getItem(key)))
    .map(billy => Billy(billy)));

    $('#main').removeClass('d-none');
    $('#loading').addClass('d-none');
};

