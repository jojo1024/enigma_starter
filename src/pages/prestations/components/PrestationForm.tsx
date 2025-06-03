import React, { useRef, useState } from 'react';
import { Prestation } from '../../../schema/prestation.schema';
import { FormInput, FormLabel, FormTextarea } from '../../../base-components/Form';
import Button from '../../../base-components/Button';
import Lucide from '../../../base-components/Lucide';
import { Slideover } from '../../../base-components/Headless';
import { FormErrors } from '../../../utils/types';
import Spinner from '../../../base-components/Spinner';
import { BASE_URL } from '../../../utils/constant';
import { fileToBase64 } from '../../../utils/functions';

interface PrestationFormProps {
    currentPrestation: Prestation;
    editMode: boolean;
    formErrors: FormErrors;
    onFormChange: (field: keyof Prestation, value: any) => void;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
}

const PrestationForm: React.FC<PrestationFormProps> = ({
    currentPrestation,
    editMode,
    formErrors,
    onFormChange,
    onSave,
    onCancel,
    isSaving
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessingFiles, setIsProcessingFiles] = useState(false);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || !currentPrestation) return;

        setIsProcessingFiles(true);
        try {
            const newImages = await Promise.all(Array.from(files).map(async (file) => {
                const base64String = await fileToBase64(file);
                return base64String;
            }));

            const updatedImages = [...(currentPrestation.prestationImages || []), ...newImages];
            onFormChange('prestationImages', updatedImages);
        } catch (error) {
            console.error('Erreur lors du traitement des fichiers:', error);
        } finally {
            setIsProcessingFiles(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (index: number) => {
        if (!currentPrestation?.prestationImages) return;
        const updatedImages = [...currentPrestation.prestationImages];
        updatedImages.splice(index, 1);
        onFormChange('prestationImages', updatedImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave();
    };

    return (
        <Slideover
            size="md"
            open={true}
            onClose={onCancel}
        >
            <Slideover.Panel>
                <button
                    onClick={(event: React.MouseEvent) => {
                        event.preventDefault();
                        if (!isSaving) {
                            onCancel();
                        }
                    }}
                    className="absolute top-0 left-0 right-auto mt-4 -ml-12"
                    disabled={isSaving}
                >
                    <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                </button>
                <Slideover.Title className="p-5">
                    <h2 className="mr-auto text-base font-medium">
                        {editMode ? 'Modifier la prestation' : 'Ajouter une prestation'}
                    </h2>
                </Slideover.Title>
                <Slideover.Description className="px-5 py-3 overflow-y-auto max-h-[calc(100vh-200px)]">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <FormLabel htmlFor="prestation-nom">Nom *</FormLabel>
                            <FormInput
                                id="prestation-nom"
                                type="text"
                                placeholder="Nom de la prestation"
                                value={currentPrestation?.prestationNom || ''}
                                onChange={(e) => onFormChange('prestationNom', e.target.value)}
                                className={formErrors.prestationNom ? 'border-danger' : ''}
                            />
                            {formErrors.prestationNom && (
                                <div className="mt-1 text-xs text-danger">{formErrors.prestationNom}</div>
                            )}
                        </div>
                        <div className='mt-3'>
                            <FormLabel htmlFor="prestation-description">Description *</FormLabel>
                            <FormTextarea
                                id="prestation-description"
                                placeholder="Description de la prestation"
                                value={currentPrestation?.prestationDescription || ''}
                                onChange={(e) => onFormChange('prestationDescription', e.target.value)}
                                rows={3}
                                className={formErrors.prestationDescription ? 'border-danger' : ''}
                            />
                            {formErrors.prestationDescription && (
                                <div className="mt-1 text-xs text-danger">{formErrors.prestationDescription}</div>
                            )}
                        </div>

                        <div className='mt-3'>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Images *
                                </label>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                />

                                <div className="flex flex-wrap gap-3 mt-2">
                                    {currentPrestation?.prestationImages && currentPrestation?.prestationImages?.map((image: string, index: number) => (
                                        <div key={index} className="relative">
                                            <div
                                                className="border rounded-md bg-gray-50 p-2 w-24 h-24 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                                            >
                                                <img
                                                    src={image?.startsWith("data:image") ? image : `${BASE_URL}/prestationImage/${image}`}
                                                    alt={`Image ${index + 1}`}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(index);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        disabled={isProcessingFiles}
                                        className={`border-2 border-dashed ${isProcessingFiles ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-white hover:border-blue-500'} rounded-md p-2 w-24 h-24 flex flex-col items-center justify-center transition-colors`}
                                    >
                                        {isProcessingFiles ? (
                                            <>
                                                <Spinner />
                                                <span className="text-xs text-gray-500 mt-1">Chargement...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lucide icon="Plus" className="w-4 h-4" />
                                                <span className="text-xs text-gray-500 mt-1">Ajouter</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {formErrors.prestationImages && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.prestationImages}</p>
                                )}
                            </div>
                        </div>
                    </form>
                </Slideover.Description>
                <Slideover.Footer className="absolute bottom-0 px-5 py-3 bg-white border-t w-full">
                    <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={onCancel}
                        className="w-24 mr-1"
                        disabled={isSaving}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        className="w-24"
                        onClick={handleSubmit}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Spinner className="w-4 h-4 mr-2" />
                                Enregistrement...
                            </>
                        ) : (
                            'Enregistrer'
                        )}
                    </Button>
                </Slideover.Footer>
            </Slideover.Panel>
        </Slideover>
    );
};

export default PrestationForm; 