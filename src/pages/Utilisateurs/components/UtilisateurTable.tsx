import React, { useState } from 'react';
import Lucide from '../../../base-components/Lucide';
import CustomDataTable, { TableColumn } from '../../../components/CustomDataTable';
import CardView from '../../../components/CardView';
import ViewToggle from '../../../components/ViewToggle';
import { Utilisateur } from '../../../schema/utilisateur.schema';
import { convertDateToLocaleStringDateTime } from '../../../utils/functions';

interface UtilisateurTableProps {
    utilisateurs: Utilisateur[];
    loading: boolean;
    handleEdit: (utilisateur: Utilisateur) => void;
    handleDelete: (utilisateur: Utilisateur) => void;
    pageIndex: number;
    setPageIndex: (index: number) => void;
    pageCount: number;
    startIndex: number;
    endIndex: number;
}

const UtilisateurTable: React.FC<UtilisateurTableProps> = ({
    utilisateurs,
    loading,
    handleEdit,
    handleDelete,
    pageIndex,
    setPageIndex,
    pageCount,
    startIndex,
    endIndex
}) => {
    const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleRowDetails = (utilisateurId: number) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(utilisateurId)) {
            newExpandedRows.delete(utilisateurId);
        } else {
            newExpandedRows.add(utilisateurId);
        }
        setExpandedRows(newExpandedRows);
    };

    const columns: TableColumn<Utilisateur>[] = [
        { header: 'Nom', accessor: 'utilisateurNom', visible: true, className: '' },
        { header: 'Role', accessor: 'roleUtilisateurNom', visible: true, className: 'hidden md:table-cell' },
        { header: 'Resi.', accessor: 'residenceNom', visible: true, className: 'hidden md:table-cell' },
        { header: 'MDP Initial', accessor: 'motDePasseInitial', visible: true, className: 'hidden md:table-cell' },
        { header: 'Tél.', accessor: 'utilisateurTelephone', visible: true, className: 'hidden md:table-cell' },
        {
            header: 'Date création',
            visible: true,
            className: 'hidden lg:table-cell',
            renderCell: (value: any, row: Utilisateur) => (
                <span>{convertDateToLocaleStringDateTime(row.utilisateurDateCreation)}</span>
            )
        },
        {
            header: "Actions",
            visible: true,
            className: '',
            renderCell: (value: any, row: Utilisateur) => (
                <div className="flex justify-center space-x-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleRowDetails(row.utilisateurId);
                        }}
                        className="text-primary transition-colors"
                    >
                        <Lucide icon={expandedRows.has(row.utilisateurId) ? "ChevronUp" : "ChevronDown"} className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(row);
                        }}
                        className="text-primary transition-colors"
                    >
                        <Lucide icon="Edit" className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(row);
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                        <Lucide icon="Trash" className="w-5 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const renderRowDetails = (utilisateur: Utilisateur) => {
        if (!expandedRows.has(utilisateur.utilisateurId)) return null;

        return (
            <tr>
                <td colSpan={columns.length + 1} className="p-0">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                                <p className="mt-1">{utilisateur.utilisateurEmail}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Téléphone</p>
                                <p className="mt-1">{utilisateur.utilisateurTelephone}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Résidence</p>
                                <p className="mt-1">{utilisateur.residenceNom}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rôle</p>
                                <p className="mt-1">{utilisateur.roleUtilisateurNom}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date de création</p>
                                <p className="mt-1">{convertDateToLocaleStringDateTime(utilisateur.utilisateurDateCreation)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Statut</p>
                                <p className="mt-1">{utilisateur.status === 1 ? 'Actif' : 'Inactif'}</p>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        );
    };

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
                    data={utilisateurs}
                    columns={columns}
                    dataInitial={[]}
                    rowKey={(row) => String(row.utilisateurId)}
                    selectedRows={[]}
                    onSelectRow={() => null}
                    onSelectAllRows={() => null}
                    onRowDoubleClick={(row) => handleEdit(row)}
                    onDeleteSelectRows={() => null}
                    endIndex={endIndex}
                    startIndex={startIndex}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    pageCount={pageCount}
                    renderRowDetails={renderRowDetails}
                />
            ) : (
                <CardView
                    data={utilisateurs}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default UtilisateurTable; 