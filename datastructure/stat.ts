
'use strict';

import { Books } from './book';

const stats = <const> {
    commun:{
        global: ['richesse'] ,
        principale: ['habilete', 'adresse', 'endurence', 'chance'],
        secondaire:  ['degats', 'armure', 'critique', 'PointVieMax'],
    },
    [Books.FDCN]: ['gloire'],
    [Books.CDSI]: ['respect', 'rancune'],
};

export type Stat<B extends Books> = Record<
        | typeof stats['commun']['global'][number]
        | typeof stats['commun']['principale'][number]
        | typeof stats['commun']['secondaire'][number]
        | typeof stats[B][number]
    , number>;

export function initStat<B extends Books>(type: B): Stat<B> {
    const acc = {} as Stat<B>;
    if(Books.CDSI == type){
        ([
            ...stats[Books.CDSI], 
            ...stats.commun.global, 
            ...stats.commun.principale, 
            ...stats.commun.secondaire
        ] as Array<keyof Stat<B>>).forEach( key => {
            acc[key] = 0;
        });
    } 
    if(Books.FDCN == type){
        ([
            ...stats[Books.FDCN], 
            ...stats.commun.global, 
            ...stats.commun.principale, 
            ...stats.commun.secondaire
        ] as Array<keyof Stat<B>>).forEach( key => {
            acc[key] = 0;
        });
    } 
    return acc;
}

export class StatDecomposition {
    base: number;
    carac: number;
    materiel: number;
    bonus?: number;

    constructor(base: number, carac: number, materiel: number, bonus?: number) {
        this.base = base;
        this.carac = carac;
        this.materiel = materiel;
        this.bonus = bonus;
    }

    get total(): number { return this.base + this.carac + this.materiel + (this?.bonus || 0); }
}
