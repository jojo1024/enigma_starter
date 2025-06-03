import { useState } from 'react';
import { useAppDispatch } from '../../../stores/store';
import { Residence, CreateResidence, UpdateResidence } from '../../../schema/residence.schema';
import {
    createResidence,
    updateResidence,
    deleteResidence,
    activateResidence
} from '../../../stores/slices/residenceSlice';
import { useNotification } from '../../../hooks/useNotification';

export const useResidenceManagement = () => {
    const dispatch = useAppDispatch();
    const { displayNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveResidence = async (residence: Residence, editMode: boolean) => {
        setIsSaving(true);
        try {
            if (editMode) {
                await dispatch(updateResidence(residence as UpdateResidence)).unwrap();
                displayNotification({
                    type: "success",
                    content: "La résidence a été modifiée avec succès"
                });
            } else {
                await dispatch(createResidence(residence as CreateResidence)).unwrap();
                displayNotification({
                    type: "success",
                    content: "La résidence a été créée avec succès"
                });
            }
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            displayNotification({
                type: "error",
                content: "Une erreur est survenue lors de la sauvegarde"
            });
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteResidence = async (residenceId: number) => {
        setIsDeleting(true);
        try {
            await dispatch(deleteResidence(residenceId)).unwrap();
            displayNotification({
                type: "success",
                content: "La résidence a été supprimée avec succès"
            });
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            displayNotification({
                type: "error",
                content: "Une erreur est survenue lors de la suppression"
            });
            return false;
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
            return true;
        } catch (error) {
            console.error('Erreur lors de la restauration:', error);
            displayNotification({
                type: "error",
                content: "Une erreur est survenue lors de la restauration"
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        isDeleting,
        isSaving,
        handleSaveResidence,
        handleDeleteResidence,
        handleRestoreResidence
    };
}; 