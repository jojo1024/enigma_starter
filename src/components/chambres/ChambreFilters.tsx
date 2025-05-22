import React from 'react';
import Button from '../../base-components/Button';
import Lucide from '../../base-components/Lucide';
import { ChambreStatus } from '../../schema/chambre.schema';

interface ChambreFiltersProps {
    searchTerm: string;
    selectedResidence: number;
    selectedType: number;
    selectedStatus: ChambreStatus | 0;
    residences: { residenceId: number; residenceNom: string }[];
    typesChambre: { typeChambreId: number; typeChambreNom: string }[];
    onSearchChange: (value: string) => void;
    onResidenceChange: (value: number) => void;
    onTypeChange: (value: number) => void;
    onStatusChange: (value: ChambreStatus | 0) => void;
}

const ChambreFilters: React.FC<ChambreFiltersProps> = ({
    searchTerm,
    selectedResidence,
    selectedType,
    selectedStatus,
    residences,
    typesChambre,
    onSearchChange,
    onResidenceChange,
    onTypeChange,
    onStatusChange
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="relative">
                <input
                    type="text"
                    className="form-control pl-10"
                    placeholder="Rechercher une chambre..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <Lucide
                    icon="Search"
                    className="absolute inset-y-0 left-0 w-4 h-4 my-auto ml-3 text-gray-500"
                />
            </div>

            <div>
                <select
                    className="form-select"
                    value={selectedResidence}
                    onChange={(e) => onResidenceChange(Number(e.target.value))}
                >
                    <option value={0}>Toutes les résidences</option>
                    {residences.map((residence) => (
                        <option key={residence.residenceId} value={residence.residenceId}>
                            {residence.residenceNom}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <select
                    className="form-select"
                    value={selectedType}
                    onChange={(e) => onTypeChange(Number(e.target.value))}
                >
                    <option value={0}>Tous les types</option>
                    {typesChambre.map((type) => (
                        <option key={type.typeChambreId} value={type.typeChambreId}>
                            {type.typeChambreNom}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(Number(e.target.value) as ChambreStatus | 0)}
                >
                    <option value={0}>Tous les états</option>
                    <option value={ChambreStatus.DISPONIBLE}>Disponible</option>
                    <option value={ChambreStatus.OCCUPEE}>Occupée</option>
                    <option value={ChambreStatus.MAINTENANCE}>En maintenance</option>
                </select>
            </div>
        </div>
    );
};

export default ChambreFilters; 