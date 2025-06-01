import React from 'react';
import { Tab } from '../../base-components/Headless';
import { Residence } from '../../schema/residence.schema';
import Lucide from '../../base-components/Lucide';
import { FormInput, FormSelect } from '../../base-components/Form';
import Button from '../../base-components/Button';
import { ChambreStatus } from '../../schema/chambre.schema';

interface ChambreFiltersProps {
    residences: Residence[];
    residenceFilter: string;
    setResidenceFilter: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    tabsData: Array<{
        id: string;
        label: string;
        count: number;
    }>;
}

const ChambreFilters: React.FC<ChambreFiltersProps> = ({
    residences,
    residenceFilter,
    setResidenceFilter,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    tabsData,
}) => {
    const resetFilters = () => {
        setSearchTerm('');
        setResidenceFilter('all');
        setStatusFilter('all');
    };

    return (
        <div className="intro-y mt-4">


            <div className="flex flex-col gap-4">

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                    <div></div>
                    {/* Tabs pour les états */}
                    <Tab.Group>
                        <div className="pr-1 intro-y">
                            <div className="p-1 box">
                                <Tab.List variant="pills">
                                    {tabsData.map((item) => (
                                        <Tab key={item.id}>
                                            <Tab.Button
                                                className={`flex text-xs items-center sm:px-4 py-2 sm:text-sm rounded-lg ${statusFilter === item.id ? 'bg-primary text-white' : ''}`}
                                                as="button"
                                                onClick={() => setStatusFilter(item.id)}
                                            >
                                                <span className="truncate">{item.label}</span>
                                                <span className="ml-2 sm:block hidden bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                                    {item.count}
                                                </span>
                                            </Tab.Button>
                                        </Tab>
                                    ))}
                                </Tab.List>
                            </div>
                        </div>
                    </Tab.Group>
                </div>


                {/* Barre de recherche et filtres */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Barre de recherche */}
                    <div className="flex-1">
                        <FormInput
                            type="text"
                            placeholder="Rechercher une chambre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Sélecteur de résidence et bouton vider */}
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <FormSelect
                                value={residenceFilter}
                                onChange={(e) => setResidenceFilter(e.target.value)}
                            >
                                <option value="all">Toutes les résidences</option>
                                {residences.map((residence) => (
                                    <option key={residence.residenceId} value={residence.residenceId}>
                                        {residence.residenceNom}
                                    </option>
                                ))}
                            </FormSelect>
                        </div>
                        <Button
                            onClick={resetFilters}
                            variant="outline-secondary"
                            className="flex whitespace-nowrap"
                        >
                            <Lucide icon="RefreshCw" className="w-4 h-4 mr-2" />
                            Vider
                        </Button>
                    </div>
                </div>



            </div>
        </div>
    );
};

export default ChambreFilters; 