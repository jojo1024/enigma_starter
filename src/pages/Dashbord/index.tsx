import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllReservations, selectAllReservations } from '../../stores/slices/reservationSlice'
import { fetchAllResidences, selectAllResidences } from '../../stores/slices/residenceSlice'
import { fetchAllChambres, selectAllChambres } from '../../stores/slices/ChambreSlice'
import {
    Users,
    Calendar,
    CheckCircle,
    XCircle,
    Building2,
    BedDouble,
    Euro
} from 'lucide-react'
import CustomDataTable from '../../components/CustomDataTable'
import { IReservation } from '../../services/reservation.service'
import { TableColumn } from '../../components/CustomDataTable'
import ResidenceFilter from './components/ResidenceFilter'
import StatsSection from './components/StatsSection'
import ChartsSection from './components/ChartsSection'

const Dashboard = () => {
    const dispatch = useDispatch()
    const reservations = useSelector(selectAllReservations)
    const residences = useSelector(selectAllResidences)
    const chambres = useSelector(selectAllChambres)
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState({
        residence: 'all',
        dateRange: 'month'
    })

    useEffect(() => {
        dispatch(fetchAllReservations() as any)
        dispatch(fetchAllResidences() as any)
        dispatch(fetchAllChambres() as any)
    }, [dispatch])

    const onFilterChange = (key: string, value: string | number) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }))
    }

    // Fonction pour filtrer les réservations
    const filteredReservations = reservations.filter(reservation => {
        if (filters.residence === 'all') return true
        return reservation.residenceId === parseInt(filters.residence as string)
    })

    // Préparation des données pour les graphiques
    const getMonthlyRevenueData = () => {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
        const currentYear = new Date().getFullYear()

        const monthlyData = months.map(month => {
            const monthIndex = months.indexOf(month)
            return filteredReservations
                .filter(r => {
                    const date = new Date(r.reservationDateArrivee)
                    return date.getFullYear() === currentYear && date.getMonth() === monthIndex
                })
                .reduce((acc, curr) => acc + parseFloat(curr.reservationPrixTotal), 0)
        })

        return {
            labels: months,
            datasets: [{
                label: 'Revenus mensuels (FCFA)',
                data: monthlyData,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    }

    const getReservationStatusData = () => {
        const statusCounts = {
            confirmee: filteredReservations.filter(r => r.reservationStatut === 'confirmee').length,
            annulee: filteredReservations.filter(r => r.reservationStatut === 'annulee').length,
            en_attente: filteredReservations.filter(r => r.reservationStatut === 'en_attente').length
        }

        return {
            labels: ['Confirmées', 'Annulées', 'En attente'],
            datasets: [{
                data: [statusCounts.confirmee, statusCounts.annulee, statusCounts.en_attente],
                backgroundColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)', 'rgb(234, 179, 8)']
            }]
        }
    }

    const getOccupancyRateData = () => {
        const occupancyRate = (chambres.filter(c => c.etatChambre === 'OCCUPEE').length / chambres.length) * 100
        const availabilityRate = 100 - occupancyRate

        return {
            labels: ['Occupées', 'Disponibles'],
            datasets: [{
                data: [occupancyRate, availabilityRate],
                backgroundColor: ['rgb(239, 68, 68)', 'rgb(34, 197, 94)']
            }]
        }
    }

    // Statistiques des réservations
    const totalReservations = filteredReservations.length
    const confirmedReservations = filteredReservations.filter(r => r.reservationStatut === 'confirmee').length
    const cancelledReservations = filteredReservations.filter(r => r.reservationStatut === 'annulee').length
    const pendingReservations = totalReservations - confirmedReservations - cancelledReservations

    // Statistiques des résidences et chambres
    const totalResidences = residences.length
    const totalChambres = chambres.length
    const chambresDisponibles = chambres.filter(c => c.etatChambre === 'DISPONIBLE').length
    const chambresOccupees = chambres.filter(c => c.etatChambre === 'OCCUPEE').length

    // Statistiques financières
    const revenuTotal = filteredReservations
        .filter(r => r.reservationStatut === 'confirmee')
        .reduce((acc, curr) => acc + parseFloat(curr.reservationPrixTotal), 0)

    const reservationStats = [
        {
            title: 'Total Réservations',
            value: totalReservations,
            icon: <Calendar className="w-6 h-6" />,
            color: 'bg-blue-500'
        },
        {
            title: 'Réservations Confirmées',
            value: confirmedReservations,
            icon: <CheckCircle className="w-6 h-6" />,
            color: 'bg-green-500'
        },
        {
            title: 'Réservations Annulées',
            value: cancelledReservations,
            icon: <XCircle className="w-6 h-6" />,
            color: 'bg-red-500'
        },
        {
            title: 'Réservations en Attente',
            value: pendingReservations,
            icon: <Users className="w-6 h-6" />,
            color: 'bg-yellow-500'
        }
    ]

    const residenceStats = [
        {
            title: 'Total Résidences',
            value: totalResidences,
            icon: <Building2 className="w-6 h-6" />,
            color: 'bg-purple-500'
        },
        {
            title: 'Total Chambres',
            value: totalChambres,
            icon: <BedDouble className="w-6 h-6" />,
            color: 'bg-indigo-500'
        },
        {
            title: 'Chambres Disponibles',
            value: chambresDisponibles,
            icon: <CheckCircle className="w-6 h-6" />,
            color: 'bg-green-500'
        },
        {
            title: 'Chambres Occupées',
            value: chambresOccupees,
            icon: <XCircle className="w-6 h-6" />,
            color: 'bg-red-500'
        }
    ]

    const financialStats = [
        {
            title: 'Revenu Total',
            value: `${revenuTotal.toLocaleString('fr-FR')} FCFA`,
            icon: <Euro className="w-6 h-6" />,
            color: 'bg-emerald-500'
        },
        // {
        //     title: 'Revenu Moyen par Réservation',
        //     value: `${(revenuTotal / confirmedReservations || 0).toLocaleString('fr-FR')} FCFA`,
        //     icon: <Euro className="w-6 h-6" />,
        //     color: 'bg-blue-500'
        // }
    ]

    const columns: TableColumn<IReservation>[] = [
        {
            header: 'ID',
            accessor: 'reservationId',
            width: '80px',
            tableTextPosition: 'text-center'
        },
        {
            header: 'Client',
            accessor: 'clientNom',
            width: '200px'
        },
        {
            header: 'Date d\'arrivée',
            accessor: 'reservationDateArrivee',
            renderCell: (value: string) => new Date(value).toLocaleDateString(),
            width: '150px',
            tableTextPosition: 'text-center'
        },
        {
            header: 'Date de départ',
            accessor: 'reservationDateDepart',
            renderCell: (value: string) => new Date(value).toLocaleDateString(),
            width: '150px',
            tableTextPosition: 'text-center'
        },
        {
            header: 'Statut',
            accessor: 'reservationStatut',
            renderCell: (value: string) => (
                <span className={`px-2 py-1 rounded-full text-xs ${value === 'confirmee'
                    ? 'bg-green-100 text-green-800'
                    : value === 'annulee'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {value}
                </span>
            ),
            width: '120px',
            tableTextPosition: 'text-center'
        },
        {
            header: 'Prix Total',
            accessor: 'reservationPrixTotal',
            renderCell: (value: string) => `${value} FCFA`,
            width: '120px',
            tableTextPosition: 'text-right'
        }
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Tableau de Bord</h2>
                <ResidenceFilter
                    residences={residences}
                    selectedResidence={filters.residence}
                    onResidenceChange={(value) => onFilterChange('residence', value)}
                />
            </div>

            <StatsSection title="Réservations" stats={reservationStats} />
            <StatsSection title="Résidences et Chambres" stats={residenceStats} />
            <StatsSection title="Finances" stats={financialStats} />

            <ChartsSection
                monthlyRevenueData={getMonthlyRevenueData()}
                reservationStatusData={getReservationStatusData()}
                occupancyRateData={getOccupancyRateData()}
            />

            <div className="mt-8 bg-white rounded-lg shadow">
                <div className="p-5">
                    <h3 className="text-lg font-medium mb-4 text-gray-700">Dernières Réservations</h3>
                    <CustomDataTable
                        data={filteredReservations.slice(0, 10)}
                        columns={columns}
                        rowKey={(row: IReservation) => row.reservationId}
                        showSearchBar={true}
                        search={search}
                        setSearch={setSearch}
                        className="mt-3"
                        headerClassname="bg-gray-50"
                    />
                </div>
            </div>
        </div>
    )
}

export default Dashboard