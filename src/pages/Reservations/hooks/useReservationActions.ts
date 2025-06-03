import { useState } from 'react';
import { IReservation } from '../../../services/reservation.service';
import { INotification } from '../../../components/Notification';

interface UseReservationActionsProps {
  onConfirmReservation: (reservation: IReservation) => Promise<void>;
  onCancelReservation: (reservation: IReservation) => Promise<void>;
  onShowNotification: (notification: INotification) => void;
}

export const useReservationActions = ({
  onConfirmReservation,
  onCancelReservation,
  onShowNotification
}: UseReservationActionsProps) => {
  const [loadingReservationId, setLoadingReservationId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<IReservation | null>(null);

  const handleConfirm = async (reservation: IReservation) => {
    setSelectedReservation(reservation);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedReservation) return;

    setLoadingReservationId(selectedReservation.reservationId);
    try {
      await onConfirmReservation(selectedReservation);
      onShowNotification({
        type: "success",
        content: "La réservation a été confirmée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
      onShowNotification({
        type: "error",
        content: "Une erreur est survenue lors de la confirmation"
      });
    } finally {
      setLoadingReservationId(null);
      setShowConfirmModal(false);
      setSelectedReservation(null);
    }
  };

  const handleCancel = async (reservation: IReservation) => {
    setLoadingReservationId(reservation.reservationId);
    try {
      await onCancelReservation(reservation);
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      onShowNotification({
        type: "error",
        content: "Une erreur est survenue lors de l'annulation"
      });
    } finally {
      setLoadingReservationId(null);
    }
  };

  const handleViewDetails = (reservation: IReservation) => {
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
  };

  return {
    loadingReservationId,
    showConfirmModal,
    showDetailsModal,
    selectedReservation,
    setShowConfirmModal,
    setShowDetailsModal,
    handleConfirm,
    handleConfirmSubmit,
    handleCancel,
    handleViewDetails
  };
}; 