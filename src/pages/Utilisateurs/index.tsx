import React, { useEffect, useState } from 'react';
import Button from '../../base-components/Button';
import ConfirmeBox from '../../components/ConfirmeBox';
import DialogBox from '../../components/DialogBox';
import { CustomNotification } from '../../components/Notification';
import { useUtilisateurs } from './hooks/useUtilisateurs';
import UtilisateurForm from './components/UtilisateurForm';
import UtilisateurTable from './components/UtilisateurTable';
import { useAppDispatch } from '../../stores/store';
import { fetchAllUtilisateurs } from '../../stores/slices/utilisateurSlice';
import { fetchAllResidences } from '../../stores/slices/residenceSlice';

const Utilisateurs = () => {
    const dispatch = useAppDispatch();
    const [pageIndex, setPageIndex] = useState(0);
    const itemsPerPage = 10;

    const {
        utilisateurs,
        residences,
        loading,
        error,
        isModalOpen,
        selectedUtilisateur,
        isDeleteModalOpen,
        message,
        notification,
        utilisateurFormData,
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
        setUtilisateurFormData,
        setSelectedUtilisateur,
        notificationRef
    } = useUtilisateurs();

    useEffect(() => {
        dispatch(fetchAllUtilisateurs());
        dispatch(fetchAllResidences());
    }, [dispatch]);

    const pageCount = Math.ceil(utilisateurs.length / itemsPerPage);
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, utilisateurs.length);

    return (
        <>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Utilisateurs</h2>
                <Button
                    variant="primary"
                    onClick={() => {
                        setSelectedUtilisateur(null);
                        setUtilisateurFormData({
                            utilisateurNom: "",
                            utilisateurEmail: "",
                            utilisateurTelephone: "",
                            roleUtilisateurId: 0,
                            utilisateurMotDePasse: "",
                            motDePasseInitial: "",
                            motDePasseDejaChange: 0,
                            residenceId: 0,
                            status: 1
                        });
                        setIsModalOpen(true);
                    }}
                    className="btn btn-primary"
                >
                    Ajouter utilisateur
                </Button>
            </div>

            <DialogBox
                dialogProps={{
                    dialogTitle: selectedUtilisateur ? "Modifier l'utilisateur" : "Ajouter un utilisateur",
                    dialogSubTitle: selectedUtilisateur ? "Modifier les informations de l'utilisateur" : "Saisissez les informations de l'utilisateur",
                    iconSvg: <></>,
                    dialogFooterButtonTitle: isSaving ? "Modification en cours..." : (selectedUtilisateur ? "Modifier" : "Ajouter"),
                    handleCloseDialog: () => setIsModalOpen(false),
                    disable: isSaving,
                    loading: loading,
                    openDialog: isModalOpen,
                    onButtonAnnulerClick: () => setIsModalOpen(false),
                    onButtonSaveClick: onSubmit,
                    dialogBoxContentHeader: "",
                    dialogBoxContent: (
                        <UtilisateurForm
                            utilisateurFormData={utilisateurFormData}
                            errors={errors}
                            handleInputChange={handleInputChange}
                            handleSelectChange={handleSelectChange}
                            residences={residences}
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
                    intitule: `Voulez-vous vraiment supprimer ${utilisateurFormData.utilisateurNom} ?`,
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
                <UtilisateurTable
                    utilisateurs={utilisateurs}
                    loading={loading}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    pageCount={pageCount}
                    startIndex={startIndex}
                    endIndex={endIndex}
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

export default Utilisateurs;