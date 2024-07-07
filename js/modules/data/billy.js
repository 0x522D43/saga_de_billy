

import { books, get_by_name as get_book_by_name } from './book.js';
import { stat, stat_base, Stat } from './stat.js';
import * as Materiel from './materiel.js';

class Billy {
    name;
    created;
    modified;
    book;
    caractere;
    HAB;
    ADR;
    END;
    CHA;
    DEG;
    ARM;
    CRIT;
    PV;
    gloire;
    materiel;
    sac;
    notes;
    restant;

    constructor( { book, materiel, bonus = {}, restant = {}, sac = [], notes = [], name = undefined, created = new Date().valueOf(), modified = undefined } ){
        this.created = new Date(created);
        this.modified = modified ? new Date(modified) : undefined;
        this.book = get_book_by_name(book);
        this.materiel = materiel.map(Materiel.get_by_name);
        this.caractere = Materiel.get_caractere(...materiel); 
        this.name = name || generate_name(this.book, this.created, ...this.materiel);

        const stat_materiel = Materiel.get_stat(...this.materiel);

        this.HAB = new Stat(stat.HAB, stat_base.HAB, this.caractere.stat.HAB, stat_materiel.HAB, bonus.HAB);
        this.ADR = new Stat(stat.ADR, stat_base.ADR, this.caractere.stat.ADR, stat_materiel.ADR);
        this.END = new Stat(stat.END, stat_base.END, this.caractere.stat.END, stat_materiel.END, bonus.END);
        this.CHA = new Stat(stat.CHA, stat_base.CHA, this.caractere.stat.CHA, stat_materiel.CHA, bonus.CHA);
        this.DEG = new Stat(stat.DEG, stat_base.DEG, this.caractere.stat.DEG, stat_materiel.DEG, bonus.DEG);
        this.ARM = new Stat(stat.ARM, stat_base.ARM, this.caractere.stat.ARM, stat_materiel.ARM, bonus.ARM);
        this.CRIT = new Stat(stat.CRIT, stat_base.CRIT, this.caractere.stat.CRIT, stat_materiel.CRIT, bonus.CRIT);
        this.PV = new Stat(stat.PV, stat_base.PV(this.END.total), this.caractere.stat.PV, stat_materiel.PV, bonus.PV);
        this.richesse = new Stat(stat.richesse, stat_base.richesse, this.caractere.stat.richesse, stat_materiel.richesse, bonus.richesse);
        
        this.sac = sac;
        this.notes = notes;
        this.restant = {
            CHA: Math.min(this.CHA.total, restant.CHA || Infinity),
            PV: Math.min(this.PV.total, restant.PV || Infinity),

        };
    }

    get export() {
        return {
            name: this.name,
            created: this.created.valueOf(),
            modified: new Date().valueOf(),
            book: this.book.name,
            materiel: this.materiel.map(m => m.name),
            bonus: {
                HAB: this.HAB.bonus,
                ADR: this.ADR.bonus,
                END: this.END.bonus,
                CHA: this.CHA.bonus,
                DEG: this.DEG.bonus,
                ARM: this.ARM.bonus,
                CRIT: this.CRIT.bonus,
                PV: this.PV.bonus,
                richesse: this.richesse.bonus,
            },
            restant: this.restant,
            sac: this.sac,
            notes: this.notes,
        };
    }
}

class BillyFDCN extends Billy {
    gloire;

    constructor({ ...billy }){
        super(billy);
        const stat_materiel = Materiel.get_stat(...this.materiel);
        this.gloire = new Stat(stat.gloire, stat_base.gloire, this.caractere.stat.gloire, stat_materiel.gloire, billy.bonus?.gloire);
    }

    get export(){
        const data = super.export;
        data.bonus.gloire = this.gloire.bonus;
        return data;
    }
}

class BillyCDSI extends Billy {    
    rancune;
    respect;

    constructor({ ...billy }){
        super(billy);
        const stat_materiel = Materiel.get_stat(...this.materiel);
        this.respect = new Stat(stat.respect, stat_base.respect, this.caractere.stat.respect, stat_materiel.respect, billy.bonus?.respect);
        this.rancune = new Stat(stat.rancune, stat_base.rancune, this.caractere.stat.rancune, stat_materiel.rancune, billy.bonus?.rancune);
    }

    get export(){
        const data = super.export;
        data.bonus.rancune = this.rancune.bonus;
        data.bonus.respect = this.respect.bonus;
        return data;
    }
}

class BillyLDV extends Billy {    
   
    constructor({ ...billy }){
        super(billy);
    }

    get export(){
        return super.export;
    }
}

export default function(billy) {
    switch (get_book_by_name(billy?.book)){
        case books.FDCN: return new BillyFDCN(billy);
        case books.CDSI: return new BillyCDSI(billy);
        case books.LDV: return new BillyLDV(billy);
        case books.NDC:
        case books.IS:
        case books.ODJ:
        case books.TDN:
        default: throw new Error(`This book is not yet supported: '${billy?.book}'`);
    }
}

const generate_name = (book, created, ...materiel) => {
    const data = book.name+created+materiel.map(m => m.name).join('');
    let hash = 0, i, chr;
    if (data.length === 0) return hash.toString();
    for (i = 0; i < data.length; i++) {
        chr = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return '#'+Math.abs(hash);
};