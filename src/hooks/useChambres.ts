import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../stores/store';
import { 
    fetchAllChambres, 
    createChambre, 
    updateChambre, 
    deleteChambre,
    selectAllChambres,
    selectChambreLoading
} from '../stores/slices/ChambreSlice';
import { IChambre, ChambreStatus, CreateChambre, UpdateChambre } from '../schema/chambre.schema';
import { Residence } from '../schema/residence.schema';
import { fetchAllConfigChambres, selectAllConfigChambres } from '../stores/slices/configChambreSlice';
import { INotification } from '../components/Notification';
import { NotificationElement } from '../base-components/Notification';

export const useChambres = () => {
    const dispatch = useDispatch<AppDispatch>();
    const chambres = useSelector(selectAllChambres);
    const configChambres = useSelector(selectAllConfigChambres);
    const loading = useSelector(selectChambreLoading);
   
    const notificationRef = useRef<NotificationElement>();
    const [notification, setNotification] = useState<INotification | undefined>();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedResidence, setSelectedResidence] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<ChambreStatus | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [pageIndex, setPageIndex] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(fetchAllChambres());
        dispatch(fetchAllConfigChambres());
    }, [dispatch]);

    // Extraire les résidences et types uniques
    const residences = Array.from(new Set(chambres.map((c: IChambre) => c.residenceId)))
        .map(id => chambres.find((c: IChambre) => c.residenceId === id))
        .filter((r): r is IChambre => r !== undefined)
        .map(r => ({
            residenceId: r.residenceId,
            residenceNom: r.residenceNom,
            status: 1,
            residencePrixDeBase: 0,
            residenceDateCreation: new Date(),
            residenceDateModification: new Date(),
            residenceDescription: '',
            residenceAdresse: '',
            residenceTelephone: '',
            residenceEmail: '',
            residenceImages: []
        } as Residence));

    const typesChambre = Array.from(new Set(chambres.map((c: IChambre) => c.typeChambreId)))
        .map(id => chambres.find((c: IChambre) => c.typeChambreId === id))
        .filter((t): t is IChambre => t !== undefined)
        .map(t => ({ typeChambreId: t.typeChambreId, typeChambreNom: t.typeChambreNom }));

    // Filtrer les chambres
    const filteredChambres = chambres.filter((chambre: IChambre) => {
        const matchesSearch = chambre.chambreNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chambre.typeChambreNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chambre.residenceNom.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesResidence = !selectedResidence || chambre.residenceId === selectedResidence;
        const matchesType = !selectedType || chambre.typeChambreId === selectedType;
        const matchesStatus = selectedStatus === null || chambre.etatChambre === selectedStatus;
        return matchesSearch && matchesResidence && matchesType && matchesStatus;
    });

    // Pagination
    const pageCount = Math.ceil(filteredChambres.length / itemsPerPage);
    const paginatedChambres = filteredChambres.slice(
        pageIndex * itemsPerPage,
        (pageIndex + 1) * itemsPerPage
    );

    const validateForm = () => {
        return true;
    }

    const showNotification = () => notificationRef.current?.showToast();

    const displayNotification = (notification: INotification) => {
        setNotification(notification);
        setTimeout(() => {
            showNotification();
        }, 30);
    };

   

    const handleCreateChambre = async (chambre: Partial<IChambre>) => {
        try {
            if (!chambre.chambreConfigId || !chambre.chambreNom || !chambre.etatChambre) {
                throw new Error('Tous les champs obligatoires doivent être remplis');
            }

            const createChambreData: CreateChambre = {
                chambreConfigId: chambre.chambreConfigId,
                chambreNom: chambre.chambreNom,
                etatChambre: chambre.etatChambre
            };

            await dispatch(createChambre(createChambreData));
            return true;
        } catch (error) {
            console.error('Erreur lors de la création de la chambre:', error);
            return false;
        }
    };

    const handleUpdateChambre = async (chambreId: number, chambre: Partial<IChambre>) => {
        try {
            if (!chambre.chambreConfigId || !chambre.chambreNom || !chambre.etatChambre) {
                throw new Error('Tous les champs obligatoires doivent être remplis');
            }

            const updateChambreData: UpdateChambre = {
                chambreConfigId: chambre.chambreConfigId,
                chambreNom: chambre.chambreNom,
                etatChambre: chambre.etatChambre
            };

            await dispatch(updateChambre({ chambreId, chambre: updateChambreData }));
            return true;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la chambre:', error);
            return false;
        }
    };

    const handleDeleteChambre = async (chambreId: number) => {
        try {
            await dispatch(deleteChambre(chambreId));
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de la chambre:', error);
            return false;
        }
    };

    return {
        chambres: paginatedChambres,
        loading,
        searchTerm,
        selectedResidence,
        selectedType,
        selectedStatus,
        residences,
        configChambres,
        typesChambre,
        pageIndex,
        pageCount,
        itemsPerPage,
        setSearchTerm,
        setSelectedResidence,
        setSelectedType,
        setSelectedStatus,
        setPageIndex,
        handleCreateChambre,
        handleUpdateChambre,
        handleDeleteChambre
    };
}; 