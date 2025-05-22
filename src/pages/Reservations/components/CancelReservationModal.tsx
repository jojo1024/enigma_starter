import React from 'react';
import { Dialog } from '../../../base-components/Headless';
import Lucide from '../../../base-components/Lucide';
import CustomButton from '../../../base-components/CustomButton';
import { IReservation } from '../../../services/reservation.service';
import { formatCurrency, formatDate } from '../../../utils/functions';

interface CancelReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    reservation: IReservation | null;
    isLoading: boolean;
}

const CancelReservationModal: React.FC<CancelReservationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    reservation,
    isLoading,
}) => {
    if (!reservation) return null;

    return (
        <Dialog
            open={isOpen}
            onClose={() => !isLoading && onClose()}
            className="relative z-50"
        >
            <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
                        <div className="p-5">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-danger/20">
                                    <Lucide icon="AlertTriangle" className="h-6 w-6 text-danger" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">
                                    Annuler la réservation
                                </h3>
                                <div className="mt-2 text-sm text-gray-500">
                                    <p>Êtes-vous sûr de vouloir annuler cette réservation ?</p>
                                    <div className="mt-4 text-left">
                                        <p className="font-medium">Détails de la réservation :</p>
                                        <ul className="mt-2 space-y-1 text-sm">
                                            <li>Client : {reservation.clientNom}</li>
                                            <li>Date d'arrivée : {formatDate(new Date(reservation.reservationDateArrivee))}</li>
                                            <li>Date de départ : {formatDate(new Date(reservation.reservationDateDepart))}</li>
                                            <li>Montant total : {formatCurrency(parseFloat(reservation.reservationPrixTotal))}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <CustomButton
                                    variant="danger"
                                    type="button"
                                    className="w-full sm:col-start-2"
                                    onClick={onConfirm}
                                    isLoading={isLoading}
                                    loadingText="Annulation en cours..."
                                >
                                    Confirmer l'annulation
                                </CustomButton>
                                <CustomButton
                                    variant="outline-secondary"
                                    type="button"
                                    className="mt-3 sm:mt-0 sm:col-start-1"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Annuler
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog.Panel>
        </Dialog>
    );
};

export default CancelReservationModal; 