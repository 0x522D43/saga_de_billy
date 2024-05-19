import {set_restant, set_stat, set_list_billy, set_billy} from './display.js';
import {stat as Stat, stat_base} from '../data/stat.js';
import Billy from '../data/billy.js';

let billy;

export default function(b){
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

export const change_billy = b => {
    billy = b;
    set_billy(billy);
    save(billy);
    set_list_billy(Object.keys(sessionStorage)
    .filter(key => key.startsWith('Billy#'))
    .map(key => JSON.parse(sessionStorage?.getItem(key)))
    .map(billy => Billy(billy)));
};

