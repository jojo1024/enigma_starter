import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../stores/store';
import { Prestation } from '../../../schema/prestation.schema';
import { INotification } from '../../../components/Notification';
import { NotificationElement } from '../../../base-components/Notification';
import {
    fetchAllPrestations,
    createPrestation,
    updatePrestation,
    deletePrestation,
    activatePrestation,
    selectAllPrestations,
    selectLoading,
    selectError
} from '../../../stores/slices/prestationSlice';
import { usePrestationValidation } from './usePrestationValidation';
import { FormErrors } from '../../../utils/types';

export const usePrestations = () => {
    const dispatch = useAppDispatch();
    const prestations = useAppSelector(selectAllPrestations);
    const loading = useAppSelector(selectLoading);
    const error = useAppSelector(selectError);
    const { validateForm } = usePrestationValidation();
    const notificationRef = useRef<NotificationElement>();
    const [notification, setNotification] = useState<INotification | undefined>();

    // États
    const [openSlideOver, setOpenSlideOver] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentPrestation, setCurrentPrestation] = useState<Prestation | null>(null);
    console.log("🚀 ~ usePrestations ~ currentPrestation:", currentPrestation)
    const [searchTerm, setSearchTerm] = useState("");
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [selectedPrestationId, setSelectedPrestationId] = useState<number | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // États de chargement
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Initialiser les indices d'image actifs
    useEffect(() => {
        const initialIndices: Record<number, number> = {};
        prestations.forEach(prestation => {
            initialIndices[prestation.prestationId] = 0;
        });
        setActiveImageIndex(initialIndices);
    }, [prestations]);

    const showNotification = () => notificationRef.current?.showToast();

    const displayNotification = (notification: INotification) => {
        setNotification(notification);
        setTimeout(() => {
            showNotification();
        }, 30);
    };

    const handleAddPrestation = () => {
        setEditMode(false);
        setCurrentPrestation({
            prestationId: 0,
            prestationNom: '',
            prestationDescription: '',
            prestationImages: [],
            status: 1,
            prestationDateCreation: new Date()
        });
        setFormErrors({});
        setSelectedImages([]);
        setPreviewUrls([]);
        setOpenSlideOver(true);
    };

    const handleEditPrestation = (prestation: Prestation) => {
        setEditMode(true);
        setCurrentPrestation({ ...prestation });
        setFormErrors({});
        setSelectedImages([]);
        setPreviewUrls([]);
        setOpenSlideOver(true);
    };

    const handleDeletePrestation = (prestationId: number) => {
        setSelectedPrestationId(prestationId);
        setOpenDeleteDialog(true);
    };

    const confirmDeletePrestation = async () => {
        if (selectedPrestationId === null) return;

        setIsDeleting(true);
        try {
            await dispatch(deletePrestation(selectedPrestationId)).unwrap();
            displayNotification({
                type: "success",
                content: "La prestation a été supprimée avec succès"
            });
            setOpenDeleteDialog(false);
            setSelectedPrestationId(null);
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            displayNotification({
                type: "error",
                content: "Une erreur est survenue lors de la suppression"
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRestorePrestation = async (prestationId: number) => {
        setIsLoading(true);
        try {
            await dispatch(activatePrestation(prestationId)).unwrap();
            displayNotification({
                type: "success",
                content: "La prestation a été restaurée avec succès"
            });
        } catch (error) {
            console.error('Erreur lors de la restauration:', error);
            displayNotification({
                type: "error",
                content: "Une erreur est survenue lors de la restauration"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormChange = (field: keyof Prestation, value: any) => {
        if (currentPrestation) {
            setCurrentPrestation(prev => prev ? { ...prev, [field]: value } : null);
            if (formErrors[field as keyof FormErrors]) {
                setFormErrors(prev => ({ ...prev, [field]: '' }));
            }
        }
    };

    const handleImageChange = (files: File[]) => {
        setSelectedImages(files);
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const handleRemoveImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSavePrestation = async () => {
        if (!currentPrestation) return;
        const errors = validateForm(currentPrestation);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsSaving(true);
        try {
         
            if (editMode) {
                await dispatch(updatePrestation(currentPrestation )).unwrap();
                displayNotification({
                    type: "success",
                    content: "La prestation a été modifiée avec succès"
                });
            } else {
                await dispatch(createPrestation(currentPrestation)).unwrap();
                displayNotification({
                    type: "success",
                    content: "La prestation a été créée avec succès"
                });
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            displayNotification({
                type: "error",
                content: "Une erreur est survenue lors de la sauvegarde"
            });
        } finally {
            setOpenSlideOver(false);
            setCurrentPrestation(null);
            setSelectedImages([]);
            setPreviewUrls([]);
            setIsSaving(false);
        }
    };

    const handleNextImage = (prestationId: number) => {
        const prestation = prestations.find(p => p.prestationId === prestationId);
        if (!prestation?.prestationImages) return;

        const currentIndex = activeImageIndex[prestationId] || 0;
        const nextIndex = (currentIndex + 1) % prestation.prestationImages.length;

        setActiveImageIndex({
            ...activeImageIndex,
            [prestationId]: nextIndex
        });
    };

    const handlePrevImage = (prestationId: number) => {
        const prestation = prestations.find(p => p.prestationId === prestationId);
        if (!prestation?.prestationImages) return;

        const currentIndex = activeImageIndex[prestationId] || 0;
        const prevIndex = (currentIndex - 1 + prestation.prestationImages.length) % prestation.prestationImages.length;

        setActiveImageIndex({
            ...activeImageIndex,
            [prestationId]: prevIndex
        });
    };

    return {
        prestations,
        loading,
        error,
        notification,
        notificationRef,
        openSlideOver,
        openDeleteDialog,
        editMode,
        currentPrestation,
        searchTerm,
        formErrors,
        selectedPrestationId,
        activeImageIndex,
        isLoading,
        isDeleting,
        isSaving,
        selectedImages,
        previewUrls,
        setSearchTerm,
        handleAddPrestation,
        handleEditPrestation,
        handleDeletePrestation,
        confirmDeletePrestation,
        handleRestorePrestation,
        handleFormChange,
        handleImageChange,
        handleRemoveImage,
        handleSavePrestation,
        handleNextImage,
        handlePrevImage,
        setOpenSlideOver,
        setOpenDeleteDialog,
        setCurrentPrestation,
        setFormErrors,
        setSelectedPrestationId
    };
}; 