import React, { useState, useEffect, useRef, RefObject } from 'react';
import { IReduxState } from '../../stores/store';
import Button from '../../base-components/Button';
import { FormInput } from '../../base-components/Form';
import Lucide from '../../base-components/Lucide';
import { Residence, ResidenceImage } from '../../schema/residence.schema';
import { CustomNotification } from '../../components/Notification';
import { NotificationElement } from '../../base-components/Notification';
import {
    fetchAllResidences,
    selectAllResidences,
    selectLoading,
    selectError
} from '../../stores/slices/residenceSlice';
import { useAppDispatch, useAppSelector } from '../../stores/store';
import ResidenceCard from './components/ResidenceCard';
import ResidenceForm from './components/ResidenceForm';
import DeleteDialog from './components/DeleteDialog';
import { useResidenceValidation } from './hooks/useResidenceValidation';
import { useResidenceManagement } from './hooks/useResidenceManagement';
import { useImageCarousel } from './hooks/useImageCarousel';
import { useNotification } from '../../hooks/useNotification';
import { FormErrors } from './types';

const Residences: React.FC = () => {
    const dispatch = useAppDispatch();
    const residences = useAppSelector(selectAllResidences);
    const loading = useAppSelector(selectLoading);
    const error = useAppSelector(selectError);
    const { validateForm } = useResidenceValidation();
    const notificationRef = useRef<NotificationElement>();
    const [notification, setNotification] = useState<{ type: 'success' | 'error', content: string } | undefined>();
    const { isLoading, isDeleting, isSaving, handleSaveResidence, handleDeleteResidence, handleRestoreResidence } = useResidenceManagement();
    const { activeImageIndex, handleNextImage, handlePrevImage } = useImageCarousel(residences);

    // États
    const [openSlideOver, setOpenSlideOver] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentResidence, setCurrentResidence] = useState<Residence | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [selectedResidenceId, setSelectedResidenceId] = useState<number | null>(null);

    // Charger les résidences au montage du composant
    useEffect(() => {
        dispatch(fetchAllResidences());
    }, [dispatch]);

    // Fonction pour afficher la notification
    const showNotification = () => notificationRef.current?.showToast();

    const displayNotification = (notification: { type: 'success' | 'error', content: string }) => {
        setNotification(notification);
        setTimeout(() => {
            showNotification();
        }, 30);
    };

    // Gestionnaires d'événements
    const handleAddResidence = () => {
        setEditMode(false);
        setCurrentResidence({
            residenceId: 0,
            residenceNom: '',
            residenceDescription: '',
            residenceImages: [] as ResidenceImage[],
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

    const handleDeleteClick = (residenceId: number) => {
        setSelectedResidenceId(residenceId);
        setOpenDeleteDialog(true);
    };

    const confirmDeleteResidence = async () => {
        if (selectedResidenceId === null) return;
        const success = await handleDeleteResidence(selectedResidenceId);
        if (success) {
            displayNotification({
                type: 'success',
                content: 'Résidence supprimée avec succès'
            });
            setOpenDeleteDialog(false);
            setSelectedResidenceId(null);
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

    const handleSaveClick = async () => {
        if (!currentResidence) return;
        const errors = validateForm(currentResidence);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            displayNotification({
                type: 'error',
                content: 'Veuillez corriger les erreurs dans le formulaire'
            });
            return;
        }

        const success = await handleSaveResidence(currentResidence, editMode);
        if (success) {
            displayNotification({
                type: 'success',
                content: editMode ? 'Résidence mise à jour avec succès' : 'Résidence créée avec succès'
            });
            setOpenSlideOver(false);
            setCurrentResidence(null);
        }
    };

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
                        onDelete={handleDeleteClick}
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
                    onSave={handleSaveClick}
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

            {notification && (
                <CustomNotification
                    message={notification.content}
                    notificationRef={notificationRef}
                    title="Info"
                    type={notification.type}
                />
            )}
        </>
    );
}

export default Residences;