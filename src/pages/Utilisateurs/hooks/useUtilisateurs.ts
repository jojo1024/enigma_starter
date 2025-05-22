import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../stores/store';
import { CreateUtilisateur, Utilisateur } from '../../../schema/utilisateur.schema';
import { 
    createUtilisateur, 
    deleteUtilisateur, 
    fetchAllUtilisateurs, 
    selectAllUtilisateurs, 
    selectUtilisateurError, 
    selectUtilisateurLoading, 
    updateUtilisateur 
} from '../../../stores/slices/utilisateurSlice';
import { fetchAllResidences, selectAllResidences } from '../../../stores/slices/residenceSlice';
import { INotification } from '../../../components/Notification';
import { NotificationElement } from '../../../base-components/Notification/index';

const initialiseUtilisateur: CreateUtilisateur = {
    utilisateurNom: "",
    utilisateurEmail: "",
    utilisateurTelephone: "",
    roleUtilisateurId: 0,
    utilisateurMotDePasse: "",
    motDePasseInitial: "",
    motDePasseDejaChange: 0,
    residenceId: 0,
    status: 1
};

export const useUtilisateurs = () => {
    const dispatch = useAppDispatch();
    const notificationRef = useRef<NotificationElement>();
    const utilisateurs = useAppSelector(selectAllUtilisateurs);
    const residences = useAppSelector(selectAllResidences);
    const loading = useAppSelector(selectUtilisateurLoading);
    const error = useAppSelector(selectUtilisateurError);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUtilisateur, setSelectedUtilisateur] = useState<Utilisateur | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [message, setMessage] = useState<string>("null");
    const [notification, setNotification] = useState<INotification | undefined>();
    const [utilisateurFormData, setUtilisateurFormData] = useState<CreateUtilisateur>(initialiseUtilisateur);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setUtilisateurFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSelectChange = (e: { id: string, value: number }) => {
        setUtilisateurFormData(prev => ({
            ...prev,
            [e.id]: e.value
        }));
    };

    const handleEdit = (utilisateur: Utilisateur) => {
        setSelectedUtilisateur(utilisateur);
        setUtilisateurFormData({
            utilisateurNom: utilisateur.utilisateurNom,
            utilisateurEmail: utilisateur.utilisateurEmail || "",
            utilisateurTelephone: utilisateur.utilisateurTelephone || "",
            roleUtilisateurId: utilisateur.roleUtilisateurId,
            utilisateurMotDePasse: "",
            motDePasseInitial: utilisateur.motDePasseInitial || "",
            motDePasseDejaChange: utilisateur.motDePasseDejaChange,
            residenceId: utilisateur.residenceId,
            status: utilisateur.status
        });
        setIsModalOpen(true);
    };

    const handleDelete = (utilisateur: Utilisateur) => {
        setUtilisateurFormData({
            ...utilisateurFormData,
            utilisateurNom: utilisateur.utilisateurNom
        });
        setIsDeleteModalOpen(true);
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!utilisateurFormData.utilisateurNom) {
            newErrors.utilisateurNom = "Le nom de l'utilisateur est requis";
        }
        if (!utilisateurFormData.utilisateurTelephone) {
            newErrors.utilisateurTelephone = "Le téléphone de l'utilisateur est requis";
        }
        if (!utilisateurFormData.roleUtilisateurId || utilisateurFormData.roleUtilisateurId === 0) {
            newErrors.roleUtilisateurId = "Le rôle de l'utilisateur est requis";
        }
        if (!utilisateurFormData.residenceId || utilisateurFormData.residenceId === 0) {
            newErrors.residenceId = "Le site de l'utilisateur est requis";
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
            if (selectedUtilisateur) {
                await dispatch(updateUtilisateur({
                    id: selectedUtilisateur.utilisateurId,
                    utilisateur: utilisateurFormData
                })).unwrap();
                displayNotification({
                    type: "success",
                    content: "Utilisateur mis à jour avec succès"
                });
            } else {
                await dispatch(createUtilisateur(utilisateurFormData)).unwrap();
                displayNotification({
                    type: "success",
                    content: "Utilisateur créé avec succès"
                });
            }
            setIsModalOpen(false);
            setUtilisateurFormData(initialiseUtilisateur);
            setSelectedUtilisateur(null);
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
        if (selectedUtilisateur) {
            setIsDeleting(true);
            try {
                await dispatch(deleteUtilisateur(selectedUtilisateur.utilisateurId)).unwrap();
                displayNotification({
                    type: "success",
                    content: "Utilisateur supprimé avec succès"
                });
                setIsDeleteModalOpen(false);
                setSelectedUtilisateur(null);
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
    };
}; 