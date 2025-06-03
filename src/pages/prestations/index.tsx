import React, { useEffect } from 'react';
import { FormInput } from '../../base-components/Form';
import Lucide from '../../base-components/Lucide';
import { CustomNotification } from '../../components/Notification';
import { fetchAllPrestations } from '../../stores/slices/prestationSlice';
import { useAppDispatch } from '../../stores/store';
import DeleteDialog from './components/DeleteDialog';
import PrestationCard from './components/PrestationCard';
import PrestationForm from './components/PrestationForm';
import { usePrestations } from './hooks/usePrestations';

const Prestations: React.FC = () => {
    const dispatch = useAppDispatch();
    const {
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
    } = usePrestations();

    // Charger les prestations au montage du composant
    useEffect(() => {
        dispatch(fetchAllPrestations());
    }, [dispatch]);

    // Filtrer les prestations selon la recherche
    const filteredPrestations = prestations.filter(prestation =>
        prestation.status === 1 &&
        (searchTerm === "" ||
            prestation.prestationNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prestation.prestationDescription?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <>
            <div className="flex flex-col items-start mt-8 intro-y sm:flex-row sm:items-center sm:justify-between">
                <h2 className="mr-auto text-lg font-medium">Prestations</h2>
                <div className="flex w-full sm:w-auto sm:flex-row gap-2">
                    <FormInput
                        type="text"
                        placeholder="Rechercher une prestation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 shadow-md"
                    />
                    {/* <Button
                        variant="primary"
                        className="shadow-md whitespace-nowrap"
                        onClick={handleAddPrestation}
                    >
                        <Lucide icon="Plus" className="w-4 h-4 mr-1" /> Ajouter une prestation
                    </Button> */}
                </div>
            </div>

            {filteredPrestations.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 mt-5 border rounded-md intro-y border-slate-200">
                    <Lucide icon="Search" className="w-12 h-12 text-slate-300" />
                    <p className="mt-2 text-slate-500">Aucune prestation trouvée</p>
                </div>
            )}

            <div className="grid grid-cols-12 gap-6 mt-5 intro-y">
                {filteredPrestations.map((prestation) => (
                    <PrestationCard
                        key={prestation.prestationId}
                        prestation={prestation}
                        activeImageIndex={activeImageIndex[prestation.prestationId] || 0}
                        onEdit={handleEditPrestation}
                        onDelete={handleDeletePrestation}
                        onRestore={handleRestorePrestation}
                        onNextImage={handleNextImage}
                        onPrevImage={handlePrevImage}
                    />
                ))}
            </div>

            {openSlideOver && currentPrestation && (
                <PrestationForm
                    currentPrestation={currentPrestation}
                    editMode={editMode}
                    formErrors={formErrors}
                    onFormChange={handleFormChange}
                    onSave={handleSavePrestation}
                    onCancel={() => {
                        if (!isSaving) {
                            setOpenSlideOver(false);
                            setCurrentPrestation(null);
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
                        setSelectedPrestationId(null);
                    }
                }}
                onConfirm={confirmDeletePrestation}
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

export default Prestations;