import React from "react";
import { FormInline, FormInput, FormLabel } from "../base-components/Form";

interface GenericFormInputProps {
  label: string; // Texte du label
  id: string; // Identifiant unique pour le champ
  type?: string; // Type de l'input (par défaut: "text")
  placeholder?: string; // Placeholder pour l'input
  className?: string; // Classes CSS supplémentaires pour personnalisation
  value?: string | number; // Valeur de l'input
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Gestionnaire de changement
  required?: boolean;
  error?: string;
}

const GenericFormInput: React.FC<GenericFormInputProps> = ({
  label,
  id,
  type = "text",
  placeholder = "",
  className = "",
  value,
  onChange,
  required = false,
  error
}) => {
  return (
    <FormInline className={`flex-col items-start ${className}`}>
      <FormLabel className="">
        <div className="text-left">
          <div className="flex items-center">
            <div className="">{label}{required && <span className='pl-1 text-red-600'>*</span>}</div>
          </div>
        </div>
      </FormLabel>
      <div className="flex-1 w-full sm:mt-3 xl:mt-0 font-medium">
        <FormInput
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          className={`${className} ${error ? 'border-red-500' : ''}`}
          value={value}
          onChange={onChange}
        />
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        {/* Vous pouvez décommenter ou personnaliser l'aide si nécessaire */}
        {/* <FormHelp className="text-right">Maximum character 0/70</FormHelp> */}
      </div>
    </FormInline>
  );
};

export default GenericFormInput;
