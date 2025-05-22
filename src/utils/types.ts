// types.ts - Définitions des types pour le module de réservation

// Type pour les statuts de réservation
export type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

// Interfaces pour les entités de base
export interface Residence {
    residenceId: number;
    residenceNom: string;
    residenceDescription?: string;
    residenceAdresse?: string;
    residenceVille?: string;
    residencePays?: string;
    residenceTelephone?: string;
    residenceEmail?: string;
    residenceImages?: string[];
}

export interface ConfigurationChambre {
    configId: number;
    configResidenceId: number;
    configTypeId?: number;
    configNom: string;
    configDescription?: string;
    configBalcon?: boolean;
    configPrixSemaine: number;
    configPrixWeekend: number;
    configCapaciteAdultes: number;
    configCapaciteEnfants: number;
    configSuperficie?: number;
    configTotalChambres: number;
    configImages: string[];
}

export interface TypeChambre {
    typeId: number;
    typeNom: string;
    typeDescription?: string;
}

export interface Client {
    clientId: number;
    clientNom: string;
    clientPrenom: string;
    clientEmail: string;
    clientTelephone: string;
    clientAdresse?: string;
    clientPays: string;
    clientDateCreation?: string;
    clientDateModification?: string;
}

export interface Service {
    serviceId: number;
    serviceNom: string;
    serviceDescription: string;
    servicePrix: number;
    serviceDisponible?: boolean;
}

// Interfaces pour les réservations
export interface ReservationService {
    serviceId: number;
    quantite: number;
    prix: number;
}

export interface Reservation {
    reservationId: number;
    reservationResidenceId: number;
    reservationConfigId: number;
    reservationClientId: number;
    reservationDateDebut: string;
    reservationDateFin: string;
    reservationNbAdultes: number;
    reservationNbEnfants: number;
    reservationStatut: ReservationStatus;
    reservationMontantTotal: number;
    reservationCommentaire?: string;
    reservationServices: ReservationService[];
    reservationDateCreation: string;
    reservationDateModification?: string;
    // Relations jointes
    client: Client;
    configuration: ConfigurationChambre;
    residence: Residence;
}

// Interface pour le formulaire de réservation
export interface FormReservation {
    reservationId?: number;
    reservationResidenceId: number;
    reservationConfigId: number | null;
    client: {
        clientId?: number;
        clientNom: string;
        clientPrenom: string;
        clientEmail: string;
        clientTelephone: string;
        clientAdresse?: string;
        clientPays: string;
    };
    reservationDateDebut: string;
    reservationDateFin: string;
    reservationNbAdultes: number;
    reservationNbEnfants: number;
    reservationCommentaire?: string;
    reservationServices: {
        serviceId: number;
        quantite: number;
    }[];
}

// Interface pour les filtres de réservation
export interface ReservationFilters {
    searchTerm: string;
    status: ReservationStatus | 'all';
    residence: number | 'all';
    dateStart: string;
    dateEnd: string;
}

// Interface pour les états de dialogue
export interface DialogStates {
    formOpen: boolean;
    deleteOpen: boolean;
    statusOpen: boolean;
    detailMode: boolean;
    selectedId: number | null;
    newStatus: ReservationStatus;
    activeTabIndex: number;
}

// Interface pour les props des composants
export interface ReservationFilterProps {
    filters: ReservationFilters;
    residences: Residence[];
    onFilterChange: (field: string, value: any) => void;
}

export interface ReservationListProps {
    reservations: Reservation[];
    onView: (reservation: Reservation) => void;
    onEdit: (reservation: Reservation) => void;
    onDelete: (reservationId: number) => void;
    onChangeStatus: (reservationId: number, status: ReservationStatus) => void;
}

export interface ReservationFormProps {
    isOpen: boolean;
    formData: FormReservation;
    formErrors: Record<string, string>;
    residences: Residence[];
    configurations: ConfigurationChambre[];
    services: Service[];
    detailMode: boolean;
    onClose: () => void;
    onSave: () => void;
    onFormChange?: (field: string, value: any) => void;
    onServiceChange?: (serviceId: number, quantity: number) => void;
}

export interface ReservationDialogProps {
    type: 'delete' | 'status';
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    statusValue?: ReservationStatus;
    onStatusChange?: (value: ReservationStatus) => void;
}

// Type pour les erreurs de formulaire
export type FormErrors = Record<string, string>;