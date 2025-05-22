import React from 'react';
import Lucide from '../../../base-components/Lucide';
import { formatCurrency } from '../../../utils/functions';

interface ReservationStatsProps {
    totalReservations: number;
    totalRevenue: number;
    occupancyRate: number;
    averageStay: number;
    confirmedReservations: number;
    pendingReservations: number;
    cancelledReservations: number;
}

const ReservationStats: React.FC<ReservationStatsProps> = ({
    totalReservations,
    totalRevenue,
    occupancyRate,
    averageStay,
    confirmedReservations,
    pendingReservations,
    cancelledReservations,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total des réservations */}
            <div className="col-span-1 box p-5">
                <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/20">
                        <Lucide icon="Calendar" className="w-6 h-6 text-primary" />
                    </div>
                    <div className="ml-4">
                        <div className="text-slate-500 text-sm">Total des réservations</div>
                        <div className="text-xl font-medium">{totalReservations}</div>
                    </div>
                </div>
            </div>

            {/* Revenu total */}
            <div className="col-span-1 box p-5">
                <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-success/20">
                        <Lucide icon="DollarSign" className="w-6 h-6 text-success" />
                    </div>
                    <div className="ml-4">
                        <div className="text-slate-500 text-sm">Revenu total</div>
                        <div className="text-xl font-medium">{formatCurrency(totalRevenue)}</div>
                    </div>
                </div>
            </div>

            {/* Taux d'occupation */}
            <div className="col-span-1 box p-5">
                <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-warning/20">
                        <Lucide icon="Home" className="w-6 h-6 text-warning" />
                    </div>
                    <div className="ml-4">
                        <div className="text-slate-500 text-sm">Taux d'occupation</div>
                        <div className="text-xl font-medium">{occupancyRate}%</div>
                    </div>
                </div>
            </div>

            {/* Séjour moyen */}
            <div className="col-span-1 box p-5">
                <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-info/20">
                        <Lucide icon="Moon" className="w-6 h-6 text-info" />
                    </div>
                    <div className="ml-4">
                        <div className="text-slate-500 text-sm">Séjour moyen</div>
                        <div className="text-xl font-medium">{averageStay} nuits</div>
                    </div>
                </div>
            </div>

            {/* Statut des réservations */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 box p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-success/20">
                            <Lucide icon="CheckCircle" className="w-5 h-5 text-success" />
                        </div>
                        <div className="ml-3">
                            <div className="text-slate-500 text-sm">Confirmées</div>
                            <div className="text-lg font-medium">{confirmedReservations}</div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-warning/20">
                            <Lucide icon="Clock" className="w-5 h-5 text-warning" />
                        </div>
                        <div className="ml-3">
                            <div className="text-slate-500 text-sm">En attente</div>
                            <div className="text-lg font-medium">{pendingReservations}</div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-danger/20">
                            <Lucide icon="XCircle" className="w-5 h-5 text-danger" />
                        </div>
                        <div className="ml-3">
                            <div className="text-slate-500 text-sm">Annulées</div>
                            <div className="text-lg font-medium">{cancelledReservations}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationStats; 