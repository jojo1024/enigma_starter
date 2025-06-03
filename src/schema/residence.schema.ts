// schemas/residence.schema.ts
import { z } from "zod";

// Schéma pour les coordonnées de localisation
const LocalisationSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    adresse: z.string().optional(),
});

// Schéma pour les images
const ImageSchema = z.object({
    filename: z.string(),
    principale: z.boolean().optional().default(false),
    data: z.string().optional(),
});

// Schéma pour la création d'une résidence
export const CreateResidenceSchema = z.object({
    residenceId: z.number(),
    residenceNom: z.string().min(1, "Le nom de la résidence est requis"),
    residenceDescription: z.string().optional(),
    residenceAdresse: z.string().optional(),
    residenceTelephone: z.string().optional(),
    residenceEmail: z.string().email("Format d'email invalide").optional(),
    residenceImages: z.array(ImageSchema).optional(),
    residencePrixDeBase: z.number().nonnegative().default(0),
    residenceLocalisation: LocalisationSchema.optional(),
});

// Schéma pour la mise à jour d'une résidence
export const UpdateResidenceSchema = CreateResidenceSchema.partial().extend({
    status: z.number().min(0).max(1).optional(),
});

// Schéma complet d'une résidence
export const ResidenceSchema = CreateResidenceSchema.extend({
    residenceId: z.number().positive(),
    status: z.number().min(0).max(1).default(1),
    residenceDateCreation: z.date(),
    residenceDateModification: z.date(),
});

// Interface explicite pour Residence
export interface IResidence {
    residenceId: number;
    residenceNom: string;
    residenceDescription?: string;
    residenceAdresse?: string;
    residenceTelephone?: string;
    residenceEmail?: string;
    residenceImages: ResidenceImage[];
    residencePrixDeBase: number;
    residenceLocalisation?: Localisation;
    status: number;
    residenceDateCreation: Date;
    residenceDateModification: Date;
}

// Types générés à partir des schémas Zod
export type Localisation = z.infer<typeof LocalisationSchema>;
export type ResidenceImage = z.infer<typeof ImageSchema>;
export type CreateResidence = z.infer<typeof CreateResidenceSchema>;
export type UpdateResidence = z.infer<typeof UpdateResidenceSchema>;
export type Residence = IResidence;

// Enum pour le statut
export enum ResidenceStatus {
    INACTIVE = 0,
    ACTIVE = 1,
}