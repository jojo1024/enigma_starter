import React from 'react';
import { Dialog } from '../../../base-components/Headless';
import Button from '../../../base-components/Button';
import Lucide from '../../../base-components/Lucide';
import { DeleteDialogProps } from '../types';
import Spinner from '../../../base-components/Spinner';

const DeleteDialog: React.FC<DeleteDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isDeleting
}) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
        >
            <Dialog.Panel>
                <div className="p-5 text-center">
                    <Lucide icon="AlertTriangle" className="w-16 h-16 mx-auto mt-3 text-danger" />
                    <div className="mt-5 text-3xl">Êtes-vous sûr?</div>
                    <div className="mt-2 text-slate-500">
                        Voulez-vous vraiment supprimer cette résidence? <br />
                        Cette action ne peut pas être annulée.
                    </div>
                </div>
                <div className="px-5 pb-8 text-center">
                    <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={onClose}
                        className="w-24 mr-1"
                        disabled={isDeleting}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="danger"
                        type="button"
                        className="w-24"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Spinner className="w-4 h-4 mr-2" />
                                Suppression...
                            </>
                        ) : (
                            'Supprimer'
                        )}
                    </Button>
                </div>
            </Dialog.Panel>
        </Dialog>
    );
};

export default DeleteDialog; 