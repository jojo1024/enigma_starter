import { Residence } from '../../../schema/residence.schema';
import { FormErrors } from '../types';

export const useResidenceValidation = () => {
    const validateForm = (residence: Partial<Residence>): FormErrors => {
        const errors: FormErrors = {};

        if (!residence.residenceNom?.trim()) {
            errors.nom = "Le nom est requis";
        }

        if (!residence.residenceDescription?.trim()) {
            errors.description = "La description est requise";
        }

        if (!residence.residencePrixDeBase || residence.residencePrixDeBase < 10000) {
            errors.prix = "Le prix doit être d'au moins 10 000 F CFA";
        }

        if (!residence.residenceAdresse?.trim()) {
            errors.adresse = "L'adresse est requise";
        }

        // const phoneRegex = /^\+225 \d{2} \d{2} \d{2} \d{2}$/;
        // if (!phoneRegex.test(residence.residenceTelephone || '')) {
        //     errors.telephone = "Le format du téléphone doit être: +225 XX XX XX XX";
        // }

        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(residence.residenceEmail || '')) {
        //     errors.email = "L'email n'est pas valide";
        // }

        if (!residence.residenceImages || residence.residenceImages.length === 0) {
            errors.images = "Au moins une image est requise";
        }

        // if (residence.residenceLocalisation) {
        //     if (isNaN(residence.residenceLocalisation.latitude) || 
        //         residence.residenceLocalisation.latitude < -90 || 
        //         residence.residenceLocalisation.latitude > 90) {
        //         errors.latitude = "La latitude doit être comprise entre -90 et 90";
        //     }
        //     if (isNaN(residence.residenceLocalisation.longitude) || 
        //         residence.residenceLocalisation.longitude < -180 || 
        //         residence.residenceLocalisation.longitude > 180) {
        //         errors.longitude = "La longitude doit être comprise entre -180 et 180";
        //     }
        // }

        return errors;
    };

    return { validateForm };
}; 