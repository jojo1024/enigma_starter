import React, { useState, useEffect, useRef } from 'react';
import { IReduxState } from '../../stores/store';
import Button from '../../base-components/Button';
import { FormInput } from '../../base-components/Form';
import Lucide from '../../base-components/Lucide';
import { Residence, CreateResidence, UpdateResidence } from '../../schema/residence.schema';
import { NotificationElement } from '../../base-components/Notification';
import { CustomNotification, INotification } from '../../components/Notification';
import {
    fetchAllResidences,
    createResidence,
    updateResidence,
    deleteResidence,
    activateResidence,
    selectAllResidences,
    selectLoading,
    selectError
} from '../../stores/slices/residenceSlice';
import { useAppDispatch, useAppSelector } from '../../stores/store';
import ResidenceCard from './components/ResidenceCard';
import ResidenceForm from './components/ResidenceForm';
import DeleteDialog from './components/DeleteDialog';
import { useResidenceValidation } from './hooks/useResidenceValidation';
import { FormErrors } from './types';

const Residences: React.FC = () => {
    const dispatch = useAppDispatch();
    const residences = useAppSelector(selectAllResidences);
    const loading = useAppSelector(selectLoading);
    const error = useAppSelector(selectError);
    const { validateForm } = useResidenceValidation();
    const notificationRef = useRef<NotificationElement>();
    const [notification, setNotification] = useState<INotification | undefined>();

    const showNotification = () => notificationRef.current?.showToast();

    const displayNotification = (notification: INotification) => {
        setNotification(notification);
        setTimeout(() => {
            showNotification();
        }, 30);
    };

    // États
    const [openSlideOver, setOpenSlideOver] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentResidence, setCurrentResidence] = useState<Residence | null>(null);
    console.log("🚀 ~ currentResidence:", currentResidence)
    const [searchTerm, setSearchTerm] = useState("");
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [selectedResidenceId, setSelectedResidenceId] = useState<number | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});

    // États de chargement
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Charger les résidences au montage du composant
    useEffect(() => {
        dispatch(fetchAllResidences());
    }, [dispatch]);

    // Gestionnaires d'événements
    const handleAddResidence = () => {
        setEditMode(false);
        setCurrentResidence({
            residenceId: 0,
            residenceNom: '',
            residenceDescription: '',
            residenceImages: [],
            residencePrixDeBase: 0,
            residenceTelephone: '+225 ',
            residenceEmail: '',
            residenceAdresse: '',
            residenceLocalisation: {
                latitude: 0,
                longitude: 0
            },
            status: 1,
            residenceDateCreation: new Date(),
            residenceDateModification: new Date()
        });
        setFormErrors({});
        setOpenSlideOver(true);
    };

    const handleEditResidence = (residence: Residence) => {
        setEditMode(true);
        setCurrentResidence({ ...residence });
        setFormErrors({});
        setOpenSlideOver(true);
    };

    const handleDeleteResidence = (residenceId: number) => {
        setSelectedResidenceId(residenceId);
        setOpenDeleteDialog(true);
    };

    const confirmDeleteResidence = async () => {
        if (selectedResidenceId === null) return;

        setIsDeleting(true);
        try {
            await dispatch(deleteResidence(selectedResidenceId)).unwrap();
            displayNotification({
                type: "success",
                content: "La résidence a été supprimée avec succès"
            });
            setOpenDeleteDialog(false);
            setSelectedResidenceId(null);
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

    const handleRestoreResidence = async (residenceId: number) => {
        setIsLoading(true);
        try {
            await dispatch(activateResidence(residenceId)).unwrap();
            displayNotification({
                type: "success",
                content: "La résidence a été restaurée avec succès"
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

    const handleFormChange = (field: keyof Residence, value: any) => {
        if (currentResidence) {
            setCurrentResidence(prev => prev ? { ...prev, [field]: value } : null);
            if (formErrors[field]) {
                setFormErrors(prev => ({ ...prev, [field]: '' }));
            }
        }
    };

    const handleSaveResidence = async () => {
        if (!currentResidence) return;
        const errors = validateForm(currentResidence);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsSaving(true);
        try {
            if (editMode) {
                await dispatch(updateResidence(currentResidence as UpdateResidence)).unwrap();
                displayNotification({
                    type: "success",
                    content: "La résidence a été modifiée avec succès"
                });
            } else {
                await dispatch(createResidence(currentResidence as CreateResidence)).unwrap();
                displayNotification({
                    type: "success",
                    content: "La résidence a été créée avec succès"
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
            setCurrentResidence(null);
            setIsSaving(false);
        }
    };

    // Gérer le carousel d'images
    const handleNextImage = (residenceId: number) => {
        const residence = residences.find(r => r.residenceId === residenceId);
        if (!residence?.residenceImages) return;

        const currentIndex = activeImageIndex[residenceId] || 0;
        const nextIndex = (currentIndex + 1) % residence.residenceImages.length;

        setActiveImageIndex({
            ...activeImageIndex,
            [residenceId]: nextIndex
        });
    };

    const handlePrevImage = (residenceId: number) => {
        const residence = residences.find(r => r.residenceId === residenceId);
        if (!residence?.residenceImages) return;

        const currentIndex = activeImageIndex[residenceId] || 0;
        const prevIndex = (currentIndex - 1 + residence.residenceImages.length) % residence.residenceImages.length;

        setActiveImageIndex({
            ...activeImageIndex,
            [residenceId]: prevIndex
        });
    };

    // Initialiser les indices d'image actifs
    useEffect(() => {
        const initialIndices: Record<number, number> = {};
        residences.forEach(residence => {
            initialIndices[residence.residenceId] = 0;
        });
        setActiveImageIndex(initialIndices);
    }, [residences]);

    // Filtrer les résidences selon la recherche
    const filteredResidences = residences.filter(residence =>
        residence.status === 1 &&
        (searchTerm === "" ||
            residence.residenceNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            residence.residenceAdresse?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <>
            <div className="flex flex-col items-start mt-8 intro-y sm:flex-row sm:items-center sm:justify-between">
                <h2 className="mr-auto text-lg font-medium">Résidences</h2>
                <div className="flex w-full sm:w-auto sm:flex-row gap-2">
                    <FormInput
                        type="text"
                        placeholder="Rechercher une résidence..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 shadow-md"
                    />
                    <Button
                        variant="primary"
                        className="shadow-md whitespace-nowrap"
                        onClick={handleAddResidence}
                    >
                        <Lucide icon="Plus" className="w-4 h-4 mr-1" /> Ajouter une résidence
                    </Button>
                </div>
            </div>

            {filteredResidences.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 mt-5 border rounded-md intro-y border-slate-200">
                    <Lucide icon="Search" className="w-12 h-12 text-slate-300" />
                    <p className="mt-2 text-slate-500">Aucune résidence trouvée</p>
                </div>
            )}

            <div className="grid grid-cols-12 gap-6 mt-5 intro-y">
                {filteredResidences.map((residence) => (
                    <ResidenceCard
                        key={residence.residenceId}
                        residence={residence}
                        activeImageIndex={activeImageIndex[residence.residenceId] || 0}
                        onEdit={handleEditResidence}
                        onDelete={handleDeleteResidence}
                        onRestore={handleRestoreResidence}
                        onNextImage={handleNextImage}
                        onPrevImage={handlePrevImage}
                    />
                ))}
            </div>

            {openSlideOver && currentResidence && (
                <ResidenceForm
                    // @ts-ignore
                    currentResidence={currentResidence}
                    editMode={editMode}
                    formErrors={formErrors}
                    onFormChange={handleFormChange}
                    onSave={handleSaveResidence}
                    onCancel={() => {
                        if (!isSaving) {
                            setOpenSlideOver(false);
                            setCurrentResidence(null);
                            setFormErrors({});
                        }
                    }}
                    isSaving={isSaving}
                />
            )}

            <DeleteDialog
                isOpen={openDeleteDialog}
                onClose={() => {
                    if (!isDeleting) {
                        setOpenDeleteDialog(false);
                        setSelectedResidenceId(null);
                    }
                }}
                onConfirm={confirmDeleteResidence}
                isDeleting={isDeleting}
            />

            <CustomNotification
                message={notification?.content}
                notificationRef={notificationRef}
                title={"Info"}
                type={notification?.type}
            />
        </>
    );
}

export default Residences;