import { z } from "zod";

// Schéma pour la création d'un utilisateur
export const CreateUtilisateurSchema = z.object({
    utilisateurNom: z.string().min(1, "Le nom de l'utilisateur est requis"),
    utilisateurEmail: z.string().email("L'email doit être valide").optional(),
    utilisateurMotDePasse: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    utilisateurTelephone: z.string().optional(),
    status: z.number().min(0).max(1).default(1),
    roleUtilisateurId: z.number().positive("L'ID du rôle est requis"),
    motDePasseInitial: z.string().optional(),
    motDePasseDejaChange: z.number(),
    residenceId: z.number().positive("L'ID du site est requis"),
});

// Schéma pour la mise à jour d'un utilisateur
export const UpdateUtilisateurSchema = CreateUtilisateurSchema.partial();

// Schéma complet d'un utilisateur
export const UtilisateurSchema = CreateUtilisateurSchema.extend({
    utilisateurId: z.number().positive(),
    roleUtilisateurNom: z.string(),
    utilisateurDateCreation: z.date(),
    utilisateurDateModification: z.date(),
});

// Types générés à partir des schémas Zod
export type CreateUtilisateur = z.infer<typeof CreateUtilisateurSchema>;
export type UpdateUtilisateur = z.infer<typeof UpdateUtilisateurSchema>;
export type Utilisateur = z.infer<typeof UtilisateurSchema>;

// Enum pour le statut
export enum UtilisateurStatus {
    INACTIVE = 0,
    ACTIVE = 1,
}

// Enum pour le statut
export enum MotDePasseStatus {
    UTILISE = 1,
    NON_UTILISE = 0,
}

// Enum pour les rôles (basé sur la table RolesUtilisateur)
export enum RoleUtilisateur {
    ADMIN = 1,
    CAISSIER = 2,
} 

export const ROLES = [
    { id: RoleUtilisateur.ADMIN, nom: 'ADMIN' },
    { id: RoleUtilisateur.CAISSIER, nom: 'CAISSIER' },
];