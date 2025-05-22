import { useState, useEffect, useCallback } from 'react';
import { 
  Reservation, 
  Client, 
  Residence, 
  ConfigurationChambre, 
  Service, 
  FormReservation,
  ReservationStatus,
  ReservationFilters,
  DialogStates,
  FormErrors
} from '../utils/types';

// Hook personnalisé pour gérer tout l'état du module de réservation
export const useReservationState = () => {
  // Données d'exemple pour initialiser les états
  const initialResidences: Residence[] = [
    { residenceId: 1, residenceNom: 'Pool Résidence Abidjan' },
    { residenceId: 2, residenceNom: 'Pool Résidence Bouaké' },
    { residenceId: 3, residenceNom: 'Pool Résidence M\'bahiakro' },
  ];

  const initialConfigurations: ConfigurationChambre[] = [
    {
      configId: 1,
      configResidenceId: 1,
      configNom: 'Chambre Standard Vue Ville',
      configCapaciteAdultes: 2,
      configCapaciteEnfants: 1,
      configPrixSemaine: 25000,
      configPrixWeekend: 30000,
      configImages: ['https://tse1.mm.bing.net/th?id=OIP.FtudhIBH-HYhxMpS4TU-sAHaE8&pid=Api&P=0&h=500'],
      configTotalChambres: 15
    },
    {
      configId: 2,
      configResidenceId: 1,
      configNom: 'Chambre Deluxe avec Balcon',
      configCapaciteAdultes: 2,
      configCapaciteEnfants: 2,
      configPrixSemaine: 35000,
      configPrixWeekend: 45000,
      configImages: ['https://tse2.mm.bing.net/th?id=OIP.UnxEJjzTDN-GmNcqdiObBQHaEK&pid=Api&P=0&h=500'],
      configTotalChambres: 8
    },
    {
      configId: 3,
      configResidenceId: 2,
      configNom: 'Suite Exécutive',
      configCapaciteAdultes: 3,
      configCapaciteEnfants: 2,
      configPrixSemaine: 50000,
      configPrixWeekend: 65000,
      configImages: ['https://tse1.mm.bing.net/th?id=OIP.BDSML0aOze7ZAy4ODYaKagHaE8&pid=Api&P=0&h=500'],
      configTotalChambres: 4
    },
  ];

  const initialClients: Client[] = [
    {
      clientId: 1,
      clientNom: 'Koné',
      clientPrenom: 'Amadou',
      clientEmail: 'amadou.kone@example.com',
      clientTelephone: '+225 01 23 45 67',
      clientAdresse: 'Cocody, Rue des Jardins',
      clientPays: 'Côte d\'Ivoire'
    },
    {
      clientId: 2,
      clientNom: 'Diallo',
      clientPrenom: 'Fatou',
      clientEmail: 'fatou.diallo@example.com',
      clientTelephone: '+225 07 88 99 00',
      clientAdresse: 'Plateau, Avenue de la République',
      clientPays: 'Côte d\'Ivoire'
    }
  ];

  const initialServices: Service[] = [
    {
      serviceId: 1,
      serviceNom: 'Petit-déjeuner',
      serviceDescription: 'Petit-déjeuner continental servi de 7h à 10h',
      servicePrix: 5000
    },
    {
      serviceId: 2,
      serviceNom: 'Parking',
      serviceDescription: 'Parking sécurisé 24h/24',
      servicePrix: 3000
    },
    {
      serviceId: 3,
      serviceNom: 'Wifi premium',
      serviceDescription: 'Connexion haute vitesse pour vos appareils',
      servicePrix: 2000
    },
    {
      serviceId: 4,
      serviceNom: 'Service en chambre',
      serviceDescription: 'Repas servis dans votre chambre',
      servicePrix: 7500
    }
  ];

  const initialReservations: Reservation[] = [
    {
      reservationId: 1,
      reservationResidenceId: 1,
      reservationConfigId: 1,
      reservationClientId: 1,
      reservationDateDebut: '2025-04-15',
      reservationDateFin: '2025-04-20',
      reservationNbAdultes: 2,
      reservationNbEnfants: 1,
      reservationStatut: 'confirmed',
      reservationMontantTotal: 150000,
      reservationCommentaire: 'Client VIP, première visite',
      reservationServices: [
        { serviceId: 1, quantite: 2, prix: 10000 },
        { serviceId: 2, quantite: 1, prix: 3000 }
      ],
      reservationDateCreation: '2025-04-01',
      client: initialClients[0],
      configuration: initialConfigurations[0],
      residence: initialResidences[0]
    },
    {
      reservationId: 2,
      reservationResidenceId: 2,
      reservationConfigId: 3,
      reservationClientId: 2,
      reservationDateDebut: '2025-04-22',
      reservationDateFin: '2025-04-25',
      reservationNbAdultes: 3,
      reservationNbEnfants: 0,
      reservationStatut: 'pending',
      reservationMontantTotal: 200000,
      reservationCommentaire: 'Voyage d\'affaires',
      reservationServices: [
        { serviceId: 3, quantite: 3, prix: 6000 },
        { serviceId: 4, quantite: 1, prix: 7500 }
      ],
      reservationDateCreation: '2025-04-05',
      client: initialClients[1],
      configuration: initialConfigurations[2],
      residence: initialResidences[1]
    }
  ];

  // État initial pour le formulaire de réservation
  const initialFormState: FormReservation = {
    reservationResidenceId: initialResidences[0].residenceId,
    reservationConfigId: null,
    client: {
      clientNom: '',
      clientPrenom: '',
      clientEmail: '',
      clientTelephone: '',
      clientPays: 'Côte d\'Ivoire'
    },
    reservationDateDebut: '',
    reservationDateFin: '',
    reservationNbAdultes: 1,
    reservationNbEnfants: 0,
    reservationCommentaire: '',
    reservationServices: []
  };

  // États principaux
  const [residences, setResidences] = useState<Residence[]>(initialResidences);
  const [configurations, setConfigurations] = useState<ConfigurationChambre[]>(initialConfigurations);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  
  // États pour les filtres
  const [filters, setFilters] = useState<ReservationFilters>({
    searchTerm: "",
    status: "all",
    residence: "all",
    dateStart: "",
    dateEnd: ""
  });
  
  // États pour le formulaire et les erreurs
  const [formReservation, setFormReservation] = useState<FormReservation>(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  // États pour les dialogues
  const [dialogStates, setDialogStates] = useState<DialogStates>({
    formOpen: false,
    deleteOpen: false,
    statusOpen: false,
    detailMode: false,
    selectedId: null,
    newStatus: 'confirmed',
    activeTabIndex: 0
  });

  // Fonctions utilitaires
  const getNextId = (): number => {
    return Math.max(...reservations.map(r => r.reservationId), 0) + 1;
  };

  const getNextClientId = (): number => {
    return Math.max(...clients.map(c => c.clientId), 0) + 1;
  };

  const getResidenceName = (residenceId: number): string => {
    const residence = residences.find(r => r.residenceId === residenceId);
    return residence ? residence.residenceNom : 'Résidence Inconnue';
  };

  const getConfigName = (configId: number): string => {
    const config = configurations.find(c => c.configId === configId);
    return config ? config.configNom : 'Configuration Inconnue';
  };

  const getServicePrice = (serviceId: number): number => {
    const service = services.find(s => s.serviceId === serviceId);
    return service ? service.servicePrix : 0;
  };

  const calculateDuration = (dateDebut: string, dateFin: string): number => {
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calcul du montant total pour une réservation
  const calculateTotalAmount = (): number => {
    if (!formReservation.reservationConfigId || !formReservation.reservationDateDebut || !formReservation.reservationDateFin) {
      return 0;
    }

    const config = configurations.find(c => c.configId === formReservation.reservationConfigId);
    if (!config) return 0;

    const start = new Date(formReservation.reservationDateDebut);
    const end = new Date(formReservation.reservationDateFin);
    const nights = calculateDuration(formReservation.reservationDateDebut, formReservation.reservationDateFin);
    
    // Calcul du prix de l'hébergement
    let totalAmount = 0;
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      // Vérifie si c'est un weekend (vendredi, samedi)
      const isWeekend = currentDate.getDay() === 5 || currentDate.getDay() === 6;
      
      totalAmount += isWeekend ? config.configPrixWeekend : config.configPrixSemaine;
    }
    
    // Ajout des services
    formReservation.reservationServices.forEach(service => {
      totalAmount += getServicePrice(service.serviceId) * service.quantite;
    });
    
    return totalAmount;
  };

  // Validations du formulaire
  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    
    // Validation de la configuration
    if (!formReservation.reservationConfigId) {
      errors.configuration = "Veuillez sélectionner une configuration";
    }
    
    // Validation des dates
    if (!formReservation.reservationDateDebut) {
      errors.dateDebut = "La date d'arrivée est requise";
    }
    
    if (!formReservation.reservationDateFin) {
      errors.dateFin = "La date de départ est requise";
    }
    
    if (formReservation.reservationDateDebut && formReservation.reservationDateFin) {
      const start = new Date(formReservation.reservationDateDebut);
      const end = new Date(formReservation.reservationDateFin);
      
      if (start >= end) {
        errors.dateRange = "La date de départ doit être postérieure à la date d'arrivée";
      }
    }
    
    // Validation du nombre de personnes
    if (formReservation.reservationNbAdultes < 1) {
      errors.nbAdultes = "Au moins un adulte est requis";
    }
    
    if (formReservation.reservationNbEnfants < 0) {
      errors.nbEnfants = "Le nombre d'enfants ne peut pas être négatif";
    }
    
    // Validation de la capacité
    const selectedConfig = configurations.find(c => c.configId === formReservation.reservationConfigId);
    if (selectedConfig) {
      const totalAdultes = formReservation.reservationNbAdultes;
      const totalEnfants = formReservation.reservationNbEnfants;
      
      if (totalAdultes > selectedConfig.configCapaciteAdultes) {
        errors.capaciteAdultes = `Cette configuration accepte maximum ${selectedConfig.configCapaciteAdultes} adulte(s)`;
      }
      
      if (totalEnfants > selectedConfig.configCapaciteEnfants) {
        errors.capaciteEnfants = `Cette configuration accepte maximum ${selectedConfig.configCapaciteEnfants} enfant(s)`;
      }
    }
    
    // Validation des informations client
    if (!formReservation.client.clientNom.trim()) {
      errors.clientNom = "Le nom est requis";
    }
    
    if (!formReservation.client.clientPrenom.trim()) {
      errors.clientPrenom = "Le prénom est requis";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formReservation.client.clientEmail)) {
      errors.clientEmail = "L'adresse email n'est pas valide";
    }
    
    const phoneRegex = /^\+\d{3} \d{2} \d{2} \d{2} \d{2}$/;
    if (!phoneRegex.test(formReservation.client.clientTelephone)) {
      errors.clientTelephone = "Le format du téléphone doit être: +225 XX XX XX XX";
    }
    
    return errors;
  };

  // Gestionnaires d'événements
  const handleFilterChange = useCallback((field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddReservation = useCallback(() => {
    setDialogStates(prev => ({
      ...prev,
      formOpen: true,
      detailMode: false,
      activeTabIndex: 0
    }));
    setFormReservation(initialFormState);
    setFormErrors({});
  }, [initialFormState]);

  const handleViewReservation = useCallback((reservation: Reservation) => {
    setDialogStates(prev => ({
      ...prev,
      formOpen: true,
      detailMode: true,
      activeTabIndex: 0
    }));
    
    // Charger les données de la réservation dans le formulaire
    const formData: FormReservation = {
      reservationId: reservation.reservationId,
      reservationResidenceId: reservation.reservationResidenceId,
      reservationConfigId: reservation.reservationConfigId,
      client: {
        clientId: reservation.client.clientId,
        clientNom: reservation.client.clientNom,
        clientPrenom: reservation.client.clientPrenom,
        clientEmail: reservation.client.clientEmail,
        clientTelephone: reservation.client.clientTelephone,
        clientAdresse: reservation.client.clientAdresse,
        clientPays: reservation.client.clientPays
      },
      reservationDateDebut: reservation.reservationDateDebut,
      reservationDateFin: reservation.reservationDateFin,
      reservationNbAdultes: reservation.reservationNbAdultes,
      reservationNbEnfants: reservation.reservationNbEnfants,
      reservationCommentaire: reservation.reservationCommentaire,
      reservationServices: reservation.reservationServices.map(s => ({
        serviceId: s.serviceId,
        quantite: s.quantite
      }))
    };
    
    setFormReservation(formData);
    setFormErrors({});
  }, []);

  const handleEditReservation = useCallback((reservation: Reservation) => {
    setDialogStates(prev => ({
      ...prev,
      formOpen: true,
      detailMode: false,
      activeTabIndex: 0
    }));
    
    const formData: FormReservation = {
      reservationId: reservation.reservationId,
      reservationResidenceId: reservation.reservationResidenceId,
      reservationConfigId: reservation.reservationConfigId,
      client: {
        clientId: reservation.client.clientId,
        clientNom: reservation.client.clientNom,
        clientPrenom: reservation.client.clientPrenom,
        clientEmail: reservation.client.clientEmail,
        clientTelephone: reservation.client.clientTelephone,
        clientAdresse: reservation.client.clientAdresse,
        clientPays: reservation.client.clientPays
      },
      reservationDateDebut: reservation.reservationDateDebut,
      reservationDateFin: reservation.reservationDateFin,
      reservationNbAdultes: reservation.reservationNbAdultes,
      reservationNbEnfants: reservation.reservationNbEnfants,
      reservationCommentaire: reservation.reservationCommentaire,
      reservationServices: reservation.reservationServices.map(s => ({
        serviceId: s.serviceId,
        quantite: s.quantite
      }))
    };
    
    setFormReservation(formData);
    setFormErrors({});
  }, []);

  const handleDeleteReservation = useCallback((reservationId: number) => {
    setDialogStates(prev => ({
      ...prev,
      deleteOpen: true,
      selectedId: reservationId
    }));
  }, []);

  const confirmDeleteReservation = useCallback(() => {
    if (dialogStates.selectedId !== null) {
      setReservations(prevReservations =>
        prevReservations.filter(r => r.reservationId !== dialogStates.selectedId)
      );
      setDialogStates(prev => ({
        ...prev,
        deleteOpen: false,
        selectedId: null
      }));
    }
  }, [dialogStates.selectedId]);

  const handleChangeStatus = useCallback((reservationId: number, initialStatus: ReservationStatus) => {
    setDialogStates(prev => ({
      ...prev,
      statusOpen: true,
      selectedId: reservationId,
      newStatus: initialStatus
    }));
  }, []);

  const confirmChangeStatus = useCallback(() => {
    if (dialogStates.selectedId !== null) {
      setReservations(prevReservations =>
        prevReservations.map(r =>
          r.reservationId === dialogStates.selectedId
            ? { ...r, reservationStatut: dialogStates.newStatus }
            : r
        )
      );
      setDialogStates(prev => ({
        ...prev,
        statusOpen: false,
        selectedId: null
      }));
    }
  }, [dialogStates.selectedId, dialogStates.newStatus]);

  const handleFormChange = useCallback((field: string, value: any) => {
    if (field.startsWith('client.')) {
      const clientField = field.replace('client.', '');
      setFormReservation(prev => ({
        ...prev,
        client: {
          ...prev.client,
          [clientField]: value
        }
      }));
    } else {
      setFormReservation(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Si on change la résidence, on réinitialise la configuration
    if (field === 'reservationResidenceId') {
      setFormReservation(prev => ({
        ...prev,
        reservationConfigId: null
      }));
    }

    // Effacer l'erreur si le champ est valide maintenant
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [formErrors]);

  const handleServiceChange = useCallback((serviceId: number, quantity: number) => {
    const serviceIndex = formReservation.reservationServices.findIndex(s => s.serviceId === serviceId);
    
    if (quantity <= 0) {
      // Supprimer le service si la quantité est 0 ou négative
      setFormReservation(prev => ({
        ...prev,
        reservationServices: prev.reservationServices.filter(s => s.serviceId !== serviceId)
      }));
    } else if (serviceIndex >= 0) {
      // Mettre à jour la quantité si le service existe déjà
      setFormReservation(prev => ({
        ...prev,
        reservationServices: prev.reservationServices.map(s => 
          s.serviceId === serviceId ? { ...s, quantite: quantity } : s
        )
      }));
    } else {
      // Ajouter le service s'il n'existe pas encore
      setFormReservation(prev => ({
        ...prev,
        reservationServices: [...prev.reservationServices, { serviceId, quantite: quantity }]
      }));
    }
  }, [formReservation.reservationServices]);

  const handleSaveReservation = useCallback(() => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Calcul du montant total
    const totalAmount = calculateTotalAmount();

    // Trouver ou créer un client
    let clientId: number;
    if (formReservation.client.clientId) {
      // Client existant
      clientId = formReservation.client.clientId;
      
      // Mettre à jour les informations du client si nécessaire
      setClients(prevClients =>
        prevClients.map(c =>
          c.clientId === clientId
            ? { ...formReservation.client, clientId } as Client
            : c
        )
      );
    } else {
      // Nouveau client
      clientId = getNextClientId();
      const newClient: Client = {
        ...formReservation.client,
        clientId
      } as Client;
      
      setClients(prevClients => [...prevClients, newClient]);
    }

    // Créer ou mettre à jour la réservation
    if (formReservation.reservationId) {
      // Mode édition
      setReservations(prevReservations =>
        prevReservations.map(r => {
          if (r.reservationId === formReservation.reservationId) {
            const config = configurations.find(c => c.configId === formReservation.reservationConfigId);
            const residence = residences.find(res => res.residenceId === formReservation.reservationResidenceId);
            const client = { ...formReservation.client, clientId } as Client;
            
            return {
              ...r,
              reservationResidenceId: formReservation.reservationResidenceId,
              reservationConfigId: formReservation.reservationConfigId!,
              reservationClientId: clientId,
              reservationDateDebut: formReservation.reservationDateDebut,
              reservationDateFin: formReservation.reservationDateFin,
              reservationNbAdultes: formReservation.reservationNbAdultes,
              reservationNbEnfants: formReservation.reservationNbEnfants,
              reservationCommentaire: formReservation.reservationCommentaire,
              reservationMontantTotal: totalAmount,
              reservationServices: formReservation.reservationServices.map(s => ({
                serviceId: s.serviceId,
                quantite: s.quantite,
                prix: getServicePrice(s.serviceId) * s.quantite
              })),
              reservationDateModification: new Date().toISOString().split('T')[0],
              configuration: config!,
              residence: residence!,
              client
            };
          }
          return r;
        })
      );
    } else {
      // Mode ajout
      const newReservationId = getNextId();
      const config = configurations.find(c => c.configId === formReservation.reservationConfigId);
      const residence = residences.find(res => res.residenceId === formReservation.reservationResidenceId);
      const client = { ...formReservation.client, clientId } as Client;
      
      const newReservation: Reservation = {
        reservationId: newReservationId,
        reservationResidenceId: formReservation.reservationResidenceId,
        reservationConfigId: formReservation.reservationConfigId!,
        reservationClientId: clientId,
        reservationDateDebut: formReservation.reservationDateDebut,
        reservationDateFin: formReservation.reservationDateFin,
        reservationNbAdultes: formReservation.reservationNbAdultes,
        reservationNbEnfants: formReservation.reservationNbEnfants,
        reservationStatut: 'pending',
        reservationMontantTotal: totalAmount,
        reservationCommentaire: formReservation.reservationCommentaire,
        reservationServices: formReservation.reservationServices.map(s => ({
          serviceId: s.serviceId,
          quantite: s.quantite,
          prix: getServicePrice(s.serviceId) * s.quantite
        })),
        reservationDateCreation: new Date().toISOString().split('T')[0],
        configuration: config!,
        residence: residence!,
        client
      };
      
      setReservations(prevReservations => [...prevReservations, newReservation]);
    }

    // Fermer le formulaire et réinitialiser les états
    setDialogStates(prev => ({
      ...prev,
      formOpen: false
    }));
    setFormReservation(initialFormState);
    setFormErrors({});
  }, [formReservation, initialFormState, configurations, residences]);

  // Filtrage des réservations
  const filteredReservations = reservations.filter(reservation => {
    // Filtrage par recherche
    const searchMatch = filters.searchTerm === "" || 
      `${reservation.client.clientPrenom} ${reservation.client.clientNom}`.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      reservation.configuration.configNom.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      reservation.reservationId.toString().includes(filters.searchTerm);
    
    // Filtrage par statut
    const statusMatch = filters.status === 'all' || reservation.reservationStatut === filters.status;
    
    // Filtrage par résidence
    const residenceMatch = filters.residence === 'all' || reservation.reservationResidenceId === filters.residence;
    
    // Filtrage par date
    let dateMatch = true;
    if (filters.dateStart && filters.dateEnd) {
      const reservationStart = new Date(reservation.reservationDateDebut);
      const reservationEnd = new Date(reservation.reservationDateFin);
      const filterStart = new Date(filters.dateStart);
      const filterEnd = new Date(filters.dateEnd);
      
      // Vérifie si la période de réservation chevauche la période filtrée
      dateMatch = (
        (reservationStart >= filterStart && reservationStart <= filterEnd) ||
        (reservationEnd >= filterStart && reservationEnd <= filterEnd) ||
        (reservationStart <= filterStart && reservationEnd >= filterEnd)
      );
    }
    
    return searchMatch && statusMatch && residenceMatch && dateMatch;
  }).sort((a, b) => {
    // Tri par date de début
    return new Date(b.reservationDateDebut).getTime() - new Date(a.reservationDateDebut).getTime();
  });

  // Retourner tous les états et gestionnaires
  return {
    // États
    reservations,
    residences,
    configurations,
    clients,
    services,
    filteredReservations,
    formReservation,
    formErrors,
    filters,
    dialogStates,
    
    // Actions
    handleFilterChange,
    handleAddReservation,
    handleViewReservation,
    handleEditReservation,
    handleDeleteReservation,
    confirmDeleteReservation,
    handleChangeStatus,
    confirmChangeStatus,
    handleFormChange,
    handleServiceChange,
    handleSaveReservation,
    
    // Utilitaires
    calculateTotalAmount,
  };
};

export default useReservationState;