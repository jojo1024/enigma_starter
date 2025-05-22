import { z } from "zod";

// Schéma pour les images
const ImageSchema = z.object({
    filename: z.string(),
    principale: z.boolean().optional().default(false),
    data: z.string().optional(),
});

// Schéma pour la création d'une configuration de chambre
export const CreateConfigChambreSchema = z.object({
    configResidenceId: z.number().positive("L'ID de la résidence est requis"),
    configTypeChambreId: z.number().positive("L'ID du type de chambre est requis"),
    configChambreNom: z.string().min(1, "Le nom de la configuration est requis"),
    configChambreDescription: z.string().optional(),
    configChambrePrixSemaine: z.number().positive("Le prix de la semaine doit être positif"),
    configChambrePrixWeekend: z.number().positive("Le prix du weekend doit être positif"),
    configCapaciteAdultes: z.number().min(1).default(1),
    configChambreImages: z.array(z.string()).optional(),
    configAvantageChambre: z.array(z.string()).optional(),
    configEquipementChambre: z.array(z.string()).optional(),

});

// Schéma pour la création d'un type de chambre
export const CreateTypeChambreSchema = z.object({
    typeChambreId: z.number(),
    typeChambreNom: z.string(),

});

// Schéma pour la mise à jour d'une configuration de chambre
export const UpdateConfigChambreSchema = CreateConfigChambreSchema.partial().extend({
    configChambreId: z.number().positive(),
    status: z.number().min(0).max(1).optional(),
});

// Schéma complet d'une configuration de chambre
export const ConfigChambreSchema = CreateConfigChambreSchema.extend({
    configChambreId: z.number().positive(),
    status: z.number().min(0).max(1).default(1),
    configDateCreation: z.date(),
    configDateModification: z.date(),
    residenceNom: z.string(),
    residenceId: z.number(),
});

// Types générés à partir des schémas Zod
export type ConfigChambreImage = z.infer<typeof ImageSchema>;
export type CreateConfigChambre = z.infer<typeof CreateConfigChambreSchema>;
export type UpdateConfigChambre = z.infer<typeof UpdateConfigChambreSchema>;
export type ConfigChambre = z.infer<typeof ConfigChambreSchema>;
export type TypeChambre = z.infer<typeof CreateTypeChambreSchema>;

export interface IConfigChambre {
  configChambreId: number;
  configResidenceId: number;
  configTypeChambreId: number;
  configChambreNom: string;
  configChambreDescription: string;
  configChambrePrixSemaine: number;
  configChambrePrixWeekend: number;
  configCapaciteAdultes: number;
  configChambreImages: string[];
  configDateCreation: string;
  configDateModification: string;
  configAvantageChambre: string[];
  configEquipementChambre: string[];
  status: number;
  residenceNom: string;
  residenceId: number;
  typeChambreId: number;
  typeChambreNom: string;
}
// Enum pour le statut
export enum ConfigChambreStatus {
    INACTIVE = 0,
    ACTIVE = 1,
}
