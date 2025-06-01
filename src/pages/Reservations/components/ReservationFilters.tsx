import React from 'react';
import { Tab } from '../../../base-components/Headless';
import { Residence } from '../../../schema/residence.schema';
import Lucide from '../../../base-components/Lucide';
import { formatCurrency } from '../../../utils/functions';
import { FormInput, FormSelect } from '../../../base-components/Form';
import Litepicker from '../../../base-components/Litepicker';
import Button from '../../../base-components/Button';

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
    const resetFilters = () => {
        setSearchTerm('');
        setResidenceFilter('all');
        setStatusFilter('all');
        setDateRange({ start: '', end: '' });
        setPriceRange({ min: 0, max: 0 });
        setNightsRange({ min: 0, max: 0 });
        setGuestsRange({ min: 0, max: 0 });
    };

    return (
        <div className="intro-y mt-4">
            {/* En-tête avec titre et bouton d'export */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Gestion des réservations</h2>
                <button
                    onClick={onExport}
                    className="btn btn-outline-primary"
                >
                    <Lucide icon="Download" className="w-4 h-4 mr-2" />
                    Exporter
                </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                <div className="flex items-center gap-4">
                </div>

                {/* Toggle de vue */}
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

            {/* Filtres */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg ">
                {/* Barre de recherche */}
                <div className="lg:col-span-2">
                    <FormInput
                        type="text"
                        placeholder="Rechercher par nom, email ou téléphone..."
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
                    <button
                        onClick={resetFilters}
                        className="flex btn btn-outline-secondary whitespace-nowrap"
                    >
                        <Lucide icon="RefreshCw" className="w-4 h-4 mr-2" />
                        Vider
                    </button>
                </div>

                {/* Filtre par dates */}
                <div className="lg:col-span-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-500">Date de début</label>
                            <Litepicker
                                value={dateRange.start}
                                onChange={(date) => setDateRange({ ...dateRange, start: date })}
                                options={{
                                    format: 'DD/MM/YYYY',
                                    singleMode: true,
                                    lang: 'fr-FR',
                                }}
                                getRef={(el) => { }}
                                placeholder="Date début"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500">Date de fin</label>
                            <Litepicker
                                value={dateRange.end}
                                onChange={(date) => setDateRange({ ...dateRange, end: date })}
                                options={{
                                    format: 'DD/MM/YYYY',
                                    singleMode: true,
                                    lang: 'fr-FR',
                                }}
                                getRef={(el) => { }}
                                placeholder="Date fin"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationFilters; 