import { caractere } from "./caractere.js";

export const categorie = {
    armes: 'Armes',
    equipements: 'Equipements',
    outils: 'Outils',
};

export const materiel = {
    epee: { 
        name: 'L\'Epée', 
        categorie: categorie.armes,
        stat: { HAB: 4 },
        book: {
            FDCN: {},
        },
    },
    sabre: { 
        name: 'Le Sabre', 
        categorie: categorie.armes,
        stat: { HAB: 3, CRIT: 2 },
        book: {
            CDSI: {},
        },
    },
    lance: { 
        name: 'La Lance', 
        categorie: categorie.armes,
        stat: { HAB: 3, ADR: 1 },
        book: {
            FDCN: {},
            CDSI: {},
        },
    },
    morgenstern: { 
        name: 'La Morgenstern', 
        categorie: categorie.armes,
        stat: { HAB: 1, END: 1, DEG: 1 },
        book: {
            FDCN: {},
        },
    },
    pioche: { 
        name: 'La Pioche', 
        categorie: categorie.armes,
        stat: { HAB: 2, PV: 2, DEG: 1 },
        book: {
            CDSI: {},
        },
    },
    arc: { 
        name: 'L\'Arc', 
        categorie: categorie.armes,
        stat: { HAB: 3, ADR: 1, CRIT: 4 }, 
        book: {
            FDCN: {},
            CDSI: {},
        },
    },
    cotte_de_maille: { 
        name: 'La Cotte de Mailles', 
        categorie: categorie.equipements,
        stat: { HAB: -1, ADR: -1, END: 1, ARM: 2},
        book: {
            FDCN: {},
            CDSI: {},
        },
    },
    marmite: { 
        name: 'La Marmite', 
        categorie: categorie.equipements,
        stat: { END: 2, ARM: 1 },
        book: {
            FDCN: {},
        },
    },
    sceau: { 
        name: 'Le Sceau', 
        categorie: categorie.equipements,
        stat: { END: 1, ARM: 1, PV: 2 },
        book: {
            CDSI: {},
        },
    },
    panphlet: { 
        name: 'Le Panphlet Touristique', 
        categorie: categorie.equipements,
        stat: { CHA: 4 },
        book: {
            FDCN: {},
        },
    },
    guide_touristique: { 
        name: 'Le Guide Touristique', 
        categorie: categorie.equipements,
        stat: { CHA: 3 },
        book: {
            CDSI: {},
        },
    },
    kit_de_soin: { 
        name: 'Le Kit de Soin', 
        categorie: categorie.equipements,
        stat: { CHA: 1 },
        book: {
            FDCN: {},
        },
    },
    boite_de_crayons: { 
        name: 'La Boîte de Crayons', 
        categorie: categorie.equipements,
        stat: { CHA: 3 },
        book: {
            CDSI: {},
        },
    },
    fourche: { 
        name: 'La Fourche', 
        categorie: categorie.outils,
        stat: { HAB: 1, END: 3}, 
        book: {
            FDCN: {},
        },
    },
    fleau_a_grains: { 
        name: 'Le Fléau à Grains', 
        categorie: categorie.outils,
        stat: { HAB: 1, END: 2, PV: 2 },
        book: {
            CDSI: {},
        },
    },
    dague: { 
        name: 'La Dague', 
        categorie: categorie.outils,
        stat: { CRIT: 6 },
        book: {
            FDCN: {},
        },
        // {HAB: +1} // si pas 2 armes ou arc
    },
    couteau_ceremoniel: { 
        name: 'Le Couteau Cérémoniel', 
        categorie: categorie.outils,
        stat: { HAB: 3, CRIT: 5, richesse: 1 },
        book: {
            CDSI: {},
        },
    },
    kit_escalade: { 
        name: 'Le Kit d\'Escalade', 
        categorie: categorie.outils,
        stat: { ADR: 1 },
        book: {
            FDCN: {},
        },
    },
    filet_de_peche: { 
        name: 'Le Filet de Pêche', 
        categorie: categorie.outils,
        stat: { END: 1, ADR: 1 },
        book: {
            CDSI: {},
        },
    },
    sac_de_grains: { 
        name: 'Le Sac de Grains', 
        categorie: categorie.outils,
        stat: { END: 2, CHA: 2 },
        book: {
            FDCN: {},
            CDSI: {},
        },
    }
}

export const get_caractere = (...materiels) => {
    if (materiels.length != 3){
        throw new Error('3 items should be picked at start, got', materiels?.length);
    }

    const categorie_count = materiels
        .map(get_by_name)
        .reduce( (acc, materiel) => ({...acc, [materiel.categorie]: 1 + (acc[materiel.categorie]||0)}), {});
    
    if((categorie_count[categorie.armes] || 0) >= 2) {
        return caractere.guerrier;
    } else if((categorie_count[categorie.equipements] || 0) >= 2) {
        return caractere.prudent;
    } else if((categorie_count[categorie.outils] || 0) >= 2) {
        return caractere.paysan;
    } else if(categorie_count[categorie.armes] === 1 && categorie_count[categorie.equipements] === 1 && categorie_count[categorie.outils] === 1) {
        return caractere.debrouillard;
    } else {
        throw new Error('Items do not match a caractere:', categorie_count);
    }
};

export const get_by_name = name => Object.entries(materiel)
    .map(m => ({...m[1], shortname: m[0]}))
    .find( mat => mat.shortname === name || mat.name === name );

export const get_stat = (...materiels) => materiels.reduce((acc, mat) => {
    for (let stat in mat.stat) {
        if (mat.stat.hasOwnProperty(stat))
          acc[stat] = (acc[stat] || 0) + mat.stat[stat];
      }
      return acc;
}, {});

export const materiel_by_book_group_by_category = (book) => {
    if(!book){
        return {}
    }
    return Object.entries(materiel).map(m => ({...m[1], shortname: m[0]}))
        .filter(m => m?.book[book] !== undefined)
        .reduce((previous, current) => {
            previous[current.categorie] = previous[current.categorie] || {};
            previous[current.categorie][current.shortname] = current;
            return previous;
        }, {});
}