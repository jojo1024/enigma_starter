
export interface Residence {
    residenceId: number;
    residenceNom: string;
}

export interface TypeChambre {
    typeChambreId: number;
    typeChambreNom: string;
}

export interface FormErrors {
    nom?: string;
    description?: string;
    prixSemaine?: string;
    prixWeekend?: string;
    capaciteAdultes?: string;
    totalChambres?: string;
    images?: string;
    residence?: string;
    type?: string;
}

