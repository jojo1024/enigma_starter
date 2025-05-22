import React from 'react';
import { IReservation } from '../../../services/reservation.service';
import { formatCurrency, formatDate, getStatusColor, translateStatus } from '../../../utils/functions';
import Lucide from '../../../base-components/Lucide';
import CustomButton from '../../../base-components/CustomButton';
import { Menu } from '../../../base-components/Headless';

interface ReservationTableProps {
    reservations: IReservation[];
    onConfirm: (reservation: IReservation) => void;
    onCancel: (reservation: IReservation) => void;
    onPrint: (reservation: IReservation) => void;
    onViewDetails: (reservation: IReservation) => void;
    isLoading: boolean;
    canCancelReservation: (reservation: IReservation) => boolean;
}

const ReservationTable: React.FC<ReservationTableProps> = ({
    reservations,
    onConfirm,
    onCancel,
    onPrint,
    onViewDetails,
    isLoading,
    canCancelReservation,
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="table table-report">
                <thead>
                    <tr>
                        <th className="whitespace-nowrap">Client</th>
                        <th className="whitespace-nowrap">Résidence</th>
                        <th className="whitespace-nowrap">Dates</th>
                        <th className="whitespace-nowrap">Nuits</th>
                        <th className="whitespace-nowrap">Total</th>
                        <th className="whitespace-nowrap">Statut</th>
                        <th className="whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.reservationId} className="intro-x">
                            <td>
                                <div className="font-medium">{reservation.clientNom}</div>
                                <div className="text-slate-500 text-xs mt-0.5">
                                    {reservation.clientEmail}
                                </div>
                                <div className="text-slate-500 text-xs mt-0.5">
                                    {reservation.clientTelephone}
                                </div>
                            </td>
                            <td>{reservation.residenceNom}</td>
                            <td>
                                <div className="text-xs">
                                    <div>Arrivée: {formatDate(new Date(reservation.reservationDateArrivee))}</div>
                                    <div>Départ: {formatDate(new Date(reservation.reservationDateDepart))}</div>
                                </div>
                            </td>
                            <td>{reservation.reservationNuit}</td>
                            <td>{formatCurrency(parseFloat(reservation.reservationPrixTotal))}</td>
                            <td>
                                <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(reservation.reservationStatut)}`}>
                                    {translateStatus(reservation.reservationStatut)}
                                </span>
                            </td>
                            <td>
                                <div className="flex items-center justify-center">
                                    <Menu className="ml-3">
                                        <Menu.Button className="block w-5 h-5">
                                            <Lucide icon="MoreVertical" className="w-5 h-5 text-slate-500" />
                                        </Menu.Button>
                                        <Menu.Items className="w-40">
                                            <Menu.Item onClick={() => onViewDetails(reservation)} className="flex items-center">
                                                <Lucide icon="Eye" className="w-4 h-4 mr-2" />
                                                Détails
                                            </Menu.Item>
                                            {reservation.reservationStatut === 'confirmee' && (
                                                <Menu.Item onClick={() => onPrint(reservation)} className="flex items-center">
                                                    <Lucide icon="Printer" className="w-4 h-4 mr-2" />
                                                    Imprimer
                                                </Menu.Item>
                                            )}
                                            {reservation.reservationStatut === 'en_attente' && (
                                                <Menu.Item onClick={() => onConfirm(reservation)} className="flex items-center text-success">
                                                    <Lucide icon="Check" className="w-4 h-4 mr-2" />
                                                    Confirmer
                                                </Menu.Item>
                                            )}
                                            {canCancelReservation(reservation) && (
                                                <Menu.Item onClick={() => onCancel(reservation)} className="flex items-center text-danger">
                                                    <Lucide icon="XCircle" className="w-4 h-4 mr-2" />
                                                    Annuler
                                                </Menu.Item>
                                            )}
                                        </Menu.Items>
                                    </Menu>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationTable; 