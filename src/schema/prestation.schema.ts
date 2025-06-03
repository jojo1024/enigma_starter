import { z } from "zod";

// Schéma pour les images
const ImageSchema = z.object({
    filename: z.string(),
    principale: z.boolean().optional().default(false),
    data: z.string().optional(), // en base64
});

// Schéma pour la création d'une prestation
export const CreatePrestationSchema = z.object({
    prestationNom: z.string().min(1, "Le nom de la prestation est requis"),
    prestationDescription: z.string().optional(),
    prestationImages: z.array(z.string()),
});

// Schéma pour la mise à jour d'une prestation
export const UpdatePrestationSchema = CreatePrestationSchema.partial().extend({
    prestationId: z.number(),
    status: z.number().min(0).max(1).optional(),
});

// Schéma complet d'une prestation
export const PrestationSchema = CreatePrestationSchema.extend({
    prestationId: z.number().positive(),
    status: z.number().min(0).max(1).default(1),
    prestationDateCreation: z.date(),
});

// Types générés à partir des schémas Zod
export type PrestationImage = z.infer<typeof ImageSchema>;
export type CreatePrestation = z.infer<typeof CreatePrestationSchema>;
export type UpdatePrestation = z.infer<typeof UpdatePrestationSchema>;
export type Prestation = z.infer<typeof PrestationSchema>;

// Enum pour le statut
export enum PrestationStatus {
    INACTIVE = 0,
    ACTIVE = 1,
}
