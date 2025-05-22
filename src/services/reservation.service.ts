import axios from 'axios';
import { BASE_URL } from '../utils/constant';

const API_URL = `${BASE_URL}/api/reservation`;

export interface IReservation {
  utilisateurNom: string;
  utilisateurEmail: string;
  utilisateurTelephone: string;
  chambreNom: string;
  reservationId: number;
  reservationUtilisateurId: number;
  reservationDateArrivee: string;
  reservationDateDepart: string;
  reservationAdultes: number;
  reservationPrixTotal: string;
  reservationStatut: string;
  reservationMethodePaiement: string;
  reservationDateCreation: string;
  reservationDateModification: string;
  reservationClientId: number;
  reservationNuit: number;
  status: number;
  reservationResume_: ReservationResume;
  configChambreNom: string;
  configCapaciteAdultes: number;
  typeChambreNom: string;
  residenceNom: string;
  nombreChambres: number;
  rcPrixTotal: string;
  residenceId: number;
  clientId: number;
  clientNom: string;
  clientTelephone: string;
  countryCode: string;
  clientEmail: string;
  chambres: Chambre[];
}

interface Chambre {
  chambreNom: string;
  configChambreNom: string;
  typeChambreNom: string;
  nombreChambres: number;
  rcPrixTotal: string;
}

interface ReservationResume_ {
  dateDepart: string;
  dateArrivee: string;
  nombreDeNuits: number;
  chambreReserve: ChambreReserve;
  prixTotalSejour: number;
  nombreDePersonnes: number;
}

interface ChambreReserve {
  nomTypeChambre: string;
  prixTotalSejour: number;
  nombreDeChambres: number;
  chambreAvecBalcon: boolean;
}

export interface ChambreReservee {
    typeChambreId: number;
    typeChambreNom: string;
    nombreDeChambres: number;
    chambreAvecBalcon: boolean;
    prixTotalSejour: number;
    residenceId: number;
}

export interface ReservationResume {
    chambresReservees: ChambreReservee[];
    dateArrivee: Date;
    dateDepart: Date;
    nombreDeNuits: number;
    nombreDePersonnes: number;
    prixTotalSejour: number;
}

export interface Reservation {
    reservationId: number;
    reservationDateArrivee: Date;
    reservationDateDepart: Date;
    reservationAdultes: number;
    reservationPrixTotal: number;
    reservationStatut: "en_attente" | "confirmee" | "annulee" | "terminee";
    reservationMethodePaiement?: string;
    reservationClientId: number;
    reservationNuit: number;
    reservationResume?: ReservationResume;
    client: any; // À typer selon votre schéma Client
    reservationUtilisateurId: number;
    reservationDateCreation: Date;
    reservationDateModification: Date;
    status: number;
}

export interface CreateReservation {
    reservationDateArrivee: Date;
    reservationDateDepart: Date;
    reservationAdultes: number;
    reservationPrixTotal: number;
    reservationStatut: "en_attente" | "confirmee" | "annulee" | "terminee";
    reservationMethodePaiement?: string;
    reservationClientId: number;
    reservationNuit: number;
    reservationResume?: ReservationResume;
    client: any; // À typer selon votre schéma Client
}

export const reservationService = {
    // Créer une réservation
    createReservation: async (reservation: CreateReservation): Promise<IReservation> => {
        const response = await axios.post(`${API_URL}/create`, reservation);
        console.log("🚀 ~ createReservation: ~ response.data.data:", response.data.data)
        return response.data.data;
    },

    // Obtenir toutes les réservations
    getAllReservations: async (): Promise<IReservation[]> => {
        const response = await axios.get(`${API_URL}/fetchAll`);
        return response.data.data;
    },

    // Vérifier la disponibilité des chambres
    checkChambreDisponibilite: async (residenceId: number, dateDebut: Date, dateFin: Date) => {
        const response = await axios.post(`${API_URL}/checkChambreDisponibilite`, {
            residenceId,
            dateDebut,
            dateFin
        });
        return response.data.data;
    },

    // Mettre à jour le statut d'une réservation
    updateReservationStatus: async (data: { reservationId: number, reservationStatut: "confirmee" | "annulee", utilisateurId: number }): Promise<IReservation> => {
        const response = await axios.post(`${API_URL}/updateReservationStatus`, {
            reservationId: data.reservationId,
            reservationStatut: data.reservationStatut,
            utilisateurId: data.utilisateurId
        });
        return response.data.data;
    }
};  