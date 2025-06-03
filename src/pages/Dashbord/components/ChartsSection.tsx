import React from 'react'
import DashboardChart from './DashboardChart'

interface ChartsSectionProps {
    monthlyRevenueData: any
    reservationStatusData: any
    occupancyRateData: any
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
    monthlyRevenueData,
    reservationStatusData,
    occupancyRateData
}) => {
    return (
        <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Graphiques</h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <DashboardChart
                    title="Revenus Mensuels"
                    type="line"
                    data={monthlyRevenueData}
                />
                <DashboardChart
                    title="Statut des Réservations"
                    type="pie"
                    data={reservationStatusData}
                />
                <DashboardChart
                    title="Taux d'Occupation"
                    type="pie"
                    data={occupancyRateData}
                />
            </div>
        </div>
    )
}

export default ChartsSection 