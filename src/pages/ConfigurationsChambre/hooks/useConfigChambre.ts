import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../stores/store';
import {
    fetchAllConfigChambres,
    createConfigChambre,
    updateConfigChambre,
    deleteConfigChambre,
    activateConfigChambre,
    selectAllConfigChambres,
    selectConfigChambreLoading,
    selectConfigChambreError,
} from '../../../stores/slices/configChambreSlice';
import { toast } from 'react-toastify';
import { AnyAction } from '@reduxjs/toolkit';
import { IConfigChambre } from '../../../schema/configChambre.schema';
import { fetchAllResidences, selectAllResidences } from '../../../stores/slices/residenceSlice';

export const useConfigChambre = () => {
    const dispatch = useAppDispatch();
    const configChambres = useAppSelector(selectAllConfigChambres);
    const residences = useAppSelector(selectAllResidences);
    const loading = useAppSelector(selectConfigChambreLoading);
    const error = useAppSelector(selectConfigChambreError);

    const [openSlideOver, setOpenSlideOver] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentConfig, setCurrentConfig] = useState<IConfigChambre | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterResidence, setFilterResidence] = useState<number | "all">("all");
    const [filterType, setFilterType] = useState<number | "all">("all");
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [selectedConfigId, setSelectedConfigId] = useState<number | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});

    const typesChambre = [
        {
        typeChambreId: 1,
        typeChambreNom: 'Standard', 
    },
        {
            typeChambreId: 2,
            typeChambreNom: 'Premium',
        },
        {
            typeChambreId: 3,
            typeChambreNom: 'Mini Suite',
        },
        {
            typeChambreId: 4,
            typeChambreNom: 'Suite',
        }
]


    useEffect(() => {
        dispatch(fetchAllConfigChambres() as unknown as AnyAction);
        dispatch(fetchAllResidences());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const validateForm = (config: IConfigChambre): Record<string, string> => {
        const errors: Record<string, string> = {};

        if (!config.configChambreNom.trim()) {
            errors.nom = "Le nom est requis";
        }

        if (!config.configChambreDescription?.trim()) {
            errors.description = "La description est requise";
        }

        if (isNaN(config.configChambrePrixSemaine) || config.configChambrePrixSemaine < 5000) {
            errors.prixSemaine = "Le prix semaine doit être d'au moins 5 000 F CFA";
        }

        if (isNaN(config.configChambrePrixWeekend) || config.configChambrePrixWeekend < 5000) {
            errors.prixWeekend = "Le prix weekend doit être d'au moins 5 000 F CFA";
        }

        if (config.configCapaciteAdultes < 1) {
            errors.capaciteAdultes = "La capacité adultes doit être d'au moins 1";
        }

        if (!config.configChambreImages || config.configChambreImages.length === 0) {
            errors.images = "Au moins une image est requise";
        }

        return errors;
    };

    const handleAddConfiguration = () => {
        setEditMode(false);
        setCurrentConfig({
            configResidenceId: 1,
            configTypeChambreId: 1,
            configChambreNom: '',
            configChambreDescription: '',
            configChambrePrixSemaine: 10000,
            configChambrePrixWeekend: 10000,
            configCapaciteAdultes: 2,
            configChambreImages: [],
            configDateCreation: '',
            configDateModification: '',
            configAvantageChambre: [],
            configEquipementChambre: [],
            status: 1,
            residenceNom: '',
            residenceId: 1,
            typeChambreId: 1,
            typeChambreNom: '',
            configChambreId: 0,
            
        });
        setFormErrors({});
        setOpenSlideOver(true);
    };

    const handleEditConfiguration = (config: IConfigChambre) => {
        setEditMode(true);
        setCurrentConfig({ ...config });
        setFormErrors({});
        setOpenSlideOver(true);
    };

    const handleDeleteConfiguration = (configId: number) => {
        setSelectedConfigId(configId);
        setOpenDeleteDialog(true);
    };

    const confirmDeleteConfiguration = async () => {
        if (selectedConfigId !== null) {
            try {
                await dispatch(deleteConfigChambre(selectedConfigId) as unknown as AnyAction).unwrap();
                toast.success('Configuration supprimée avec succès');
                setOpenDeleteDialog(false);
                setSelectedConfigId(null);
            } catch (error) {
                toast.error('Erreur lors de la suppression de la configuration');
            }
        }
    };

    const handleActivateConfiguration = async (configId: number) => {
        try {
            await dispatch(activateConfigChambre(configId) as unknown as AnyAction).unwrap();
            toast.success('Configuration activée avec succès');
        } catch (error) {
            toast.error('Erreur lors de l\'activation de la configuration');
        }
    };

    const handleFormChange = (field: keyof IConfigChambre, value: any) => {
        if (currentConfig) {
            setCurrentConfig((prev: IConfigChambre | null) => prev ? { ...prev, [field]: value } : null);
            if (formErrors[field]) {
                setFormErrors((prev: Record<string, string>) => ({ ...prev, [field]: '' }));
            }
        }
    };

    const handleSaveConfiguration = async () => {
        if (!currentConfig) return;

        const errors = validateForm(currentConfig);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            let response;
            if (editMode) {
                response = await dispatch(updateConfigChambre(currentConfig) as unknown as AnyAction).unwrap();
            } else {
                response = await dispatch(createConfigChambre(currentConfig) as unknown as AnyAction).unwrap();
            }
            
            if (response?.error) {
                throw new Error(response.error);
            }

            setOpenSlideOver(false);
            setCurrentConfig(null);
            return { success: true };
        } catch (error: any) {
            console.error("Erreur lors de l'enregistrement:", error);
            if (error.message) {
                setFormErrors({ submit: error.message });
            } else {
                setFormErrors({ submit: 'Une erreur est survenue lors de l\'enregistrement' });
            }
            return { success: false, error: error.message || 'Une erreur est survenue' };
        }
    };

    const handleImageUpload = (files: File[]) => {
        if (!currentConfig) return;

        const promises = files.map(file => {
            return new Promise<any>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        filename: file.name,
                        principale: false,
                        data: reader.result as string
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then(images => {
            const updatedImages = [...(currentConfig.configChambreImages || []), ...images];
            const limitedImages = updatedImages.slice(0, 4);
            handleFormChange('configChambreImages', limitedImages);
        });
    };

    const handleRemoveImage = (index: number) => {
        if (!currentConfig) return;

        const updatedImages = [...(currentConfig.configChambreImages || [])];
        updatedImages.splice(index, 1);
        handleFormChange('configChambreImages', updatedImages);
    };

    const handleNextImage = (configId: number) => {
        const config = configChambres.find(c => c.configChambreId === configId);
        if (!config?.configChambreImages) return;

        const currentIndex = activeImageIndex[configId] || 0;
        const nextIndex = (currentIndex + 1) % config.configChambreImages.length;

        setActiveImageIndex({
            ...activeImageIndex,
            [configId]: nextIndex
        });
    };

    const handlePrevImage = (configId: number) => {
        const config = configChambres.find(c => c.configChambreId === configId);
        if (!config?.configChambreImages) return;

        const currentIndex = activeImageIndex[configId] || 0;
        const prevIndex = (currentIndex - 1 + config.configChambreImages.length) % config.configChambreImages.length;

        setActiveImageIndex({
            ...activeImageIndex,
            [configId]: prevIndex
        });
    };

    const filteredConfigurations = configChambres.filter(config =>
        (searchTerm === "" ||
            config.configChambreNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            config.configChambreDescription?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterResidence === "all" || config.configResidenceId === filterResidence) &&
        (filterType === "all" || config.configTypeChambreId === filterType)
    );

    return {
        residences,
        typesChambre,
        loading,
        error,
        openSlideOver,
        setOpenSlideOver,
        openDeleteDialog,
        setOpenDeleteDialog,
        editMode,
        currentConfig,
        searchTerm,
        setSearchTerm,
        filterResidence,
        setFilterResidence,
        filterType,
        setFilterType,
        formErrors,
        selectedConfigId,
        activeImageIndex,
        filteredConfigurations,
        handleAddConfiguration,
        handleEditConfiguration,
        handleDeleteConfiguration,
        confirmDeleteConfiguration,
        handleActivateConfiguration,
        handleFormChange,
        handleSaveConfiguration,
        handleImageUpload,
        handleRemoveImage,
        handleNextImage,
        handlePrevImage,
    };
}; 