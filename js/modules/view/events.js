import {set_restant, set_stat, set_list_billy, set_billy, create_list_book, create_list_materiel, generate_note, create_list_succes} from './display.js';
import {stat as Stat, stat_base} from '../data/stat.js';
import Billy from '../data/billy.js';
import utilities from './utilities.js';
import { objects } from '../data/objet.js';

let billy;

export default function(b) {
    
    $('#btn-roll-dice').on('click', function(){
    	const dice = Math.ceil((Math.random())*6);
        show_message(`<div class="text-center ">Vous avez obtenu ${dice}</br><i class="fs-1 fw-bold bi-dice-${dice}" aria-label="dé ${dice}"></i><div>`,'success', undefined, true);
    });
    
    $('#import_billy_list, #import_billy_new').on('change', async function(e){
        import_files(e.target.files);
    });

    $('#export_billy_list').on('click', function(){
        save(utilities.current_billy);
        const billy_data = Object.keys(localStorage)
            .filter(key => key.startsWith('Billy#'))
            .map(key => JSON.parse(localStorage?.getItem(key)));
        
        download_text_file(`saga_de_billy.${Date.now()}.lapb`, JSON.stringify(billy_data, null, 4));
    });

    $('#create-billy-book').on('change', function() {
        create_list_materiel($('#create-billy-book'), $('#create-materiel-1, #create-materiel-2, #create-materiel-3'));
    });

    $('#create-materiel-1, #create-materiel-2, #create-materiel-3').on('change', function() {
        const previous_value = $(this).data('previous');
        
        if(previous_value != undefined){
        	$('#create-materiel-1, #create-materiel-2, #create-materiel-3')
	            .not(this)
	            .find(`option[value="${previous_value}"`)
	            .attr('disabled', false);
        }
        
        $('#create-materiel-1, #create-materiel-2, #create-materiel-3')
            .not(this)
            .find(`option[value="${$(this).val()}"`)
            .attr('disabled', true);
            
        $(this).data('previous', $(this).val());
    });

    $('#create-billy-button').on('click', function(){
        $('#create-billy .change-content').addClass('d-none');
        $('#create-billy .change-content.creation').removeClass('d-none');
        $('#create-billy-book').attr('disabled',false);
        $('.form-create-billy')[0].reset();
        $('.form-create-billy').data('action', 'creation');
        create_list_book($('#create-billy-book'));
        create_list_materiel($('#create-billy-book'), $('#create-materiel-1, #create-materiel-2, #create-materiel-3'));
        $('#btn-my-billy-list-close').click();
        new bootstrap.Collapse('#main', {toggle: false}).hide();
        new bootstrap.Collapse('#create-billy', {toggle: false}).show();
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
        let billy;
        if($(this).data('action') !== 'modification' ){
            billy = Billy({
                book: data.book,
                name: data.name, 
                materiel: [data.materiel_1, data.materiel_2, data.materiel_3]
            });
        } else {
            billy = Billy({
                ...utilities.current_billy.export,
                name: data.name, 
                materiel: [data.materiel_1, data.materiel_2, data.materiel_3],
            });
            localStorage.removeItem(`Billy#${utilities.current_billy.name}`);
        }
        localStorage.setItem(`Billy#${data.name}`, JSON.stringify(billy.export));
        const my_billy = Object.keys(localStorage)
            .filter(key => key.startsWith('Billy#'))
            .map(key => JSON.parse(localStorage?.getItem(key)))
            .sort( billy => billy.modified )
            .map(billy => Billy(billy));
        set_list_billy(my_billy);
        $('#main').addClass('show');
        $('#create-billy').removeClass('show');
        change_billy(billy);

    });

}

export function billy_event(b){
    billy = b;

    $('#export_current_billy').on('click', function(){
        const my_billy = utilities.current_billy;
        save(my_billy);
        download_text_file(`saga_de_billy.${my_billy.book.shortname}.${my_billy.name}.${Date.now()}.lapb`, JSON.stringify(my_billy.export, null, 4));
    });


    $('#modification-billy-button').on('click', function(){
        $('#create-billy .change-content').addClass('d-none');
        $('#create-billy .change-content.modification').removeClass('d-none');
        $('#create-billy-book').attr('disabled',true);
        $('.form-create-billy').data('action', 'modification');

        create_list_book($('#create-billy-book'));
        create_list_materiel($('#create-billy-book'), $('#create-materiel-1, #create-materiel-2, #create-materiel-3'));
        
        $('.form-create-billy')[0].reset();
        $('.form-create-billy [name="book"]').val(billy.book.shortname).change();
        $('.form-create-billy [name="book"]').val();
        $('.form-create-billy [name="name"]').val(billy.name);
        $('.form-create-billy [name="materiel_1"]').val(billy.materiel[0].shortname);
        $('.form-create-billy [name="materiel_2"]').val(billy.materiel[1].shortname);
        $('.form-create-billy [name="materiel_3"]').val(billy.materiel[2].shortname);

        $('#close-billy-details').click();
        new bootstrap.Collapse('#main', {toggle: false}).hide();
        new bootstrap.Collapse('#create-billy', {toggle: false}).show();
          
        $('#close-create-billy-form').removeClass('disabled');
    });

    $('#delete-billy-confirm-button').on('click', function(){
        localStorage.removeItem(`Billy#${utilities.current_billy.name}`);
        $("#btn-succes").prop('disabled', true);
        location.reload();
    });

    $('.stat-bonus-change').on('click', function() {
        const stat = $(this).data('stat');
        const quantity = parseFloat($(this).data('quantity'));

        if(isNaN(quantity)){
            show_message(`Impossible de mettre à jour ${stat}`,'danger');
        }
        billy[stat].bonus += quantity;
        set_stat(billy[stat]);

        switch (Stat[stat]) {
            case Stat.END:
            case Stat.PV: update_PV_restant(billy); break;
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

    $('#sac_search_chapter').on('click', function(){
        $('#sac_search_result>ul:not(#sac_search_result_template)>li').addClass('d-none');
        new bootstrap.Collapse('#sac_search_result', {toggle: false}).hide();
        const object_list=objects[utilities.current_billy.book.shortname];
        const search_value = parseInt($('#sac_seach_input').val());
        if(isNaN(search_value)){
            show_message('La valeur saisie n\'est pas un Numéro de chapitre.','danger');
        } else {
            $('#sac_search_result>ul:not(#sac_search_result_template)>li')
                .filter((idx, elem) => object_list[$(elem).find('button').data('name')].includes(search_value))
                .removeClass('d-none');
            if($('#sac_search_result>ul:not(#sac_search_result_template)>li:not(.d-none)').length===0){
                show_message('Aucun résultat','info');
            } else {        
                new bootstrap.Collapse('#sac_search_result', {toggle: false}).show();
            }
        }
    });
    
    $('#sac_search_name').on('click', function(){
        $('#sac_search_result>ul:not(#sac_search_result_template)>li').addClass('d-none');
        const search_value = $('#sac_seach_input').val().normalize("NFKD").replace(/\p{Diacritic}/gu, "").toUpperCase();
        if(search_value.length < 3){
            show_message('La valeur saisie doit faire au moins 3 caractères','warning');
            new bootstrap.Collapse('#sac_search_result', {toggle: false}).hide();
        } else {
            $('#sac_search_result>ul:not(#sac_search_result_template)>li')
                .filter((idx, elem) => $(elem).find('button').data('name')
                    .normalize("NFKD").replace(/\p{Diacritic}/gu, "").toUpperCase()
                    .includes(search_value))
                .removeClass('d-none');
            if($('#sac_search_result>ul:not(#sac_search_result_template)>li:not(.d-none)').length===0){
                show_message('Aucun résultat','info');
                new bootstrap.Collapse('#sac_search_result', {toggle: false}).hide();
            } else {       
                new bootstrap.Collapse('#sac_search_result', {toggle: false}).show();
            }
        }
    });

    $('#add_note_button').on('click', function(){
        const note_txt = $('#note_add_textarea').val().trim();
        if(note_txt.length === 0){
            show_message('La note ne doit pas être vide.','warning');
        } else {
            billy.notes.push(note_txt);
            save(billy);
            const note_element = generate_note(billy.notes.length-1, note_txt);
            $('.note-list').append(note_element);
            $('.no-notes').addClass('d-none');
            $('.btn-close[data-bs-target="#note_add_text"]').click();
            $('#note_add_textarea').val('');
            $('.my-billy .stat-notes .stat-total').text(billy.notes.length || 0);
        }
    });

}

export const sac_add_item = item => {
    billy.sac.push(item);
    save(billy);
};

export const sac_remove_item = item_idx => {
    billy.sac.splice(item_idx, 1);
    save(billy);
};

export const show_message = (message, level = 'info', callback = undefined, format = false) => {
    const element = $('#alert-message');
    element.removeClass((_, className) => (className.match (/(^|\s)(bg|border|text)-[a-z]+-(subtle|emphasis)/g) || []).join(' '));
    element.addClass(`bg-${level}-subtle text-${level}-emphasis`);
    if(format){
    	element.find('.toast-body .message').html(message);
    } else {
    	element.find('.toast-body .message').text(message);
    }
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
    billy.restant.PV = Math.max(0, Math.min(billy.restant.PV, billy.PV.total));
    set_restant(Stat.PV, billy.restant.PV, 0, billy.PV.total);
};

const update_CHA_restant = (billy) => {
    billy.restant.CHA = Math.max(0, Math.min(billy.restant.CHA, billy.CHA.total));
    set_restant(Stat.CHA, billy.restant.CHA, 0, billy.PV.total);
}

export const save = billy => {
    localStorage?.setItem(`Billy#${billy.name}`, JSON.stringify(billy.export));
}

export const load = name => JSON.parse(localStorage?.getItem(`Billy#${name}`));

export const remove_billy = function(e) {
    const billy = $(this).data('billy-name');
    show_message(`Billy [${billy}] va être supprimé`,'danger', () => {
        localStorage.removeItem(`Billy#${billy}`);
        set_list_billy();
    });
}

export const apply_notes_action = function(selector){
    selector.find('.btn-delete').on('click', function(){
        const index = $('.note-list .note').index($(this).closest('.note'));
        billy.notes.splice(index-1, 1);
        save(billy);
        $('.note-list .note').slice(index, index + 1).remove();
        if(billy.notes.length === 0){
            $('.no-notes').removeClass('d-none');
        }
        $('.my-billy .stat-notes .stat-total').text(billy.notes.length || 0);
    });
    selector.find('.btn-reorder').on('click', function(){
        const index = $('.note-list .note').index($(this).closest('.note'));
        const shift = $(this).data('step');
        if((index + shift) >= 1 && (index + shift) <= billy.notes.length){
            const target_elem = $('.note-list .note').slice(index + shift, index + shift + 1);
            const source_elem = $('.note-list .note').slice(index, index + 1);
            (index < index + shift) ? source_elem.before(target_elem) : source_elem.after(target_elem);
            billy.notes[index-1] = billy.notes.splice(index + shift-1, 1, billy.notes[index-1])[0];
            save(billy);
        }
    });
};

export const change_billy = b => {
    $('#main').addClass('d-none');
    $('#loading').removeClass('d-none');
    
    billy = b;
    set_billy(billy);
    save(billy);
    utilities.current_billy = billy;
    set_list_billy(utilities.get_billy());

    $('#main').removeClass('d-none');
    $('#loading').addClass('d-none');
};

const download_text_file = (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

export const import_files = async (files, from_pwa = false) => {
    let read_billy = [];
    if(from_pwa){
        for (const file of files) {
            const blob = await file.getFile();
            blob.handle = file;
            const text = await blob.text();
            const billy_data = JSON.parse(text);
            if(billy_data instanceof Array) {
                read_billy.push(billy_data.map(Billy));
            } else {
                read_billy.push([Billy(billy_data)]);
            }
        }
        read_billy.flat().forEach(change_billy);
    } else {
        for(const file of files){
            read_billy.push(new Promise( function(resolve, reject) {
                const reader = new FileReader();
                reader.onloadend = function(){
                    try {
                        const billy_data = JSON.parse(reader.result);
                        if(billy_data instanceof Array) {
                            resolve(billy_data.map(Billy));
                        } else {
                            resolve([Billy(billy_data)]);
                        }
                    } catch(error) {
                        reject(file.name);
                    }
                }
                reader.readAsText(file);
            }));
        }
        await Promise.all(read_billy).then(
            list => list.flat().forEach(change_billy),
            file => show_message(`Format d'import incorecte pour: ${file}`,'danger')
        );
    }
}

export const save_succes = () => {
    const succes = $('#succes_list input:checked').siblings('label').find('.succes_titre').toArray().map(e => $(e).text());
    localStorage?.setItem(`succes#${billy.book.shortname}`, JSON.stringify(succes));

}
