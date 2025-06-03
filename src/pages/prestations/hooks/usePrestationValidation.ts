import { Prestation } from '../../../schema/prestation.schema';
import { FormErrors } from '../../../utils/types';

export const usePrestationValidation = () => {
    const validateForm = (prestation: Prestation): FormErrors => {
        const errors: FormErrors = {};

        if (!prestation.prestationNom?.trim()) {
            errors.prestationNom = 'Le nom de la prestation est requis';
        }

        if (prestation.prestationNom && prestation.prestationNom.length < 3) {
            errors.prestationNom = 'Le nom doit contenir au moins 3 caractères';
        }

        if (prestation.prestationDescription && prestation.prestationDescription.length > 500) {
            errors.prestationDescription = 'La description ne doit pas dépasser 500 caractères';
        }

        return errors;
    };

    return { validateForm };
}; 