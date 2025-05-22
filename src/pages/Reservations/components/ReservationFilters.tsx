import React from 'react';
import { Tab } from '../../../base-components/Headless';
import { Residence } from '../../../schema/residence.schema';
import Lucide from '../../../base-components/Lucide';
import { formatCurrency } from '../../../utils/functions';

interface ReservationFiltersProps {
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
    dateRange: { start: string; end: string };
    setDateRange: (range: { start: string; end: string }) => void;
    priceRange: { min: number; max: number };
    setPriceRange: (range: { min: number; max: number }) => void;
    nightsRange: { min: number; max: number };
    setNightsRange: (range: { min: number; max: number }) => void;
    guestsRange: { min: number; max: number };
    setGuestsRange: (range: { min: number; max: number }) => void;
    onExport: () => void;
}

const ReservationFilters: React.FC<ReservationFiltersProps> = ({
    residences,
    residenceFilter,
    setResidenceFilter,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    tabsData,
    dateRange,
    setDateRange,
    priceRange,
    setPriceRange,
    nightsRange,
    setNightsRange,
    guestsRange,
    setGuestsRange,
    onExport,
}) => {
    return (
        <div className="intro-y">
            {/* En-tête avec titre et bouton d'export */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Gestion des réservations</h2>
                <button
                    onClick={onExport}
                    className="btn btn-outline-primary mt-2 sm:mt-0"
                >
                    <Lucide icon="Download" className="w-4 h-4 mr-2" />
                    Exporter
                </button>
            </div>

            {/* Barre de recherche principale */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                    <input
                        type="text"
                        className="form-control w-full"
                        placeholder="Rechercher par nom, email ou téléphone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-64">
                    <select
                        className="form-select w-full"
                        value={residenceFilter}
                        onChange={(e) => setResidenceFilter(e.target.value)}
                    >
                        <option value="all">Toutes les résidences</option>
                        {residences.map((residence) => (
                            <option key={residence.residenceId} value={residence.residenceId}>
                                {residence.residenceNom}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filtres avancés */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Filtre par dates */}
                <div className="flex flex-col">
                    <label className="form-label">Période</label>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            className="form-control"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                        <input
                            type="date"
                            className="form-control"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        />
                    </div>
                </div>

            </div>

            {/* Onglets de statut */}
            <div className="mt-4">
                <Tab.Group>
                    <div className="pr-1">
                        <div className="p-1 box">
                            <Tab.List variant="pills">
                                {tabsData.map(onglet => (
                                    <Tab key={onglet.id}>
                                        <Tab.Button
                                            className={`w-full flex py-2 text-xs sm:text-sm truncate ${statusFilter === onglet.id ? 'bg-primary text-white' : ''}`}
                                            as="button"
                                            onClick={() => setStatusFilter(onglet.id)}
                                        >
                                            {onglet.label} <span>({onglet.count})</span>
                                        </Tab.Button>
                                    </Tab>
                                ))}
                            </Tab.List>
                        </div>
                    </div>
                </Tab.Group>
            </div>
        </div>
    );
};

export default ReservationFilters; 