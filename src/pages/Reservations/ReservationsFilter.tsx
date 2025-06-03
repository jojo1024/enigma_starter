import React from 'react';
import { Residence } from '../../utils/types';
import { FormInput, FormSelect } from '../../base-components/Form';
import Litepicker from '../../base-components/Litepicker';


interface ReservationFilterProps {
  filters: {
    searchTerm: string;
    status: string;
    residence: number | "all";
    dateStart: string;
    dateEnd: string;
  };
  residences: Residence[];
  onFilterChange: (field: string, value: any) => void;
}

const ReservationFilter: React.FC<ReservationFilterProps> = ({ 
  filters, 
  residences, 
  onFilterChange 
}) => {
  return (
    <div className="grid grid-cols-12 gap-6 mt-5">
      {/* Filtre de recherche */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-3 intro-y">
        <FormInput
          type="text"
          placeholder="Rechercher..."
          value={filters.searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
          className="shadow-md"
        />
      </div>
      
    
      
      {/* Filtre de résidence */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-3 intro-y">
        <FormSelect
          value={filters.residence === "all" ? "all" : filters.residence.toString()}
          onChange={(e) => onFilterChange('residence', e.target.value === "all" ? "all" : parseInt(e.target.value, 10))}
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
      
      {/* Filtres de date */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-3 intro-y">
        <div className="flex">
          <div className="w-full mr-1">
            <Litepicker
              value={filters.dateStart}
              onChange={(date) => onFilterChange('dateStart', date)}
              options={{
                autoApply: true,
                singleMode: true,
                numberOfColumns: 1,
                numberOfMonths: 1,
                format: "YYYY-MM-DD",
                dropdowns: {
                  minYear: 2023,
                  maxYear: 2026,
                  months: true,
                  years: true,
                },
                // placeholder: "Date début",
              }}
              className="block w-full shadow-md"
            />
          </div>
          <div className="w-full ml-1">
            <Litepicker
              value={filters.dateEnd}
              onChange={(date) => onFilterChange('dateEnd', date)}
              options={{
                autoApply: true,
                singleMode: true,
                numberOfColumns: 1,
                numberOfMonths: 1,
                format: "YYYY-MM-DD",
                dropdowns: {
                  minYear: 2023,
                  maxYear: 2026,
                  months: true,
                  years: true,
                },
                // placeholder: "Date fin",
              }}
              className="block w-full shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationFilter;