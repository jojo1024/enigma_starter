import { Prestation } from '../../../schema/prestation.schema';

export interface FormErrors {
    prestationNom?: string;
    prestationDescription?: string;
    prestationImages?: string;
    status?: string;
}

export interface PrestationState {
    prestations: Prestation[];
    loading: boolean;
    error: string | null;
}

export interface PrestationFormProps {
    currentPrestation: Prestation;
    editMode: boolean;
    formErrors: FormErrors;
    onFormChange: (field: keyof Prestation, value: any) => void;
    onSave: () => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
    selectedImages: File[];
    previewUrls: string[];
    onImageChange: (files: File[]) => void;
    onRemoveImage: (index: number) => void;
}

export interface PrestationCardProps {
    prestation: Prestation;
    activeImageIndex: number;
    onEdit: (prestation: Prestation) => void;
    onDelete: (prestationId: number) => void;
    onRestore: (prestationId: number) => void;
    onNextImage: (prestationId: number) => void;
    onPrevImage: (prestationId: number) => void;
}

export interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isDeleting: boolean;
} 