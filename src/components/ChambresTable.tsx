
// ChambresTable.tsx - Le composant de tableau
import React, { useState } from "react";
import Lucide from "../base-components/Lucide";
import { getStatusClass } from "../utils/functions";

// types.ts - Définition des types
export interface Chambre {
  id: number | null;
  typeChambre: string;
  numChambre: string;
  statutChambre: "Disponible" | "Occupée" | "Réservée" | "Maintenance";
  balcon: boolean;
}

export type SortDirection = "ascending" | "descending";

export interface SortConfig {
  key: keyof Chambre;
  direction: SortDirection;
}

interface ChambresTableProps {
  chambres: Chambre[];
  onEdit: (chambre: Chambre) => void;
  onDelete: (id: number) => void;
}

const ChambresTable: React.FC<ChambresTableProps> = ({ chambres, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "numChambre",
    direction: "ascending"
  });

  // Fonction de tri
  const requestSort = (key: keyof Chambre): void => {
    let direction: SortDirection = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Fonction de filtrage
  const filteredChambres = chambres.filter((chambre) => {
    return (
      chambre.typeChambre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chambre.numChambre.toString().includes(searchTerm) ||
      chambre.statutChambre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Fonction de tri
  const sortedChambres = [...filteredChambres].sort((a, b) => {
    // @ts-ignore
    if (a[sortConfig?.key] < b[sortConfig?.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    // @ts-ignore
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Fonction pour obtenir l'icône de tri
  const getSortIcon = (columnName: keyof Chambre): JSX.Element => {
    if (sortConfig.key !== columnName) {
      return <Lucide icon="ArrowUpDown" className="w-4 h-4 ml-2 opacity-50" />;
    }
    return sortConfig.direction === "ascending" ? (
      <Lucide icon="ArrowUp" className="w-4 h-4 ml-2 text-primary" />
    ) : (
      <Lucide icon="ArrowDown" className="w-4 h-4 ml-2 text-primary" />
    );
  };



  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header avec recherche */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Gestion des Chambres
        </h2>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lucide icon="Search" className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 font-medium cursor-pointer"
                onClick={() => requestSort("typeChambre")}
              >
                <div className="flex items-center">
                  Type de Chambre
                  {getSortIcon("typeChambre")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-medium cursor-pointer"
                onClick={() => requestSort("numChambre")}
              >
                <div className="flex items-center">
                  N° de Chambre
                  {getSortIcon("numChambre")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-medium cursor-pointer"
                onClick={() => requestSort("statutChambre")}
              >
                <div className="flex items-center">
                  Statut
                  {getSortIcon("statutChambre")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-medium cursor-pointer"
                onClick={() => requestSort("balcon")}
              >
                <div className="flex items-center">
                  Balcon
                  {getSortIcon("balcon")}
                </div>
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedChambres.length > 0 ? (
              sortedChambres.map((chambre) => (
                <tr
                  key={chambre.id as number}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {chambre.typeChambre}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {chambre.numChambre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(chambre.statutChambre)}`}>
                      {chambre.statutChambre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {chambre.balcon ?
                      <Lucide icon="Check" className="w-5 h-5 text-green-600 dark:text-green-400" /> :
                      <Lucide icon="X" className="w-5 h-5 text-red-600 dark:text-red-400" />
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onEdit(chambre)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <Lucide icon="Edit" className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => chambre.id !== null && onDelete(chambre.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        <Lucide icon="Trash" className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center">
                    <Lucide icon="Search" className="w-10 h-10 mb-2 opacity-20" />
                    <p>Aucune chambre trouvée</p>
                    {searchTerm && (
                      <p className="mt-1">Essayez de modifier votre recherche</p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer avec pagination */}
      <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Affichage de <span className="font-medium">{sortedChambres.length}</span> sur <span className="font-medium">{chambres.length}</span> chambres
        </div>
        <div className="flex space-x-1">
          <button className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            Précédent
          </button>
          <button className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-md text-white bg-primary border border-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:hover:bg-primary-dark">
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChambresTable;