import React, { useState } from 'react';
import { IChambre, ChambreStatus } from '../../schema/chambre.schema';
import Button from '../../base-components/Button';
import Lucide from '../../base-components/Lucide';
import CustomDataTable, { TableColumn } from '../../components/CustomDataTable';
import CardView from '../../components/CardView';
import ViewToggle from '../../components/ViewToggle';

interface ChambreTableProps {
    chambres: IChambre[];
    loading: boolean;
    onEdit: (chambre: IChambre) => void;
    onDelete: (chambre: IChambre) => void;
    pageIndex: number;
    setPageIndex: (index: number) => void;
    pageCount: number;
    itemsPerPage: number;
}

const ChambreTable: React.FC<ChambreTableProps> = ({
    chambres,
    loading,
    onEdit,
    onDelete,
    pageIndex,
    setPageIndex,
    pageCount,
    itemsPerPage
}) => {
    const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

    const getEtatChambreLabel = (etat: ChambreStatus) => {
        switch (etat) {
            case ChambreStatus.DISPONIBLE:
                return 'Disponible';
            case ChambreStatus.OCCUPEE:
                return 'Occupée';
            case ChambreStatus.MAINTENANCE:
                return 'En maintenance';
            default:
                return 'Inconnu';
        }
    };

    const getEtatChambreClass = (etat: ChambreStatus) => {
        switch (etat) {
            case ChambreStatus.DISPONIBLE:
                return 'text-success';
            case ChambreStatus.OCCUPEE:
                return 'text-danger';
            case ChambreStatus.MAINTENANCE:
                return 'text-warning';
            default:
                return 'text-gray-500';
        }
    };

    const columns: TableColumn<IChambre>[] = [
        { header: 'Nom', accessor: 'chambreNom', visible: true, className: '' },
        { header: 'Résidence', accessor: 'residenceNom', visible: true, className: 'hidden md:table-cell' },
        { header: 'Configuration', accessor: 'configChambreNom', visible: true, className: 'hidden md:table-cell' },
        {
            header: 'État',
            visible: true,
            className: '',
            renderCell: (value: any, row: IChambre) => (
                <span className={getEtatChambreClass(row.etatChambre)}>
                    {getEtatChambreLabel(row.etatChambre)}
                </span>
            )
        },
        {
            header: "Actions",
            visible: true,
            className: '',
            renderCell: (value: any, row: IChambre) => (
                <div className="flex justify-center space-x-3">
                    <button
                        onClick={() => onEdit(row)}
                        className="text-primary transition-colors"
                    >
                        <Lucide icon="Edit" className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(row)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                        <Lucide icon="Trash" className="w-5 h-4" />
                    </button>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="p-10 text-center">
                <div className="w-10 h-10 mx-auto border-4 border-t-primary rounded-full animate-spin"></div>
                <div className="mt-2">Chargement des données...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            </div>

            {viewMode === 'list' ? (
                <CustomDataTable
                    data={chambres}
                    columns={columns}
                    dataInitial={[]}
                    rowKey={(row) => String(row.chambreId)}
                    selectedRows={[]}
                    onSelectRow={() => null}
                    onSelectAllRows={() => null}
                    onRowDoubleClick={(row) => onEdit(row)}
                    onDeleteSelectRows={() => null}
                    endIndex={pageIndex * itemsPerPage + itemsPerPage}
                    startIndex={pageIndex * itemsPerPage}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    pageCount={pageCount}
                />
            ) : (
                <CardView
                    data={chambres}
                    columns={columns}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default ChambreTable; 