'use strict';

import { Books } from './book';
import { initStat, Stat } from './stat';
import { MaterielType, Materiel, MaterielFDCN, MaterielCDSI } from './materiel';
import { Caracter, CaracterType } from './caracter';

type SuiviePoint = {
    vie: number,
    chance: number
}

class Billy<B extends Books> {

    static readonly baseStats: Partial<Stat<Books>> = {
        habilete: 2,
        adresse: 1,
        endurence: 2,
        chance: 3,
    };
    
    book: Books;
    materiel: [Materiel<B>, Materiel<B>, Materiel<B>];
    caracter: CaracterType;
    stat: Stat<any>;
    suiviePoint: SuiviePoint;
    objetsRecuperes: Array<string>;
    NoteAventure: Array<string>;

    constructor(book: B, materiel: [Materiel<B>, Materiel<B>, Materiel<B>], caracter: CaracterType, stat: Stat<B>, suiviePoint: SuiviePoint, objetsRecuperes: Array<string>, NoteAventure: Array<string>) {
        this.book = book;
        this.materiel = materiel;
        this.caracter = caracter;
        this.stat = stat;
        this.suiviePoint = suiviePoint;
        this.objetsRecuperes = objetsRecuperes;
        this.NoteAventure = NoteAventure;
    }

    static getCaracterFromMateriel(materiel: [Materiel<Books>, Materiel<Books>, Materiel<Books>]): Caracter<Books> {

        let countMaterielByType: Map<MaterielType, number> = materiel.reduce((acc, val) => acc.set(val.type, (acc.get(val.type) || 0) + 1), new Map());

        let caracter: Caracter<Books> = CaracterType.Debrouillard;
        if (countMaterielByType.get(MaterielType.Arme) >= 2) { caracter = CaracterType.Guerrier; } else
        if (countMaterielByType.get(MaterielType.Equipement) >= 2) { caracter = CaracterType.Prudent; } else
        if (countMaterielByType.get(MaterielType.Outil) >= 2) { caracter = CaracterType.Paysan; }

        return caracter;
    }

    static createNew<BOOK extends Books>(book: BOOK, materiel: [Materiel<BOOK>, Materiel<BOOK>, Materiel<BOOK>]): Billy<BOOK> {
        const caracter:  Caracter<BOOK> = Billy.getCaracterFromMateriel(materiel);

        let stats: Array<Stat<BOOK>> = [...materiel] as Array<Stat<BOOK>>;
        stats.push({... caracter.stat} as Stat<BOOK>);
        stats.push({... Billy.baseStats} as Stat<BOOK>);
        
        const stat: Stat<BOOK> = stats.reduce((acc, val) => {
            (Object.keys(acc) as Array<keyof Stat<BOOK>>).forEach( key => acc[key] += val[key] || 0 );
            return acc;
        }, initStat(book));
        const suiviePoint = {
            vie: 3 * stat.endurence + stat.PointVieMax,
            chance: stat.chance,
        };
        const objetsRecuperes: string[] = [];
        const NoteAventure: string[] = [];
        return new Billy(book, materiel, caracter, stat, suiviePoint, objetsRecuperes, NoteAventure);
    }

}

console.log(Billy.createNew(Books.FDCN, [MaterielFDCN.Arc, MaterielFDCN.Fourche, MaterielFDCN.SacDeGrain]));
console.log(Billy.createNew(Books.CDSI, [MaterielCDSI.BoiteDeCrayon, MaterielCDSI.FleauAGrains, MaterielCDSI.Sceau]));
