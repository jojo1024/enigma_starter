import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllReservations, selectAllReservations } from '../../stores/slices/reservationSlice'
import { fetchAllResidences, selectAllResidences } from '../../stores/slices/residenceSlice'
import { fetchAllChambres, selectAllChambres } from '../../stores/slices/ChambreSlice'
import { IReduxState } from '../../stores/store'
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
import CardView from '../../components/CardView'

const Dashboard = () => {
    const dispatch = useDispatch()
    const reservations = useSelector(selectAllReservations)
    const residences = useSelector(selectAllResidences)
    const chambres = useSelector(selectAllChambres)
    const [search, setSearch] = useState('')

    useEffect(() => {
        dispatch(fetchAllReservations() as any)
        dispatch(fetchAllResidences() as any)
        dispatch(fetchAllChambres() as any)
    }, [dispatch])

    const totalReservations = reservations.length
    const confirmedReservations = reservations.filter(r => r.reservationStatut === 'confirmee').length
    const cancelledReservations = reservations.filter(r => r.reservationStatut === 'annulee').length
    const pendingReservations = totalReservations - confirmedReservations - cancelledReservations

    const totalResidences = residences.length
    const totalChambres = chambres.length
    const chambresDisponibles = chambres.filter(c => c.etatChambre === 'DISPONIBLE').length
    const chambresOccupees = chambres.filter(c => c.etatChambre === 'OCCUPEE').length

    const revenuTotal = reservations
        .filter(r => r.reservationStatut === 'confirmee')
        .reduce((acc, curr) => acc + parseFloat(curr.reservationPrixTotal), 0)

    const stats = [
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
        },
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
        },
        {
            title: 'Revenu Total',
            value: `${revenuTotal.toFixed(2)} €`,
            icon: <Euro className="w-6 h-6" />,
            color: 'bg-emerald-500'
        }
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
            renderCell: (value: string) => `${value} €`,
            width: '120px',
            tableTextPosition: 'text-right'
        }
    ]

    return (
        <>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Tableau de Bord</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {stats.map((stat, index) => (
                    <div key={index} className="p-5 bg-white rounded-lg shadow">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-full ${stat.color} text-white`}>
                                {stat.icon}
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">{stat.title}</h3>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-5 mt-5 intro-y box">
                <h3 className="text-lg font-medium mb-4">Dernières Réservations</h3>
                <CustomDataTable
                    data={reservations}
                    columns={columns}
                    rowKey={(row: IReservation) => row.reservationId}
                    showSearchBar={true}
                    search={search}
                    setSearch={setSearch}
                    className="mt-3"
                    headerClassname="bg-gray-50"
                />
            </div>
        </>
    )
}

export default Dashboard