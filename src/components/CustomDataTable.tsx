import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { FormCheck } from '../base-components/Form';
import { Pagination } from './Pagination';
import Lucide from '../base-components/Lucide';
import Button from '../base-components/Button';

export interface TableColumn<T> {
  header: string;
  accessor?: keyof T;
  renderCell?: (value: any, row: T, onChange: (newValue: any) => void) => React.ReactNode;
  visible?: boolean;
  className?: string;
  width?: string;
  tableTextPosition?: string;
}

interface CustomDataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  dataInitial?: T[];
  rowKey: (row: T) => React.Key;
  selectedRows?: T[];
  onSelectRow?: (row: T) => void;
  onSelectAllRows?: (checked: boolean) => void;
  onRowDoubleClick?: (item: T) => void;
  onDeleteSelectRows?: () => void;
  onRowUpdate?: (updatedRow: T) => void;
  headerClassname?: string;
  tableClassname?: string;
  startIndex?: number;
  endIndex?: number;
  pageIndex?: number;
  setPageIndex?: (index: number) => void;
  pageCount?: number;
  className?: string;
  loading?: boolean;
  noDataMessage?: string;
  search?: string;
  setSearch?: (value: string) => void;
  showSearchBar?: boolean;
}

const CustomDataTable = <T,>({
  data,
  columns,
  dataInitial,
  rowKey,
  selectedRows = [],
  onSelectRow,
  onSelectAllRows,
  onRowDoubleClick,
  onDeleteSelectRows,
  onRowUpdate,
  headerClassname = '',
  tableClassname = '',
  startIndex = 0,
  endIndex = data.length,
  pageIndex = 0,
  setPageIndex,
  pageCount = 1,
  className = '',
  loading = false,
  noDataMessage = 'Aucune donnée disponible',
  search,
  setSearch,
  showSearchBar = false
}: CustomDataTableProps<T>) => {
  const [allSelected, setAllSelected] = useState(false);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<TableColumn<T>[]>([]);

  // Initialiser les colonnes visibles
  useEffect(() => {
    setVisibleColumns(columns.filter(col => col.visible !== false));
  }, [columns]);

  // Mettre à jour l'état "tous sélectionnés" lorsque les lignes sélectionnées changent
  useEffect(() => {
    if (onSelectAllRows) {
      setAllSelected(data.length > 0 && selectedRows.length === data.length);
    }
  }, [selectedRows, data, onSelectAllRows]);

  // Fonction qui vérifie si une ligne (row) est sélectionnée
  const isRowSelected = (item: T) => selectedRows.some(selectedItem => rowKey(selectedItem) === rowKey(item));
  
  // Fonction qui vérifie si toutes les lignes (row) sont sélectionnées
  const allRowsSelected = data.length > 0 && data.every(row => isRowSelected(row));
  
  // Fonction qui vérifie si au moins une ligne (row) est sélectionnée
  const isAnyRowSelected = selectedRows.length > 0;

  // Gérer le clic sur "tout sélectionner"
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAllSelected(checked);
    onSelectAllRows && onSelectAllRows(checked);
  };

  // Gérer le changement d'entrée pour l'édition des cellules
  const handleInputChange = (key: React.Key, field: keyof T, newValue: any) => {
    const updatedRow = selectedRows.find(row => rowKey(row) === key);
    if (updatedRow) {
      (updatedRow[field] as any) = newValue;
      onRowUpdate && onRowUpdate(updatedRow);
    }
  };

  // Toggle column visibility
  const toggleColumnVisibility = (index: number) => {
    const newVisibleColumns = [...visibleColumns];
    newVisibleColumns[index].visible = !newVisibleColumns[index].visible;
    setVisibleColumns(newVisibleColumns);
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (setPageIndex && newPage >= 0 && newPage < pageCount) {
      setPageIndex(newPage);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Contrôles du tableau (optionnels) */}
      {(isAnyRowSelected || showSearchBar || true) && (
        <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            {isAnyRowSelected && onDeleteSelectRows && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={onDeleteSelectRows}
                className="mr-2"
              >
                <Lucide icon="Trash" className="w-4 h-4 mr-1" />
                Supprimer ({selectedRows.length})
              </Button>
            )}
            
            <div className='ml-3 my-1 text-sm'>
              Total: <span className='mr-5 font-bold'>{data?.length}</span>
              {isAnyRowSelected && (
                <>Sélectionnés: <span className='font-bold'>{selectedRows.length}</span></>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            {showSearchBar && setSearch && (
              <input
                type="text"
                className="form-control mr-2"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            )}
            
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowColumnSettings(!showColumnSettings)}
            >
              <Lucide icon="Columns" className="w-4 h-4 mr-1" />
              Colonnes
            </Button>
            
            {/* Menu des colonnes */}
            {showColumnSettings && (
              <div className="absolute right-0 top-12 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                <ul className="py-1">
                  {visibleColumns.map((column, index) => (
                    <li key={index} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <FormCheck.Input
                        id={`col-${index}`}
                        type="checkbox"
                        checked={column.visible !== false}
                        onChange={() => toggleColumnVisibility(index)}
                        className="mr-2"
                      />
                      <label htmlFor={`col-${index}`} className="cursor-pointer">
                        {column.header}
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setShowColumnSettings(false)}
                    className="w-full"
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="w-full overflow-x-auto">
        <table className={`w-[98%] divide-y ml-2 mx-3 ${tableClassname}`}>
          <thead className={`font-bold rounded-t-lg box dark:text-slate-50 text-sm sticky top-[-5px] ${headerClassname}`}>
            <tr>
              {onSelectAllRows && (
                <th scope="col" className="py-3 pl-3 text-left font-medium uppercase tracking-wider">
                  <FormCheck className="mt-2">
                    <FormCheck.Input
                      id="checkbox-switch-all"
                      type="checkbox"
                      checked={allRowsSelected}
                      onChange={handleSelectAll}
                    />
                  </FormCheck>
                </th>
              )}
              
              {visibleColumns.map((column, index) => (
                column.visible !== false && (
                  <th
                    key={index}
                    scope="col"
                    style={{ width: column.width }}
                    className={clsx(
                      "py-3 pl-3 font-medium tracking-wider",
                      `${column.tableTextPosition ? column.tableTextPosition : "text-center"} ${column.className || ""}`
                    )}
                  >
                    {column.header}
                  </th>
                )
              ))}
            </tr>
          </thead>
          
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={(onSelectAllRows ? 1 : 0) + visibleColumns.filter(col => col.visible !== false).length}
                  className="text-center py-4"
                >
                  <div className="flex justify-center items-center">
                    <div className="w-8 h-8 border-4 border-t-primary rounded-full animate-spin"></div>
                    <span className="ml-2">Chargement...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={(onSelectAllRows ? 1 : 0) + visibleColumns.filter(col => col.visible !== false).length}
                  className="text-center py-4"
                >
                  {noDataMessage}
                </td>
              </tr>
            ) : (
              data.slice(startIndex, endIndex).map((row, rowIndex) => {
                const isSelected = isRowSelected(row);
                return (
                  <tr
                    key={rowKey(row)}
                    className={clsx(
                      'cursor-pointer pl-3 border-b hover:bg-slate-200 dark:hover:bg-[#232D45]',
                      isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    )}
                    onClick={() => onSelectRow && onSelectRow(row)}
                  >
                    {onSelectRow && (
                      <td className="py-3 pl-3 text-center">
                        <div className="text-sm">
                          <FormCheck className="mt-2">
                            <FormCheck.Input
                              id={`checkbox-${rowIndex}`}
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation(); // Empêcher la propagation de l'événement click
                                onSelectRow(row);
                              }}
                            />
                          </FormCheck>
                        </div>
                      </td>
                    )}
                    
                    {visibleColumns.map((column, colIndex) => (
                      column.visible !== false && (
                        <td
                          key={colIndex}
                          onDoubleClick={onRowDoubleClick ? () => onRowDoubleClick(row) : undefined}
                          className={`py-2 pl-3 ${column.tableTextPosition ? column.tableTextPosition : "text-center"} ${column.className || ""}`}
                        >
                          {(column.renderCell
                            ? column.renderCell(
                                column.accessor ? (isSelected ? selectedRows.find(r => rowKey(r) === rowKey(row))?.[column.accessor] : row[column.accessor]) : null,
                                row,
                                column.accessor
                                  ? (newValue: any) => handleInputChange(rowKey(row), column.accessor!, newValue)
                                  : () => { }
                              )
                            : column.accessor 
                              ? row[column.accessor] 
                              : null) as React.ReactNode}
                        </td>
                      )
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {setPageIndex && pageCount > 1 && (
        <div className='flex mr-2 justify-end items-center mt-3'>
          <Pagination
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            pageCount={pageCount}
          />
        </div>
      )}
    </div>
  );
};

export default CustomDataTable;