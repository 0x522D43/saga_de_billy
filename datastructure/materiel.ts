'use strict';

import { Books } from './book';
import { Stat } from './stat';

export enum MaterielType {
    Arme,
    Equipement,
    Outil
}

export type Materiel<book extends Books> = Partial<Stat<book>> & {
    type: MaterielType;
    name: string;
};

export class MaterielFDCN {
            static readonly Epee: Materiel<Books.FDCN> = { type: MaterielType.Arme, name: 'L\'Epée', habilete: 4 };
            static readonly Lance: Materiel<Books.FDCN> = { type: MaterielType.Arme, name: 'La Lance', habilete: 3, adresse: 1 };
            static readonly Morgenstern: Materiel<Books.FDCN> = { type: MaterielType.Arme, name: 'La Morgenstern', habilete: 1, endurence: 1, degats: 1 };
            static readonly Arc: Materiel<Books.FDCN> = { type: MaterielType.Arme, name: 'L\'Arc', habilete: 3, adresse: 1, critique: 4 }; // pas d'utilisation avec d'autres armes
            static readonly CotteDeMaille: Materiel<Books.FDCN> = { type: MaterielType.Equipement, name: 'La Cotte de Maille', habilete: -1, adresse: -1, endurence: 1, armure: 1 };
            static readonly Marmitte: Materiel<Books.FDCN> = { type: MaterielType.Equipement, name: 'La Marmitte', endurence: 2, armure: 1 };
            static readonly PanphletTouristique: Materiel<Books.FDCN> = { type: MaterielType.Equipement, name: 'Le Panphlet Touristique', chance: 4 };
            static readonly KitDeSoin: Materiel<Books.FDCN> = { type: MaterielType.Equipement, name: 'Le Kit de Soin', chance: 1 }; // double le regain de PV
            static readonly Fourche: Materiel<Books.FDCN> = { type: MaterielType.Outil, name: 'La Fourche', habilete: 1, endurence: 3 }; // même limite que pour les armes
            static readonly Dague: Materiel<Books.FDCN> = { type: MaterielType.Outil, name: 'La Dague', habilete: 1, critique: 6 }; // habilite=0 si equipé avec l'arc
            static readonly KitDEscalade: Materiel<Books.FDCN> = { type: MaterielType.Outil, name: 'Le Kit d\'Escalade', adresse: 1 };
            static readonly SacDeGrain: Materiel<Books.FDCN> = { type: MaterielType.Outil, name: 'Le Sac de Grain', endurence: 2, chance: 2 };
};
export class MaterielCDSI { 
            static readonly Sabre: Materiel<Books.CDSI> = { type: MaterielType.Arme, name: 'Le Sabre', habilete: 3, critique: 2  };
            static readonly Lance: Materiel<Books.CDSI> = { type: MaterielType.Arme, name: 'La Lance', habilete: 3, adresse: 1 };
            static readonly Pioche: Materiel<Books.CDSI> = { type: MaterielType.Arme, name: 'La Pioche', habilete: 2, PointVieMax: 2, degats: 1 };
            static readonly Arc: Materiel<Books.CDSI> = { type: MaterielType.Arme, name: 'L\'Arc', habilete: 3, adresse: 1, critique: 4 }; // pas d'utilisation avec d'autres arme
            static readonly CotteDeMaille: Materiel<Books.CDSI> = { type: MaterielType.Equipement, name: 'La Cotte de Maille', habilete: -1, adresse: -1, endurence: 1, armure: 2 };
            static readonly Sceau: Materiel<Books.CDSI> = { type: MaterielType.Equipement, name: 'Le Sceau', endurence: 1, armure: 1, PointVieMax: 2 };
            static readonly GuideTouristique: Materiel<Books.CDSI> = { type: MaterielType.Equipement, name: 'Le Guide Touristique', chance: 3 }; // double le regain de chanc
            static readonly BoiteDeCrayon: Materiel<Books.CDSI> = { type: MaterielType.Equipement, name: 'La Boîte de Crayon', chance: 2, critique: 1 };
            static readonly FleauAGrains: Materiel<Books.CDSI> = { type: MaterielType.Outil, name: 'Le Fléau à Grains', habilete: 1, endurence: 2, PointVieMax: 2 }; // même limite que pour les arme
            static readonly CouteauCeremoniel: Materiel<Books.CDSI> = { type: MaterielType.Outil, name: 'Le Couteau Cérémoniel', habilete: 1, critique: 5, richesse: 1 }; // habilite=0 si equipé avec l'ar
            static readonly FiletDePeche: Materiel<Books.CDSI> = { type: MaterielType.Outil, name: 'Le Filet de Pêche', endurence: 1, adresse: 1 };
            static readonly SacDeGrain: Materiel<Books.CDSI> = { type: MaterielType.Outil, name: 'Le Sac de Grain', endurence: 2, chance: 2 };
};