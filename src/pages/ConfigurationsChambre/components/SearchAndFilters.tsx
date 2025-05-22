import React from 'react';
import { FormInput, FormSelect } from '../../../base-components/Form';
import Button from '../../../base-components/Button';
import Lucide from '../../../base-components/Lucide';
import type { Residence, TypeChambre } from '../types';

interface SearchAndFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterResidence: number | "all";
    onFilterResidenceChange: (value: number | "all") => void;
    filterType: number | "all";
    onFilterTypeChange: (value: number | "all") => void;
    onAddClick: () => void;
    residences: Residence[];
    typesChambre: TypeChambre[];
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
    searchTerm,
    onSearchChange,
    filterResidence,
    onFilterResidenceChange,
    filterType,
    onFilterTypeChange,
    onAddClick,
    residences,
    typesChambre,
}) => {
    return (
        <>
            <div className="flex flex-col items-start mt-8 intro-y sm:flex-row sm:items-center sm:justify-between">
                <h2 className="mr-auto text-lg font-medium">Configurations de Chambres</h2>
                <div className="flex w-full sm:w-auto sm:flex-row gap-2">
                    <FormInput
                        type="text"
                        placeholder="Rechercher une configuration..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="flex-1 shadow-md"
                    />
                    <Button
                        variant="primary"
                        onClick={onAddClick}
                        className="shadow-md whitespace-nowrap"
                    >
                        <Lucide icon="Plus" className="w-4 h-4 mr-1" /> Ajouter une configuration
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="col-span-12 intro-y sm:col-span-6 xl:col-span-3">
                    <FormSelect
                        value={filterResidence === "all" ? "all" : filterResidence.toString()}
                        onChange={(e) => onFilterResidenceChange(e.target.value === "all" ? "all" : parseInt(e.target.value, 10))}
                        className="shadow-md"
                    >
                        <option value="all">Toutes les résidences</option>
                        {residences.map((residence) => (
                            <option key={residence.residenceId} value={residence.residenceId}>
                                {residence.residenceNom}
                            </option>
                        ))}
                    </FormSelect>
                </div>
                <div className="col-span-12 intro-y sm:col-span-6 xl:col-span-3">
                    <FormSelect
                        value={filterType === "all" ? "all" : filterType.toString()}
                        onChange={(e) => onFilterTypeChange(e.target.value === "all" ? "all" : parseInt(e.target.value, 10))}
                        className="shadow-md"
                    >
                        <option value="all">Tous les types de chambre</option>
                        {typesChambre.map((type) => (
                            <option key={type.typeChambreId} value={type.typeChambreId}>
                                {type.typeChambreNom}
                            </option>
                        ))}
                    </FormSelect>
                </div>
            </div>
        </>
    );
};

export default SearchAndFilters; 