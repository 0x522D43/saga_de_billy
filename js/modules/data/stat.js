export const stat_base = {
    HAB: 2,
    ADR: 1,
    END: 2,
    CHA: 3,
    DEG: 0,
    ARM: 0,
    CRIT: 0,
    PV: endurence => 3 * endurence,
    gloire: 0,
    richesse: 0,
    respect: 0,
    rancune: 0,
    
};

export const stat = {
    HAB: 'Habileté',
    ADR: 'Adresse',
    END: 'Endurence',
    CHA: 'Chance',
    DEG: 'Dégat',
    ARM: 'Armure',
    CRIT: 'Critique',
    PV: 'Point de vie',
    gloire: 'Gloire',
    richesse: 'Richesse',
    respect: 'Respect',
    rancune: 'Rancune',
};

export const sub_stat = {
    base: 'Base',
    caractere: 'Caractere',
    materiel: 'Materiel',
    bonus: 'Bonus',
};

export const icon = {
    HAB: 'bi-feather',
    ADR: 'bi-wind',
    END: 'bi-droplet-half',
    CHA: 'bi-dice-3',
    DEG: 'bi-hammer',
    ARM: 'bi-shield',
    CRIT: 'bi-lightning',
    PV: 'bi-heart',
    gloire: 'bi-trophy',
    richesse: 'bi-database',
    respect: 'bi-hand-thumbs-up',
    rancune: 'bi-emoji-angry',
};


export class Stat {
    name;
    base;
    caractere;
    materiel;
    bonus;

    get total() { 
        const total = this.base + this.caractere + this.materiel + this.bonus;
        switch (this.name) {
            case stat.ADR: return Math.min(5, total);
            default: return total;
        }
    }

    constructor(name, base = 0, caractere = 0, materiel = 0, bonus = 0){
        this.name = name;
        this.base = base;
        this.caractere = caractere;
        this.materiel = materiel;
        this.bonus = bonus;
    }
}
