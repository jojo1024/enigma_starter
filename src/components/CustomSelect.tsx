import clsx from 'clsx';
import React from 'react';
import { FormLabel, FormSelect } from '../base-components/Form';



interface CustomMultipleSelectProps {
    id: string;
    label?: string;
    valuesSelected: number | string;
    onChange: any;
    // onChange: (e: React.ChangeEvent<HTMLInputElement> | string[]) => void;
    data: any[];
    keys: string[];
    selectClassName?: string;
    className?: string;
    error?: string;
    required?: boolean;
}

const CustomSelect: React.FC<CustomMultipleSelectProps> = ({
    required = false,
    error,
    id,
    label,
    valuesSelected,
    onChange,
    data,
    keys,
    className,
    selectClassName
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onChange({ id: id, value });
    };

    return (
        <div className={className}>
            {label && (
                <FormLabel htmlFor={id} className=''>
                    {label}
                    {required && <span className='pl-1 text-red-600'>*</span>}
                </FormLabel>
            )}
            <FormSelect
                id={id}
                value={valuesSelected || ""}
                onChange={handleChange}
                className={clsx([
                    selectClassName,
                    "text-[15px] font-medium",
                    error ? 'border-red-500' : ''
                ])}
            >
                <option value="" disabled>Sélectionnez une option</option>
                {data.map(item => (
                    <option key={item[keys[0]]} value={item[keys[0]]}>
                        {item[keys[1]]} {item[keys[2]] && `- ${item[keys[2]]}`}
                    </option>
                ))}
            </FormSelect>
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>
    );
};

export default CustomSelect;
