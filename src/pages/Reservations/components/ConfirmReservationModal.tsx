import React from 'react';
import { Dialog } from '../../../base-components/Headless';
import Lucide from '../../../base-components/Lucide';
import { IReservation } from '../../../services/reservation.service';
import { formatDate } from '../../../utils/functions';

interface ConfirmReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    reservation: IReservation | null;
    isLoading: boolean;
}

const ConfirmReservationModal: React.FC<ConfirmReservationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    reservation,
    isLoading
}) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
        >
            <Dialog.Panel>
                <div className="flex items-center justify-center p-4">
                    <div className="rounded-lg shadow-xl w-full max-w-md mx-auto">
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Confirmer la réservation</h3>
                                <button
                                    onClick={onClose}
                                    className="text-slate-400 hover:text-slate-500"
                                >
                                    <Lucide icon="X" className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mt-4">
                                <p className="text-slate-600">
                                    Êtes-vous sûr de vouloir confirmer cette réservation ?
                                </p>
                                {reservation && (
                                    <div className="mt-4 space-y-2">
                                        <p><span className="font-medium">Client:</span> {reservation.clientNom}</p>
                                        <p><span className="font-medium">Résidence:</span> {reservation.residenceNom}</p>
                                        <p><span className="font-medium">Dates:</span> {formatDate(new Date(reservation.reservationDateArrivee))} - {formatDate(new Date(reservation.reservationDateDepart))}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 border-2 border-t-white rounded-full animate-spin mr-2"></div>
                                            Confirmation...
                                        </div>
                                    ) : (
                                        'Confirmer'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog.Panel>
        </Dialog>
    );
};

export default ConfirmReservationModal; 