import React from 'react';
import Button from '../../../base-components/Button';
import Lucide from '../../../base-components/Lucide';

const DeleteDialog: React.FC<any> = ({
    isOpen,
    onClose,
    onConfirm,
    isDeleting
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Confirmer la suppression
                        </h3>
                        <Button
                            variant="outline-secondary"
                            className="w-8 h-8"
                            onClick={onClose}
                            disabled={isDeleting}
                        >
                            <Lucide icon="X" className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Êtes-vous sûr de vouloir supprimer cette prestation ? Cette action est irréversible.
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            variant="outline-secondary"
                            onClick={onClose}
                            disabled={isDeleting}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="danger"
                            onClick={onConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Lucide icon="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                                    Suppression...
                                </>
                            ) : (
                                'Supprimer'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteDialog; 