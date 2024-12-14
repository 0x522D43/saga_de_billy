
export const books = {
    FDCN: {
        shortname: 'FDCN',
        name: 'La Foreresse du Chaudron Noir',
        tome: 1,
        color: '#f1aeb5',
        ready: true,
    },
    CDSI: {
        shortname: 'CDSI',
        name: 'La Corne des Sables d\'Ivoire',
        tome: 2,
        color: '#fecba1',
        ready: true,
    },
    LDV: {
        shortname: 'LDV',
        name: 'La Lance de Valkar',
        tome: 3,
        color: '#a6e9d5',
    },
    NDC: {
        shortname: 'NDC',
        name: 'Les Noces du Cercle',
        tome: 4,
        color: '#e9ecef',
    },
    IS: {
        shortname: 'IS',
        name: 'L\'Île Silencieuse',
        tome: 5,
        color: '#9ec5fe',
    },
    ODJ: {
        shortname: 'ODJ',
        name: 'L\'Ombre du Juge',
        tome: 6,
        color: '#c29ffa',
    },
    TDN: {
        shortname: 'TDN',
        name: 'La Tour de Nacre',
        tome: 7,
        color: '#9eeaf9',
    },
};

export const get_by_name = name => Object.values(books).find(book => (book.name === name || book.shortname === name)); 