import React from 'react';
import Lucide from '../base-components/Lucide';
import Button from '../base-components/Button';
import { TableColumn } from './CustomDataTable';

interface CardViewProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    loading?: boolean;
    noDataMessage?: string;
}

const CardView = <T extends { [key: string]: any }>({
    data,
    columns,
    onEdit,
    onDelete,
    loading = false,
    noDataMessage = 'Aucune donnée disponible'
}: CardViewProps<T>) => {
    if (loading) {
        return (
            <div className="p-10 text-center">
                <div className="w-10 h-10 mx-auto border-4 border-t-primary rounded-full animate-spin"></div>
                <div className="mt-2">Chargement des données...</div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="p-10 text-center text-gray-500">
                {noDataMessage}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {data.map((item, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                    <div className="space-y-2">
                        {columns.map((column, colIndex) => {
                            if (column.visible === false) return null;

                            const value = column.accessor ? item[column.accessor] : null;
                            const content = column.renderCell
                                ? column.renderCell(value, item, () => { })
                                : value;

                            return (
                                <div key={colIndex} className={`${column.className || ''}`}>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {column.header}
                                    </div>
                                    <div className="mt-1">
                                        {content}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {(onEdit || onDelete) && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
                            {onEdit && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => onEdit(item)}
                                    className="flex items-center"
                                >
                                    <Lucide icon="Edit" className="w-4 h-4 mr-1" />
                                    Modifier
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => onDelete(item)}
                                    className="flex items-center"
                                >
                                    <Lucide icon="Trash" className="w-4 h-4 mr-1" />
                                    Supprimer
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CardView; 