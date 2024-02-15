'use strict';

import { Books } from './book';
import { Stat } from './stat';

export class Caracter<book extends Books> {
    readonly name: string;
    readonly stat: Partial<Stat<book>>

    constructor(name: string, stat: Partial<Stat<book>>) {
        this.name = name;
        this.stat = stat;
    }
}

export class CaracterType {
    static readonly Guerrier = new Caracter<any>('Guerrier', { habilete: 2, chance: -1 });
    static readonly Prudent = new Caracter<any>('Prudent', { habilete: -1, chance: 2 });
    static readonly Paysan = new Caracter<any>('Paysan', { adresse: -1, endurence: 2 });
    static readonly Debrouillard = new Caracter<any>('Debrouillard', { adresse: 2, endurence: -1 });
}

