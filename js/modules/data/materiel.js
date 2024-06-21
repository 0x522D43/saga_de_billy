import { caractere } from "./caractere.js";

export const categorie = {
    armes: 'Armes',
    equipements: 'Equipements',
    outils: 'Outils',
};

export const materiel_initial = {
    epee: { 
        name: 'L\'Epée', 
        categorie: categorie.armes,
        stat: { HAB: 4 },
    },
    lance: { 
        name: 'La Lance', 
        categorie: categorie.armes,
        stat: { HAB: 3, ADR: 1 },
    },
    morgenstern: { 
        name: 'La Morgenstern', 
        categorie: categorie.armes,
        stat: { HAB: 1, EBD: 1, DEG: 1 },
    },
    arc: { 
        name: 'L\'Arc', 
        categorie: categorie.armes,
        stat: { HAB: 3, ADR: 1, CRIT: 4 },
    },
    cotte_de_maille: { 
        name: 'La Cotte de Mailles', 
        categorie: categorie.equipements,
        stat: { HAB: -1, ADR: -1, END: 1, ARM: 2},
    },
    marmite: { 
        name: 'La Marmite', 
        categorie: categorie.equipements,
        stat: { END: 2, ARM: 1 },
    },
    panphlet: { 
        name: 'Le Panphlet Touristique', 
        categorie: categorie.equipements,
        stat: { CHA: 4 },
    },
    kit_de_soin: { 
        name: 'Le Kit de Soin', 
        categorie: categorie.equipements,
        stat: { CHA: 1 },
    },
    fourche: { 
        name: 'La Fourche', 
        categorie: categorie.outils,
        stat: { HAB: 1, END: 3},
    },
    dague: { 
        name: 'La Dague', 
        categorie: categorie.outils,
        stat: { CRIT: 6 },
        condition: { HAB: 1 } // si pas d'arc ou pas 2 armes
    },
    kit_escalade: { 
        name: 'Le Kit d\'Escalade', 
        categorie: categorie.outils,
        stat: { ADR: 1 },
    },
    sac_de_grain: { 
        name: 'Le Sac de Grain', 
        categorie: categorie.outils,
        stat: { END: 2, CHA: 2 },
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

export const get_by_name = name => Object.values(materiel_initial).find( materiel => materiel.name === name);

export const get_stat = (...materiels) => materiels.reduce((acc, mat) => {
    for (let stat in mat.stat) {
        if (mat.stat.hasOwnProperty(stat))
          acc[stat] = (acc[stat] || 0) + mat.stat[stat];
      }
      return acc;
}, {});