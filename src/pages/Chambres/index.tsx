import { useEffect, useState } from 'react';
import Button from '../../base-components/Button';
import Lucide from '../../base-components/Lucide';
import ChambreForm from '../../components/ChambreForm';
import ChambreTable from '../../components/chambres/ChambreTable';
import ConfirmeBox from '../../components/ConfirmeBox';
import DialogBox from '../../components/DialogBox';
import { CustomNotification } from '../../components/Notification';
import { ChambreStatus } from '../../schema/chambre.schema';
import { fetchAllChambres } from '../../stores/slices/ChambreSlice';
import { fetchAllConfigChambres } from '../../stores/slices/configChambreSlice';
import { useAppDispatch } from '../../stores/store';
import { useChambres } from './hooks/useChambres';

const Chambres = () => {
    const dispatch = useAppDispatch();
    const [pageIndex, setPageIndex] = useState(0);
    const itemsPerPage = 10;

    const {
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
    } = useChambres();

    useEffect(() => {
        dispatch(fetchAllChambres());
        dispatch(fetchAllConfigChambres());
    }, [dispatch]);

    const pageCount = Math.ceil(chambres.length / itemsPerPage);
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, chambres.length);

    return (
        <>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Gestion des Chambres</h2>
                <Button
                    variant="primary"
                    onClick={() => {
                        setSelectedChambre(null);
                        setChambreFormData({
                            chambreNom: "",
                            chambreConfigId: 0,
                            etatChambre: ChambreStatus.DISPONIBLE,
                            residenceId: 0
                        });
                        setIsModalOpen(true);
                    }}
                    className="btn btn-primary"
                >
                    <Lucide icon="Plus" className="w-4 h-4 mr-1" />
                    Ajouter une chambre
                </Button>
            </div>

            <DialogBox
                dialogProps={{
                    dialogTitle: selectedChambre ? "Modifier la chambre" : "Ajouter une chambre",
                    dialogSubTitle: selectedChambre ? "Modifier les informations de la chambre" : "Saisissez les informations de la chambre",
                    iconSvg: <></>,
                    dialogFooterButtonTitle: isSaving ? "Modification en cours..." : (selectedChambre ? "Modifier" : "Ajouter"),
                    handleCloseDialog: () => setIsModalOpen(false),
                    disable: isSaving,
                    loading: loading,
                    openDialog: isModalOpen,
                    onButtonAnnulerClick: () => setIsModalOpen(false),
                    onButtonSaveClick: onSubmit,
                    dialogBoxContentHeader: "",
                    dialogBoxContent: (
                        <ChambreForm
                            chambre={chambreFormData}
                            errors={errors}
                            handleInputChange={handleInputChange}
                            handleSelectChange={handleSelectChange}
                            configChambres={configChambres}
                            message={message}
                        />
                    ),
                    handleSearch: () => null,
                    size: "lg",
                    height: "1/2"
                }}
            />

            <ConfirmeBox
                confirmBoxProps={{
                    intitule: `Voulez-vous vraiment supprimer la chambre ${selectedChambre?.chambreNom} ?`,
                    handleConfirme: handleDeleteConfirm,
                    loading: isDeleting,
                    buttonSaveLabel: isDeleting ? "Suppression en cours..." : "Supprimer",
                    type: "danger",
                    openConfirmeBox: isDeleteModalOpen,
                    handleCloseConfirmeBox: () => {
                        setIsDeleteModalOpen(false);
                    },
                }}
            />

            <div className={`w-full overflow-x-auto hide-scrollbar mt-4 intro-x box`}>
                <ChambreTable
                    chambres={chambres}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    pageCount={pageCount}
                    itemsPerPage={itemsPerPage}
                />
            </div>

            <CustomNotification
                message={notification?.content}
                notificationRef={notificationRef}
                title={"Info"}
                type={notification?.type}
            />
        </>
    );
};

export default Chambres;