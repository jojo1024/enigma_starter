import { z } from 'zod';

export interface Residence {
    residenceId: number;
    residenceNom: string;
    residenceDescription?: string;
    residenceImages: string[];
    residencePrixDeBase: number;
    residenceTelephone: string;
    residenceEmail: string;
    residenceAdresse?: string;
    residenceLocalisation?: {
        latitude: number;
        longitude: number;
    };
    status: number;
    residenceDateCreation: Date;
    residenceDateModification: Date;
}

export interface FormErrors {
    nom?: string;
    description?: string;
    prix?: string;
    adresse?: string;
    telephone?: string;
    email?: string;
    images?: string;
    [key: string]: string | undefined;
}

export interface ResidenceFormProps {
    currentResidence: Residence | null;
    editMode: boolean;
    formErrors: FormErrors;
    onFormChange: (field: keyof Residence, value: any) => void;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
}

export interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}

export const residenceSchema = z.object({
    residenceNom: z.string().min(1, "Le nom est requis"),
    residenceDescription: z.string().optional(),
    residencePrixDeBase: z.number().min(10000, "Le prix minimum est de 10000 F CFA"),
    residenceTelephone: z.string().min(1, "Le téléphone est requis"),
    residenceEmail: z.string().email("Email invalide"),
    residenceAdresse: z.string().optional(),
    residenceLocalisation: z.object({
        latitude: z.number(),
        longitude: z.number()
    }).optional(),
    residenceImages: z.array(z.string()).min(1, "Au moins une image est requise")
});

// ... rest of the types ... 