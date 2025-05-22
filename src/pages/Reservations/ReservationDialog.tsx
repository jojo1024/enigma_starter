import React from 'react';
import { ReservationStatus } from '../../utils/types';
import { Dialog } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import Button from '../../base-components/Button';
import { FormSelect } from '../../base-components/Form';


interface ReservationDialogProps {
  type: 'delete' | 'status';
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  statusValue?: ReservationStatus;
  onStatusChange?: (value: ReservationStatus) => void;
}

const ReservationDialog: React.FC<ReservationDialogProps> = ({
  type,
  isOpen,
  onClose,
  onConfirm,
  statusValue,
  onStatusChange
}) => {
  // Rendu conditionnel selon le type de dialogue
  if (type === 'delete') {
    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide icon="AlertTriangle" className="w-16 h-16 mx-auto mt-3 text-danger" />
            <div className="mt-5 text-3xl">Êtes-vous sûr?</div>
            <div className="mt-2 text-slate-500">
              Voulez-vous vraiment supprimer cette réservation? <br />
              Cette action ne peut pas être annulée.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={onClose}
              className="w-24 mr-1"
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              type="button"
              className="w-24"
              onClick={onConfirm}
            >
              Supprimer
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    );
  }

  // Dialogue de changement de statut
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
    >
      <Dialog.Panel>
        <div className="p-5 text-center">
          <Lucide icon="RefreshCw" className="w-16 h-16 mx-auto mt-3 text-primary" />
          <div className="mt-5 text-2xl">Changer le statut</div>
          <div className="mt-2 text-slate-500">
            Veuillez sélectionner le nouveau statut de la réservation.
          </div>
        </div>
        <div className="px-5 pb-5">
          <FormSelect
            value={statusValue}
            onChange={(e) => onStatusChange && onStatusChange(e.target.value as ReservationStatus)}
            className="w-full mb-3"
          >
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="checked_in">Arrivée</option>
            <option value="checked_out">Terminée</option>
            <option value="cancelled">Annulée</option>
          </FormSelect>
        </div>
        <div className="px-5 pb-8 text-center">
          <Button
            variant="outline-secondary"
            type="button"
            onClick={onClose}
            className="w-24 mr-1"
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            type="button"
            className="w-24"
            onClick={onConfirm}
          >
            Confirmer
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default ReservationDialog;