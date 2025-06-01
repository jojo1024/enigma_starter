import { z } from "zod";

// Enum pour le statut de la chambre
export enum ChambreStatus {
    DISPONIBLE = 1,
    OCCUPEE = 2,
    MAINTENANCE = 3,
}
// Schéma pour la création d'une chambre
export const CreateChambreSchema = z.object({
    chambreConfigId: z.number().positive("L'ID de la configuration est requis"),
    chambreNom: z.string().min(1, "Le nom de la chambre est requis"),
    etatChambre: z.enum(["DISPONIBLE", "OCCUPEE", "MAINTENANCE"]),
});

// Schéma pour la mise à jour d'une chambre
export const UpdateChambreSchema = CreateChambreSchema.partial();

// Schéma complet d'une chambre
export const ChambreSchema = CreateChambreSchema.extend({
    chambreId: z.number().positive(),
    chambreDateCreation: z.date(),
    chambreDateModification: z.date(),
});

// Types générés à partir des schémas Zod
export type CreateChambre = z.infer<typeof CreateChambreSchema>;
export type UpdateChambre = z.infer<typeof UpdateChambreSchema>;
export type Chambre = z.infer<typeof ChambreSchema>;

export interface IChambre {
    chambreId: number;
    chambreConfigId: number;
    chambreNom: string;
    chambreDateCreation: string;
    chambreDateModification: string;
    etatChambre: "DISPONIBLE" | "OCCUPEE" | "MAINTENANCE";
    configChambreNom: string;
    configCapaciteAdultes: number;
    typeChambreId: number;
    typeChambreNom: string;
    residenceNom: string;
    residenceId: number;
}

// Enum pour le statut
// export enum ChambreStatus {
//     INACTIVE = 0,
//     ACTIVE = 1,
//     MAINTENANCE = 2,
// } 