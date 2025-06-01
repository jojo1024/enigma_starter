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
    { etatChambre: "DISPONIBLE", etatChambreNom: 'DISPONIBLE' },
    { etatChambre: "OCCUPEE", etatChambreNom: 'OCCUPEE' },
    { etatChambre: "MAINTENANCE", etatChambreNom: 'MAINTENANCE' }
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
          keys={["etatChambre", "etatChambreNom"]}
          onChange={handleSelectChange}
          id="etatChambre"
          valuesSelected={chambre.etatChambre || "DISPONIBLE"}
          className="mb-2"
        />
      </div>
    </div>
  );
};

export default ChambreForm;