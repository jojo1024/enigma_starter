import React from 'react';
import { IReservation } from '../../../services/reservation.service';
import { formatCurrency, formatDate, getStatusColor, translateStatus } from '../../../utils/functions';
import Lucide from '../../../base-components/Lucide';
import CustomButton from '../../../base-components/CustomButton';
import { Menu } from '../../../base-components/Headless';

interface ReservationCardProps {
    reservation: IReservation;
    onConfirm: (reservation: IReservation) => void;
    onCancel: (reservation: IReservation) => void;
    onPrint: (reservation: IReservation) => void;
    isLoading: boolean;
    canCancelReservation: (reservation: IReservation) => boolean;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
    reservation,
    onConfirm,
    onCancel,
    onPrint,
    isLoading,
    canCancelReservation,
}) => {
    return (
        <div className="col-span-12 py-4 box intro-y md:col-span-6 xl:col-span-4 2xl:col-span-3">
            <div className="px-5 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-base font-medium">{reservation.clientNom}</span>
                    <div className="text-slate-500 text-xs mt-0.5">
                        <Lucide icon="Mail" className="w-3.5 h-3.5 mr-1 inline-block" />
                        {reservation.clientEmail}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                        <Lucide icon="Phone" className="w-3.5 h-3.5 mr-1 inline-block" />
                        {reservation.clientTelephone}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                        <Lucide icon="Building" className="w-3.5 h-3.5 mr-1 inline-block" />
                        {reservation.residenceNom}
                    </div>
                </div>
                <div className="flex items-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(reservation.reservationStatut)}`}>
                        {translateStatus(reservation.reservationStatut)}
                    </span>
                    <Menu className="ml-3">
                        <Menu.Button className="block w-5 h-5">
                            <Lucide icon="MoreVertical" className="w-5 h-5 text-slate-500" />
                        </Menu.Button>
                        <Menu.Items className="w-40">
                            {reservation.reservationStatut === 'confirmee' && (
                                <Menu.Item onClick={() => onPrint(reservation)} className="flex items-center">
                                    <Lucide icon="Printer" className="w-4 h-4 mr-2" />
                                    Imprimer
                                </Menu.Item>
                            )}
                            {reservation.reservationStatut !== 'annulee' && reservation.reservationStatut !== 'terminee' && (
                                <Menu.Item onClick={() => onCancel(reservation)} className="flex items-center text-danger">
                                    <Lucide icon="XCircle" className="w-4 h-4 mr-2" />
                                    Annuler
                                </Menu.Item>
                            )}
                        </Menu.Items>
                    </Menu>
                </div>
            </div>

            <div className="border-t mt-3 text-slate-500 dark:text-slate-400">
                <div className='p-5'>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm flex items-center gap-1">
                            <Lucide icon='Calendar' className="w-4 h-4 flex-shrink-0" /> Réservé le
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{formatDate(new Date(reservation.reservationDateCreation))}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm flex items-center gap-1">
                            <Lucide icon='ArrowRight' className="w-4 h-4 flex-shrink-0" /> Entrée
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{formatDate(new Date(reservation.reservationDateArrivee))}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm flex items-center gap-1">
                            <Lucide icon='ArrowLeft' className="w-4 h-4 flex-shrink-0" /> Départ
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{formatDate(new Date(reservation.reservationDateDepart))}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm flex items-center gap-1">
                            <Lucide icon='Moon' className="w-4 h-4 flex-shrink-0" /> Nuit
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{reservation.reservationNuit} nuit(s)</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm flex items-center gap-1">
                            <Lucide icon='User' className="w-4 h-4 flex-shrink-0" /> Invités
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {reservation.reservationAdultes} adulte(s)
                        </p>
                    </div>
                </div>

                <div className="border-t"></div>

                <div className='px-5 pt-2 pb-5'>
                    <h3 className="mb-2 text-sm  font-medium">Chambre(s) réservée(s)</h3>

                    <div className='h-20 overflow-y-auto'>
                        {reservation.chambres.map((chambre, idx) => (
                            <div key={idx} className="flex justify-between mb-2">
                                <span className="text-gray-600 flex items-center text-sm gap-1 flex-1 min-w-0">
                                    <Lucide icon='Home' className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                    <span className="truncate text-gray-700 dark:text-gray-300">{chambre.chambreNom}</span>
                                    {/* <span className="ml-1 text-sm text-gray-500 dark:text-gray-300">x{chambre.nombreChambres}</span> */}
                                </span>
                                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                    {formatCurrency(parseFloat(chambre.rcPrixTotal))}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-4 pt-2 border-t">
                        <span className='font-semibold'>Total</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {formatCurrency(parseFloat(reservation.reservationPrixTotal))}
                        </span>
                    </div>

                    <div className="flex justify-between mt-4 gap-2">
                        {reservation.reservationStatut === 'confirmee' ? (
                            <CustomButton
                                variant="outline-secondary"
                                className="w-full shadow-sm"
                                onClick={() => onPrint(reservation)}
                                icon="Printer"
                            >
                                Imprimer
                            </CustomButton>
                        ) : reservation.reservationStatut === 'en_attente' ? (
                            <CustomButton
                                variant="outline-success"
                                className="w-full shadow-sm"
                                onClick={() => onConfirm(reservation)}
                                icon="Check"
                                isLoading={isLoading}
                                loadingText="Confirmation en cours..."
                            >
                                Confirmer
                            </CustomButton>
                        ) : null}

                        {canCancelReservation(reservation) && (
                            <CustomButton
                                variant="outline-danger"
                                className="w-full shadow-sm"
                                onClick={() => onCancel(reservation)}
                                icon="XCircle"
                            >
                                Annuler
                            </CustomButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationCard; 