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

    const columns: TableColumn<Utilisateur>[] = [
        { header: 'Nom', accessor: 'utilisateurNom', visible: true, className: '' },
        { header: 'Role', accessor: 'roleUtilisateurNom', visible: true, className: 'hidden md:table-cell' },
        { header: 'MDP Initial', accessor: 'motDePasseInitial', visible: true, className: 'hidden md:table-cell' },
        { header: 'Tél.', accessor: 'utilisateurTelephone', visible: true, className: 'hidden md:table-cell' },
        { header: 'Email', accessor: 'utilisateurEmail', visible: true, className: 'hidden lg:table-cell' },
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
                        onClick={() => handleEdit(row)}
                        className="text-primary transition-colors"
                    >
                        <Lucide icon="Edit" className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
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