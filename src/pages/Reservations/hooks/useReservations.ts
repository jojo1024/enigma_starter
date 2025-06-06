import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../stores/store';
import { fetchAllReservations, selectAllReservations, updateReservationStatus } from '../../../stores/slices/reservationSlice';
import { IReservation } from '../../../services/reservation.service';
import { AppDispatch } from '../../../stores/store';
import { fetchAllResidences, selectAllResidences } from '../../../stores/slices/residenceSlice';
import { selectConnectionInfo } from '../../../stores/slices/appSlice';

interface UseReservationsProps {
    dateRange: { start: string; end: string };
    priceRange: { min: number; max: number };
    nightsRange: { min: number; max: number };
    guestsRange: { min: number; max: number };
}

export const useReservations = ({
    dateRange,
    priceRange,
    nightsRange,
    guestsRange,
}: UseReservationsProps) => {
    const dispatch = useAppDispatch() as AppDispatch;
    const reservations = useAppSelector(selectAllReservations);
    const connectionInfo = useAppSelector(selectConnectionInfo);
    console.log("🚀 ~ reservations:", reservations.length)
    const residences = useAppSelector(selectAllResidences);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [residenceFilter, setResidenceFilter] = useState("all");
    console.log("🚀 ~ residenceFilter:", residenceFilter)
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const [selectedReservationForCancel, setSelectedReservationForCancel] = useState<IReservation | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const ITEMS_PER_PAGE = 18;


    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                await Promise.all([
                    dispatch(fetchAllReservations()),
                    dispatch(fetchAllResidences())
                ]);
            } catch (err) {
                setError("Erreur lors du chargement des données");
                console.error('Erreur de chargement:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [dispatch]);

    // Réinitialiser la page courante quand les filtres changent
    useEffect(() => {
        setCurrentPage(1);
        setPageIndex(0);
    }, [searchTerm, statusFilter, residenceFilter, dateRange, priceRange, nightsRange, guestsRange]);

    const canCancelReservation = useCallback((reservation: IReservation) => {
        if (reservation.reservationStatut === 'annulee' || reservation.reservationStatut === 'terminee') {
            return false;
        }

        if (reservation.reservationStatut === 'confirmee') {
            const dateArrivee = new Date(reservation.reservationDateArrivee);
            const today = new Date();
            return dateArrivee > today;
        }

        return true;
    }, []);

    // Utiliser useMemo pour optimiser les performances
    const filteredReservations = useMemo(() => {
        try {
            let filteredReservations  =  reservations
                .filter(reservation => {
                    const searchLower = searchTerm.toLowerCase().trim();
                    const matchesSearch = !searchTerm || 
                        (reservation.clientNom && reservation.clientNom.toLowerCase().includes(searchLower)) ||
                        (reservation.clientEmail && reservation.clientEmail.toLowerCase().includes(searchLower)) ||
                        (reservation.clientTelephone && reservation.clientTelephone.includes(searchTerm));
                    
                    const matchesStatus = statusFilter === "all" || reservation.reservationStatut === statusFilter;
                    const matchesResidence = residenceFilter === "all" || reservation.residenceId.toString() === residenceFilter;

                    // Filtre par dates - ne s'applique que si les dates sont définies
                    const dateMatch = !dateRange.start || !dateRange.end || (
                        new Date(reservation.reservationDateArrivee) >= new Date(dateRange.start) &&
                        new Date(reservation.reservationDateDepart) <= new Date(dateRange.end)
                    );

                    // Filtre par prix - ne s'applique que si les valeurs sont supérieures à 0
                    const price = parseFloat(reservation.reservationPrixTotal);
                    const priceMatch = (priceRange.min === 0 || price >= priceRange.min) &&
                                     (priceRange.max === 0 || price <= priceRange.max);

                    // Filtre par nuits - ne s'applique que si les valeurs sont supérieures à 0
                    const nightsMatch = (nightsRange.min === 0 || reservation.reservationNuit >= nightsRange.min) &&
                                      (nightsRange.max === 0 || reservation.reservationNuit <= nightsRange.max);

                    // Filtre par invités - ne s'applique que si les valeurs sont supérieures à 0
                    const guestsMatch = (guestsRange.min === 0 || reservation.reservationAdultes >= guestsRange.min) &&
                                      (guestsRange.max === 0 || reservation.reservationAdultes <= guestsRange.max);

                    return matchesSearch && matchesStatus && matchesResidence && dateMatch && 
                           priceMatch && nightsMatch && guestsMatch;
                })
                .sort((a, b) => {
                    if (a.reservationStatut === 'en_attente' && b.reservationStatut !== 'en_attente') return -1;
                    if (a.reservationStatut !== 'en_attente' && b.reservationStatut === 'en_attente') return 1;
                    return new Date(b.reservationDateCreation).getTime() - new Date(a.reservationDateCreation).getTime();
                });
                if(connectionInfo?.roleUtilisateurNom === "ADMIN"){
                    return filteredReservations
                }
                return filteredReservations.filter(reservation => reservation.residenceId === connectionInfo?.residenceId);
        } catch (err) {
            console.error('Erreur lors du filtrage des réservations:', err);
            return [];
        }
    }, [reservations, searchTerm, statusFilter, residenceFilter, dateRange, priceRange, nightsRange, guestsRange]);

    const itemsPerPage = 12;
    const pageCount = Math.ceil(filteredReservations.length / itemsPerPage);
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = pageIndex * itemsPerPage + itemsPerPage;


    console.log("🚀 ~ filteredReservations:", filteredReservations.length)
    // Calculer les statistiques pour les onglets
    const tabsData = useMemo(() => {
        const filteredReservationsByResidence = residenceFilter === 'all' 
            ? reservations 
            : reservations.filter(r => r.residenceId.toString() === residenceFilter);

        return [
            { id: 'all', label: 'Toutes', count: filteredReservationsByResidence.length },
            { id: 'en_attente', label: 'En attente', count: filteredReservationsByResidence.filter(r => r.reservationStatut === 'en_attente').length },
            { id: 'confirmee', label: 'Confirmées', count: filteredReservationsByResidence.filter(r => r.reservationStatut === 'confirmee').length },
            { id: 'annulee', label: 'Annulées', count: filteredReservationsByResidence.filter(r => r.reservationStatut === 'annulee').length },
        ];
    }, [reservations, residenceFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredReservations.length / ITEMS_PER_PAGE));
    
    // S'assurer que la page courante est valide
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages, filteredReservations.length]);

    const paginatedReservations = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredReservations.slice(startIndex, endIndex);
    }, [filteredReservations, currentPage, ITEMS_PER_PAGE]);

    // Fonction pour changer de page
    const handlePageChange = useCallback((newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    }, [totalPages]);

    const handleConfirmReservation = async (reservation: IReservation) => {
        try {
            setIsLoading(true);
            setError(null);
            await dispatch(updateReservationStatus({
                reservationId: reservation.reservationId,
                reservationStatut: "confirmee",
                utilisateurId: 13
            }));
        } catch (err) {
            setError("Erreur lors de la confirmation de la réservation");
            console.error('Erreur lors de la confirmation:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelReservation = async () => {
        if (selectedReservationForCancel) {
            try {
                setIsLoading(true);
                setError(null);
                await dispatch(updateReservationStatus({
                    reservationId: selectedReservationForCancel.reservationId,
                    reservationStatut: "annulee",
                    utilisateurId: 13
                }));
                setShowCancelModal(false);
                setSelectedReservationForCancel(null);
            } catch (err) {
                setError("Erreur lors de l'annulation de la réservation");
                console.error('Erreur lors de l\'annulation:', err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const openCancelModal = useCallback((reservation: IReservation) => {
        if (!canCancelReservation(reservation)) {
            return;
        }
        setSelectedReservationForCancel(reservation);
        setShowCancelModal(true);
    }, [canCancelReservation]);

    const getEtatReservationLabel = (etat: string) => {
        switch (etat) {
            case "confirmee":
                return 'Confirmée';
            case "en_attente":
                return 'En attente';
            case "annulee":
                return 'Annulée';
            default:
                return 'Inconnu';
        }
    };

    const getEtatReservationClass = (etat: string) => {
        switch (etat) {
            case "confirmee":
                return 'bg-green-100 text-green-800';
            case "en_attente":
                return 'bg-yellow-100 text-yellow-800';
            case "annulee":
                return 'bg-red-100 text-red-800';
            default:
                return 'text-gray-500';
        }
    };

    return {
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        residenceFilter,
        setResidenceFilter,
        currentPage,
        setCurrentPage: handlePageChange,
        selectedReservationForCancel,
        showCancelModal,
        setShowCancelModal,
        paginatedReservations,
        totalPages,
        canCancelReservation,
        handleConfirmReservation,
        handleCancelReservation,
        openCancelModal,
        residences,
        tabsData,
        filteredReservations,
        pageIndex,
        setPageIndex,
        pageCount,
        itemsPerPage,
        endIndex,
        startIndex,
        getEtatReservationLabel,
        getEtatReservationClass
    };
}; 