import { Residence } from '../../../schema/residence.schema';

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
}

export interface ResidenceCardProps {
    residence: Residence;
    activeImageIndex: number;
    onEdit: (residence: Residence) => void;
    onDelete: (residenceId: number) => void;
    onRestore: (residenceId: number) => void;
    onNextImage: (residenceId: number) => void;
    onPrevImage: (residenceId: number) => void;
}

export interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
} 