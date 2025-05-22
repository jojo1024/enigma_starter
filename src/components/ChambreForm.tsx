import React from 'react';
import { IChambre, ChambreStatus } from '../schema/chambre.schema';
import GenericFormInput from './GenericFormInput';
import CustomSelect from './CustomSelect';

interface ChambreFormProps {
  chambre: Partial<IChambre>;
  errors: { [key: string]: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: { id: string, value: number }) => void;
  configChambres: { configChambreId: number; configChambreNom: string }[];
  message: string;
}

const ChambreForm: React.FC<ChambreFormProps> = ({
  chambre,
  errors,
  handleInputChange,
  handleSelectChange,
  configChambres,
  message
}) => {
  const etatChambreOptions = [
    { id: ChambreStatus.DISPONIBLE, nom: 'Disponible' },
    { id: ChambreStatus.OCCUPEE, nom: 'Occupée' },
    { id: ChambreStatus.MAINTENANCE, nom: 'En maintenance' }
  ];
  console.log("🚀 ~ etatChambreOptions:", etatChambreOptions)

  return (
    <div className="w-full h-[350px] rounded-lg rounded-t-lg overflow-y-auto">
      {message !== "null" && <div className='text-red-600 my-2'>{message}</div>}
      <div className='mt-4'>
        <GenericFormInput
          label="Nom de la chambre"
          id="chambreNom"
          placeholder="Nom de la chambre"
          value={chambre?.chambreNom || ''}
          onChange={handleInputChange}
          className='mb-2'
          required
          error={errors.chambreNom}
        />

        {/* <CustomSelect
          label="Résidence"
          data={residences}
          keys={["residenceId", "residenceNom"]}
          onChange={handleSelectChange}
          id="residenceId"
          valuesSelected={chambre.residenceId || 0}
          required
          error={errors.residenceId}
          className="mb-2"
        /> */}

        <CustomSelect
          label="Configuration de la chambre"
          data={configChambres}
          keys={["configChambreId", "configChambreNom", "residenceNom"]}
          onChange={handleSelectChange}
          id="chambreConfigId"
          valuesSelected={chambre.chambreConfigId || 0}
          required
          error={errors.chambreConfigId}
          className="mb-2"
        />

        <CustomSelect
          label="État de la chambre"
          data={etatChambreOptions}
          keys={["id", "nom"]}
          onChange={handleSelectChange}
          id="etatChambre"
          valuesSelected={chambre.etatChambre || ChambreStatus.DISPONIBLE}
          className="mb-2"
        />
      </div>
    </div>
  );
};

export default ChambreForm;