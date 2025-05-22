import { useState, useRef } from 'react';
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
import { selectAllConfigChambres } from '../../../stores/slices/configChambreSlice';

const initialiseChambre: Partial<IChambre> = {
    chambreNom: "",
    chambreConfigId: 0,
    etatChambre: ChambreStatus.DISPONIBLE,
    residenceId: 0
};

export const useChambres = () => {
    const dispatch = useAppDispatch();
    const notificationRef = useRef<NotificationElement>();
    const chambres = useAppSelector(selectAllChambres);
    const configChambres = useAppSelector(selectAllConfigChambres);
    const loading = useAppSelector(selectChambreLoading);
    const error = useAppSelector(selectChambreError);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChambre, setSelectedChambre] = useState<Partial<IChambre> | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [notification, setNotification] = useState<INotification | undefined>();
    const [chambreFormData, setChambreFormData] = useState<Partial<IChambre>>(initialiseChambre);
    console.log("🚀 ~ useChambres ~ chambreFormData:", chambreFormData)
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setChambreFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSelectChange = (e: { id: string, value: number }) => {
        setChambreFormData(prev => ({
            ...prev,
            [e.id]: e.value
        }));
    };

    const handleEdit = (chambre: IChambre) => {
        setSelectedChambre(chambre);
        setChambreFormData({
            chambreId: chambre.chambreId,
            chambreConfigId: chambre.chambreConfigId,
            chambreNom: chambre.chambreNom,
            etatChambre: chambre.etatChambre,
            residenceId: chambre.residenceId
        });
        setIsModalOpen(true);
    };

    const handleDelete = (chambre: IChambre) => {
        setSelectedChambre(chambre);
        setIsDeleteModalOpen(true);
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!chambreFormData.chambreNom) {
            newErrors.chambreNom = "Le nom de la chambre est requis";
        }
        if (!chambreFormData.chambreConfigId || chambreFormData.chambreConfigId === 0) {
            newErrors.chambreConfigId = "La configuration de la chambre est requise";
        }
        if (!chambreFormData.residenceId || chambreFormData.residenceId === 0) {
            newErrors.residenceId = "La résidence est requise";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const showNotification = () => notificationRef.current?.showToast();

    const displayNotification = (notification: INotification) => {
        setNotification(notification);
        setTimeout(() => {
            showNotification();
        }, 30);
    };

    const onSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        setIsSaving(true);
        try {
            if (selectedChambre?.chambreId) {
                await dispatch(updateChambre({
                    chambreId: selectedChambre.chambreId,
                    chambre: {
                        chambreConfigId: chambreFormData.chambreConfigId || 0,
                        chambreNom: chambreFormData.chambreNom || "",
                        etatChambre: chambreFormData.etatChambre || ChambreStatus.DISPONIBLE
                    }
                })).unwrap();
                displayNotification({
                    type: "success",
                    content: "Chambre mise à jour avec succès"
                });
            } else {
                await dispatch(createChambre({
                    chambreConfigId: chambreFormData.chambreConfigId || 0,
                    chambreNom: chambreFormData.chambreNom || "",
                    etatChambre: chambreFormData.etatChambre || ChambreStatus.DISPONIBLE
                })).unwrap();
                displayNotification({
                    type: "success",
                    content: "Chambre créée avec succès"
                });
            }
            setIsModalOpen(false);
            setChambreFormData(initialiseChambre);
            setSelectedChambre(null);
        } catch (error) {
            displayNotification({
                type: "error",
                content: "Une erreur est survenue"
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedChambre?.chambreId) {
            setIsDeleting(true);
            try {
                await dispatch(deleteChambre(selectedChambre.chambreId)).unwrap();
                displayNotification({
                    type: "success",
                    content: "Chambre supprimée avec succès"
                });
                setIsDeleteModalOpen(false);
                setSelectedChambre(null);
            } catch (error) {
                displayNotification({
                    type: "error",
                    content: "Une erreur est survenue lors de la suppression"
                });
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return {
        chambres,
        configChambres,
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
        notificationRef
    };
}; 