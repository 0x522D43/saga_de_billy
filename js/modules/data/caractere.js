export const caractere = {
    guerrier: {
        name: 'Guerrier',
        stat: {HAB: 2, CHA: -1},
        color: '#dc3545',
    },
    prudent: {
        name: 'Prudent',
        stat: {CHA: 2, HAB: -1},
        color: '#198754',//'#6f42c1',//'#fd7e14'
    },
    paysan: {
        name: 'Paysan',
        stat: {END: 2, ADR: -1},
        color: '#ffc107',//'#198754',
    },
    debrouillard: {
        name: 'Débrouillard',
        stat: {ADR: 2, END: -1},
        color: '#0dcaf0',
    },
};

export const get_by_name = name => Object.values(caractere).find( caract => caract.name === name);