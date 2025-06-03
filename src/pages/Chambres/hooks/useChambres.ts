import { useState, useRef, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../stores/store';
import { IChambre, ChambreStatus } from '../../../schema/chambre.schema';
import { 
    createChambre, 
    deleteChambre, 
    fetchAllChambres, 
    selectAllChambres, 
    selectChambreError, 
    selectChambreLoading, 
    updateChambre 
} from '../../../stores/slices/ChambreSlice';
import { fetchAllResidences, selectAllResidences } from '../../../stores/slices/residenceSlice';
import { INotification } from '../../../components/Notification';
import { NotificationElement } from '../../../base-components/Notification/index';
import { fetchAllConfigChambres, selectAllConfigChambres } from '../../../stores/slices/configChambreSlice';

const initialiseChambre: Partial<IChambre> = {
    chambreNom: "",
    chambreConfigId: 0,
    etatChambre: "DISPONIBLE",
    residenceId: 0
};

const validateChambreData = (data: Partial<IChambre>, chambres: IChambre[], selectedChambre: IChambre | null): { isValid: boolean; errors: { [key: string]: string } } => {
    const errors: { [key: string]: string } = {};
    
    if (!data.chambreNom || data.chambreNom.trim() === '') {
        errors.chambreNom = 'Le nom de la chambre est requis';
    } else {
        // Vérification de la duplication du nom
        const isDuplicate = chambres.some(chambre => 
            chambre.chambreNom.toLowerCase() === data.chambreNom?.toLowerCase() && 
            (!selectedChambre || chambre.chambreId !== selectedChambre.chambreId)
        );
        
        if (isDuplicate) {
            errors.chambreNom = 'Ce nom de chambre existe déjà';
        }
    }
    
    if (!data.chambreConfigId || data.chambreConfigId === 0) {
        errors.chambreConfigId = 'La configuration de la chambre est requise';
    }

    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const useChambres = () => {
    const dispatch = useAppDispatch();
    const chambres = useAppSelector(selectAllChambres);
    const configChambres = useAppSelector(selectAllConfigChambres);
    const residences = useAppSelector(selectAllResidences);
    const loading = useAppSelector(selectChambreLoading);
    const error = useAppSelector(selectChambreError);

    // États pour les filtres
    const [searchTerm, setSearchTerm] = useState('');
    const [residenceFilter, setResidenceFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // États pour la pagination
    const [pageIndex, setPageIndex] = useState(0);
    const itemsPerPage = 10;

    // États pour les modales et notifications
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedChambre, setSelectedChambre] = useState<IChambre | null>(null);
    const [chambreFormData, setChambreFormData] = useState<Partial<IChambre>>(initialiseChambre);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState('');
    const notificationRef = useRef<NotificationElement>();
    const [notification, setNotification] = useState<INotification | undefined>();

    // Fonction pour afficher la notification
    const showNotification = () => notificationRef.current?.showToast();

    const displayNotification = (notification: INotification) => {
        setNotification(notification);
        setTimeout(() => {
            showNotification();
        }, 30);
    };

    // Filtrage des chambres
    const filteredChambres = useMemo(() => {
        return chambres.filter(chambre => {
            const matchesSearch = chambre.chambreNom.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesResidence = residenceFilter === 'all' || chambre.residenceId.toString() === residenceFilter;
            const matchesStatus = statusFilter === 'all' || chambre.etatChambre.toString() === statusFilter;
            return matchesSearch && matchesResidence && matchesStatus;
        });
    }, [chambres, searchTerm, residenceFilter, statusFilter]);

    // Calcul des données pour les onglets
    const tabsData = useMemo(() => [
        { id: 'all', label: 'Toutes', count: chambres.length },
        { id: "DISPONIBLE", label: 'Disponibles', count: chambres.filter(c => c.etatChambre === "DISPONIBLE").length },
        { id: "OCCUPEE", label: 'Occupées', count: chambres.filter(c => c.etatChambre === "OCCUPEE").length },
        { id: "MAINTENANCE", label: 'En maintenance', count: chambres.filter(c => c.etatChambre === "MAINTENANCE").length },
    ], [chambres]);

    // Calcul de la pagination
    const pageCount = Math.ceil(filteredChambres.length / itemsPerPage);
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredChambres.length);

    // Fonctions de gestion des chambres
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setChambreFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelectChange = (e: { id: string, value: number }) => {
        setChambreFormData(prev => ({ ...prev, [e.id]: e.value }));
        if (errors[e.id]) {
            setErrors(prev => ({ ...prev, [e.id]: '' }));
        }
    };

    const handleEdit = (chambre: IChambre) => {
        setSelectedChambre(chambre);
        setChambreFormData(chambre);
        setIsModalOpen(true);
    };

    const handleDelete = (chambre: IChambre) => {
        setSelectedChambre(chambre);
        setIsDeleteModalOpen(true);
    };

    const onSubmit = async () => {
        try {
            // Validation des données avec vérification de duplication
            const validation = validateChambreData(chambreFormData, chambres, selectedChambre);
            if (!validation.isValid) {
                setErrors(validation.errors);
                displayNotification({ 
                    type: 'error', 
                    content: 'Veuillez corriger les erreurs dans le formulaire' 
                });
                return;
            }

            setIsSaving(true);
            if (selectedChambre) {
                try {
                    const result = await dispatch(updateChambre({
                        chambreId: selectedChambre.chambreId,
                        chambre: {
                            chambreConfigId: chambreFormData.chambreConfigId || 0,
                            chambreNom: chambreFormData.chambreNom || "",
                            etatChambre: chambreFormData.etatChambre || "DISPONIBLE"
                        }
                    })).unwrap();
                    
                    if (result) {
                        displayNotification({ 
                            type: 'success', 
                            content: 'Chambre mise à jour avec succès' 
                        });
                        setIsModalOpen(false);
                        setSelectedChambre(null);
                        setChambreFormData(initialiseChambre);
                    } else {
                        throw new Error('La mise à jour a échoué');
                    }
                } catch (error: any) {
                    const errorMessage = error?.message || 'Erreur lors de la mise à jour de la chambre';
                    displayNotification({ 
                        type: 'error', 
                        content: errorMessage
                    });
                    throw error;
                }
            } else {
                try {
                    const createData = {
                        chambreConfigId: chambreFormData.chambreConfigId || 0,
                        chambreNom: chambreFormData.chambreNom || "",
                        etatChambre: chambreFormData.etatChambre || "DISPONIBLE",
                        residenceId: chambreFormData.residenceId || 0
                    };

                    const result = await dispatch(createChambre(createData)).unwrap();
                    
                    if (result) {
                        displayNotification({ 
                            type: 'success', 
                            content: 'Chambre créée avec succès' 
                        });
                        setIsModalOpen(false);
                        setSelectedChambre(null);
                        setChambreFormData(initialiseChambre);
                    } else {
                        throw new Error('La création a échoué');
                    }
                } catch (error: any) {
                    console.log("🚀 ~ onSubmit ~ error:", error)
                    const errorMessage = error?.message || 'Erreur lors de la création de la chambre';
                    displayNotification({ 
                        type: 'error', 
                        content: errorMessage
                    });
                    throw error;
                }
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'Une erreur est survenue lors de l\'opération';
            displayNotification({ 
                type: 'error', 
                content: errorMessage
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Fonction pour réinitialiser le formulaire
    const resetForm = () => {
        setChambreFormData(initialiseChambre);
        setErrors({});
        setSelectedChambre(null);
    };

    // Fonction pour ouvrir le modal d'ajout
    const handleAddClick = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedChambre) return;
        try {
            setIsDeleting(true);
            try {
                const result = await dispatch(deleteChambre(selectedChambre.chambreId)).unwrap();
                
                if (result) {
                    displayNotification({ 
                        type: 'success', 
                        content: 'Chambre supprimée avec succès' 
                    });
                    setIsDeleteModalOpen(false);
                    setSelectedChambre(null);
                } else {
                    throw new Error('La suppression a échoué');
                }
            } catch (error: any) {
                const errorMessage = error?.message || 'Erreur lors de la suppression de la chambre';
                displayNotification({ 
                    type: 'error', 
                    content: errorMessage
                });
                throw error;
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'Une erreur est survenue lors de la suppression';
            displayNotification({ 
                type: 'error', 
                content: errorMessage
            });
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        dispatch(fetchAllChambres());
        dispatch(fetchAllConfigChambres());
        dispatch(fetchAllResidences());
    }, [dispatch]);

    useEffect(() => {
        setPageIndex(0);
    }, [searchTerm, statusFilter, residenceFilter]);

    return {
        chambres: filteredChambres,
        configChambres,
        residences,
        loading,
        error,
        isModalOpen,
        selectedChambre,
        isDeleteModalOpen,
        message,
        notification,
        chambreFormData,
        errors,
        isSaving,
        isDeleting,
        searchTerm,
        setSearchTerm,
        residenceFilter,
        setResidenceFilter,
        statusFilter,
        setStatusFilter,
        tabsData,
        pageIndex,
        setPageIndex,
        pageCount,
        itemsPerPage,
        startIndex,
        endIndex,
        handleInputChange,
        handleSelectChange,
        handleEdit,
        handleDelete,
        onSubmit,
        handleDeleteConfirm,
        setIsModalOpen,
        setIsDeleteModalOpen,
        setChambreFormData,
        setSelectedChambre,
        notificationRef,
        handleAddClick
    };
}; 