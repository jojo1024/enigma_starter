import React from 'react';
import { CreateUtilisateur } from '../../../schema/utilisateur.schema';
import GenericFormInput from '../../../components/GenericFormInput';
import CustomSelect from '../../../components/CustomSelect';
import { ROLES } from '../../../schema/utilisateur.schema';

interface UtilisateurFormProps {
    utilisateurFormData: CreateUtilisateur;
    errors: { [key: string]: string };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange: (e: { id: string, value: number }) => void;
    residences: any[];
    message: string;
}

const UtilisateurForm: React.FC<UtilisateurFormProps> = ({
    utilisateurFormData,
    errors,
    handleInputChange,
    handleSelectChange,
    residences,
    message
}) => {
    return (
        <div className="w-full h-[350px] rounded-lg rounded-t-lg overflow-y-auto">
            {message !== "null" && <div className='text-red-600 my-2'>{message}</div>}
            <div className='mt-4'>
                <GenericFormInput
                    label="Nom de l'utilisateur"
                    id="utilisateurNom"
                    placeholder="Nom de l'utilisateur"
                    value={utilisateurFormData?.utilisateurNom}
                    onChange={handleInputChange}
                    className='mb-2'
                    required
                    error={errors.utilisateurNom}
                />

                <GenericFormInput
                    label="Téléphone de l'utilisateur"
                    id="utilisateurTelephone"
                    placeholder="Téléphone de l'utilisateur"
                    value={utilisateurFormData?.utilisateurTelephone}
                    onChange={handleInputChange}
                    className='mb-2'
                    type='number'
                    required
                    error={errors.utilisateurTelephone}
                />

                <div className="">
                    <CustomSelect
                        label="Rôle de l'utilisateur"
                        data={ROLES}
                        keys={["id", "nom"]}
                        onChange={handleSelectChange}
                        id="roleUtilisateurId"
                        valuesSelected={utilisateurFormData.roleUtilisateurId}
                        required
                        error={errors.roleUtilisateurId}
                    />
                </div>

                <div className="">
                    <CustomSelect
                        label="Site de l'utilisateur"
                        data={residences}
                        keys={["residenceId", "residenceNom"]}
                        onChange={handleSelectChange}
                        id="residenceId"
                        valuesSelected={utilisateurFormData.residenceId}
                        required
                        error={errors.residenceId}
                    />
                </div>
            </div>
        </div>
    );
};

export default UtilisateurForm; 