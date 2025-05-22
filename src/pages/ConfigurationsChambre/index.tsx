import React, { useRef, useState } from 'react';
import { Slideover, Dialog } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import Button from '../../base-components/Button';
import LoadingIcon from '../../base-components/LoadingIcon';
import { useConfigChambre } from './hooks/useConfigChambre';
import ConfigCard from './components/ConfigCard';
import ConfigForm from './components/ConfigForm';
import SearchAndFilters from './components/SearchAndFilters';
import { IConfigChambre } from '../../schema/configChambre.schema';
import { NotificationElement } from '../../base-components/Notification';
import { CustomNotification, INotification } from '../../components/Notification';
// Données d'exemple pour les résidences et types de chambres
const initialResidences = [
    { residenceId: 1, residenceNom: 'Résidence Principale' },
    { residenceId: 2, residenceNom: 'Résidence Secondaire' },
];

const initialTypesChambre = [
    { typeId: 1, typeNom: 'Standard', typeDescription: 'Chambre standard' },
    { typeId: 2, typeNom: 'Suite', typeDescription: 'Suite luxueuse' },
];

const ConfigurationsChambre: React.FC = () => {
    const {
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
        handleFormChange,
        handleSaveConfiguration,
        handleImageUpload,
        handleRemoveImage,
        handleNextImage,
        handlePrevImage,
    } = useConfigChambre();

    const notificationRef = useRef<NotificationElement>();
    const [notification, setNotification] = useState<INotification | undefined>();

    // États de chargement
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const showNotification = () => notificationRef.current?.showToast();

    const displayNotification = (notification: INotification) => {
        setNotification(notification);
        setTimeout(() => {
            showNotification();
        }, 30);
    };

    // Wrapper pour handleSaveConfiguration avec notification
    const handleSaveWithNotification = async () => {
        setIsSaving(true);
        try {
            await handleSaveConfiguration();
            displayNotification({
                type: "success",
                content: editMode ? "La configuration a été modifiée avec succès" : "La configuration a été créée avec succès"
            });
            setOpenSlideOver(false);
        } catch (error) {
            displayNotification({
                type: "error",
                content: "Une erreur est survenue lors de la sauvegarde"
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Wrapper pour confirmDeleteConfiguration avec notification
    const handleDeleteWithNotification = async () => {
        setIsDeleting(true);
        try {
            await confirmDeleteConfiguration();
            displayNotification({
                type: "success",
                content: "La configuration a été supprimée avec succès"
            });
            setOpenDeleteDialog(false);
        } catch (error) {
            displayNotification({
                type: "error",
                content: "Une erreur est survenue lors de la suppression"
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const getResidenceName = (id: number) => {
        return initialResidences.find(r => r.residenceId === id)?.residenceNom || 'Résidence inconnue';
    };

    const getTypeName = (id: number) => {
        return initialTypesChambre.find(t => t.typeId === id)?.typeNom || 'Type inconnu';
    };

    return (
        <div className="p-5 mt-5 box">
            <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterResidence={filterResidence}
                onFilterResidenceChange={setFilterResidence}
                filterType={filterType}
                onFilterTypeChange={setFilterType}
                onAddClick={handleAddConfiguration}
                residences={residences}
                typesChambre={typesChambre}
            />

            {filteredConfigurations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                    <Lucide icon="Search" className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Aucune configuration trouvée</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Essayez de modifier vos filtres ou d'ajouter une nouvelle configuration.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {filteredConfigurations.map((config: IConfigChambre) => (
                        <ConfigCard
                            key={config.configChambreId}
                            config={config}
                            activeImageIndex={activeImageIndex[config.configChambreId ?? 0] ?? 0}
                            onNextImage={() => config.configChambreId && handleNextImage(config.configChambreId)}
                            onPrevImage={() => config.configChambreId && handlePrevImage(config.configChambreId)}
                            onEdit={handleEditConfiguration}
                            onDelete={handleDeleteConfiguration}
                            getResidenceName={getResidenceName}
                            getTypeName={getTypeName}
                        />
                    ))}
                </div>
            )}

            {/* Slideover pour ajouter/modifier une configuration */}
            <Slideover
                size="md"
                open={openSlideOver}
                onClose={() => {
                    setOpenSlideOver(false);
                }}
            >
                <Slideover.Panel>
                    <button
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setOpenSlideOver(false);
                        }}
                        className="absolute top-0 left-0 right-auto mt-4 -ml-12"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </button>
                    <Slideover.Title className="p-5">
                        <h2 className="mr-auto text-base font-medium">
                            {editMode ? 'Modifier la configuration' : 'Ajouter une configuration'}
                        </h2>
                    </Slideover.Title>
                    <Slideover.Description className="px-5 py-3 overflow-y-auto max-h-[calc(100vh-200px)]">
                        {currentConfig && (
                            <ConfigForm
                                currentConfig={currentConfig}
                                formErrors={formErrors}
                                onFormChange={handleFormChange}
                                onImageUpload={handleImageUpload}
                                onRemoveImage={handleRemoveImage}
                                residences={residences}
                                typesChambre={typesChambre}
                            />
                        )}
                    </Slideover.Description>
                    <Slideover.Footer className="absolute bottom-0 px-5 py-3 bg-white border-t w-full">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => {
                                setOpenSlideOver(false);
                            }}
                            className="w-24 mr-1"
                            disabled={isSaving}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            onClick={handleSaveWithNotification}
                            className="w-24"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <LoadingIcon icon="oval" color="white" className="w-4 h-4 mr-2" />
                                    Enregistrement...
                                </>
                            ) : (
                                'Enregistrer'
                            )}
                        </Button>
                    </Slideover.Footer>
                </Slideover.Panel>
            </Slideover>

            {/* Dialog de confirmation de suppression */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => {
                    setOpenDeleteDialog(false);
                }}
            >
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide icon="AlertTriangle" className="w-16 h-16 mx-auto mt-3 text-danger" />
                        <div className="mt-5 text-3xl">Êtes-vous sûr?</div>
                        <div className="mt-2 text-slate-500">
                            Voulez-vous vraiment supprimer cette configuration? <br />
                            Cette action ne peut pas être annulée.
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => {
                                setOpenDeleteDialog(false);
                            }}
                            className="w-24 mr-1"
                            disabled={isDeleting}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="danger"
                            type="button"
                            onClick={handleDeleteWithNotification}
                            className="w-24"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <LoadingIcon icon="oval" color="white" className="w-4 h-4 mr-2" />
                                    Suppression...
                                </>
                            ) : (
                                'Supprimer'
                            )}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>

            <CustomNotification
                message={notification?.content}
                notificationRef={notificationRef}
                title={"Info"}
                type={notification?.type}
            />
        </div>
    );
};

export default ConfigurationsChambre;