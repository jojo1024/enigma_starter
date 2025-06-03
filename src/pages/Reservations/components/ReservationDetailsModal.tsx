import React from 'react';
import { Dialog } from '../../../base-components/Headless';
import Lucide from '../../../base-components/Lucide';
import { IReservation } from '../../../services/reservation.service';
import { formatDate, formatCurrency } from '../../../utils/functions';

interface ReservationDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: IReservation | null;
}

const ReservationDetailsModal: React.FC<ReservationDetailsModalProps> = ({
    isOpen,
    onClose,
    reservation
}) => {
    if (!reservation) return null;

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
        >
            <Dialog.Panel>
                <div className="flex items-center justify-center p-4">
                    <div className="rounded-lg shadow-xl w-full max-w-2xl mx-auto">
                        <div className="p-2">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Détails de la réservation</h3>
                                <button
                                    onClick={onClose}
                                    className="text-slate-400 hover:text-slate-500"
                                >
                                    <Lucide icon="X" className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium mb-2">Informations client</h4>
                                    <div className="space-y-2">
                                        <p><span className="text-slate-500">Nom:</span> {reservation.clientNom}</p>
                                        <p><span className="text-slate-500">Email:</span> {reservation.clientEmail}</p>
                                        <p><span className="text-slate-500">Téléphone:</span> {reservation.clientTelephone}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Informations réservation</h4>
                                    <div className="space-y-2">
                                        <p><span className="text-slate-500">Résidence:</span> {reservation.residenceNom}</p>
                                        <p><span className="text-slate-500">Statut:</span> {reservation.reservationStatut}</p>
                                        <p><span className="text-slate-500">Date de création:</span> {formatDate(new Date(reservation.reservationDateCreation))}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Dates</h4>
                                    <div className="space-y-2">
                                        <p><span className="text-slate-500">Arrivée:</span> {formatDate(new Date(reservation.reservationDateArrivee))}</p>
                                        <p><span className="text-slate-500">Départ:</span> {formatDate(new Date(reservation.reservationDateDepart))}</p>
                                        <p><span className="text-slate-500">Nuits:</span> {reservation.reservationNuit}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Invités</h4>
                                    <div className="space-y-2">
                                        <p><span className="text-slate-500">Adultes:</span> {reservation.reservationAdultes}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-medium mb-2">Chambres sélectionnées</h4>
                                <div className="space-y-2">
                                    {reservation.chambres.map((chambre, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <span>{chambre.chambreNom} x{chambre.nombreChambres}</span>
                                            <span>{formatCurrency(parseFloat(chambre.rcPrixTotal))}</span>
                                        </div>
                                    ))}
                                    <div className="border-t pt-2 mt-2 flex justify-between items-center font-medium">
                                        <span>Total</span>
                                        <span>{formatCurrency(parseFloat(reservation.reservationPrixTotal))}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog.Panel>
        </Dialog>
    );
};

export default ReservationDetailsModal; 