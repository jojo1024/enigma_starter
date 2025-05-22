import React from 'react';
import { Reservation, ReservationStatus } from '../../utils/types';
import Lucide from '../../base-components/Lucide';
import Tippy from '../../base-components/Tippy';

interface ReservationListProps {
  reservations: Reservation[];
  onView: (reservation: Reservation) => void;
  onEdit: (reservation: Reservation) => void;
  onDelete: (reservationId: number) => void;
  onChangeStatus: (reservationId: number, status: ReservationStatus) => void;
}

const ReservationList: React.FC<ReservationListProps> = ({
  reservations,
  onView,
  onEdit,
  onDelete,
  onChangeStatus
}) => {
  // Fonctions utilitaires
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const calculateDuration = (dateDebut: string, dateFin: string): number => {
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: ReservationStatus): string => {
    switch (status) {
      case 'pending':
        return 'bg-warning';
      case 'confirmed':
        return 'bg-success';
      case 'checked_in':
        return 'bg-primary';
      case 'checked_out':
        return 'bg-slate-500';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-slate-200';
    }
  };

  const getStatusText = (status: ReservationStatus): string => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'checked_in':
        return 'Arrivée';
      case 'checked_out':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'Inconnu';
    }
  };

  return (
    <>
      {reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 mt-5 border rounded-md intro-y border-slate-200">
          <Lucide icon="Calendar" className="w-12 h-12 text-slate-300" />
          <p className="mt-2 text-slate-500">Aucune réservation trouvée</p>
        </div>
      ) : (
        <div className="mt-5 overflow-auto intro-y">
          <table className="table table-report">
            <thead>
              <tr>
                <th className="whitespace-nowrap">ID</th>
                <th className="whitespace-nowrap">Client</th>
                <th className="whitespace-nowrap">Résidence / Chambre</th>
                <th className="whitespace-nowrap">Dates</th>
                <th className="whitespace-nowrap">Personnes</th>
                <th className="whitespace-nowrap">Montant</th>
                <th className="whitespace-nowrap">Statut</th>
                <th className="text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.reservationId} className="intro-x">
                  <td className="w-10">
                    <div className="flex items-center">
                      <Tippy
                        content="Voir détails"
                        className="flex items-center justify-center font-medium"
                      >
                        <div 
                          className="cursor-pointer text-primary"
                          onClick={() => onView(reservation)}
                        >
                          #{reservation.reservationId}
                        </div>
                      </Tippy>
                    </div>
                  </td>
                  <td>
                    <a 
                      className="font-medium whitespace-nowrap cursor-pointer" 
                      onClick={() => onView(reservation)}
                    >
                      {`${reservation.client.clientPrenom} ${reservation.client.clientNom}`}
                    </a>
                    <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                      {reservation.client.clientEmail}
                    </div>
                  </td>
                  <td>
                    <div className="font-medium whitespace-nowrap">
                      {reservation.residence.residenceNom}
                    </div>
                    <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                      {reservation.configuration.configNom}
                    </div>
                  </td>
                  <td>
                    <div className="whitespace-nowrap">
                      {formatDate(reservation.reservationDateDebut)} - {formatDate(reservation.reservationDateFin)}
                    </div>
                    <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                      {calculateDuration(reservation.reservationDateDebut, reservation.reservationDateFin)} nuit(s)
                    </div>
                  </td>
                  <td>
                    {reservation.reservationNbAdultes} adulte(s), {reservation.reservationNbEnfants} enfant(s)
                  </td>
                  <td>
                    <div className="font-medium whitespace-nowrap">
                      {reservation.reservationMontantTotal.toLocaleString()} F CFA
                    </div>
                    <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                      {reservation.reservationServices.length > 0 ? 
                        `+ ${reservation.reservationServices.length} service(s)` : 'Sans services'}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(reservation.reservationStatut)}`}></div>
                      <span 
                        className="cursor-pointer"
                        onClick={() => onChangeStatus(reservation.reservationId, reservation.reservationStatut)}
                      >
                        {getStatusText(reservation.reservationStatut)}
                      </span>
                    </div>
                  </td>
                  <td className="table-report__action w-56">
                    <div className="flex justify-center items-center">
                      <a 
                        className="flex items-center mr-3 text-primary"
                        onClick={() => onEdit(reservation)}
                      >
                        <Lucide icon="Edit" className="w-4 h-4 mr-1" /> Modifier
                      </a>
                      <a 
                        className="flex items-center text-danger"
                        onClick={() => onDelete(reservation.reservationId)}
                      >
                        <Lucide icon="Trash" className="w-4 h-4 mr-1" /> Supprimer
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ReservationList;