import React, { useRef, useState } from 'react';
import { Slideover } from '../../../base-components/Headless';
import { FormInput, FormLabel, FormTextarea } from '../../../base-components/Form';
import Button from '../../../base-components/Button';
import Lucide from '../../../base-components/Lucide';
import Dropzone, { DropzoneElement } from '../../../base-components/Dropzone';
import { ResidenceFormProps } from '../types';
import { BASE_URL } from '../../../utils/constant';
import { fileToBase64 } from '../../../utils/functions';
import Spinner from '../../../base-components/Spinner';
import { useAppSelector } from '../../../stores/store';
import { selectLoading } from '../../../stores/slices/residenceSlice';

const ResidenceForm: React.FC<ResidenceFormProps> = ({
    currentResidence,
    editMode,
    formErrors,
    onFormChange,
    onSave,
    onCancel,
    isSaving
}) => {
    const loading = useAppSelector(selectLoading);

    const dropzoneMultipleRef = useRef<DropzoneElement>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessingFiles, setIsProcessingFiles] = useState(false);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || !currentResidence) return;

        setIsProcessingFiles(true);
        try {
            const newImages = await Promise.all(Array.from(files).map(async (file) => {
                const base64String = await fileToBase64(file);
                return base64String

            }));
            console.log("🚀 ~ newImages ~ newImages:", newImages)

            const updatedImages = [...(currentResidence.residenceImages || []), ...newImages];
            onFormChange('residenceImages', updatedImages);
        } catch (error) {
            console.error('Erreur lors du traitement des fichiers:', error);
        } finally {
            setIsProcessingFiles(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeDocument = (index: number) => {
        if (!currentResidence?.residenceImages) return;
        const updatedImages = [...currentResidence.residenceImages];
        updatedImages.splice(index, 1);
        onFormChange('residenceImages', updatedImages);
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
                        {editMode ? 'Modifier la résidence' : 'Ajouter une résidence'}
                    </h2>
                </Slideover.Title>
                <Slideover.Description className="px-5 py-3 overflow-y-auto max-h-[calc(100vh-200px)]">
                    <div>
                        <FormLabel htmlFor="residence-nom">Nom *</FormLabel>
                        <FormInput
                            id="residence-nom"
                            type="text"
                            placeholder="Nom de la résidence"
                            value={currentResidence?.residenceNom || ''}
                            onChange={(e) => onFormChange('residenceNom', e.target.value)}
                            className={formErrors.nom ? 'border-danger' : ''}
                        />
                        {formErrors.nom && (
                            <div className="mt-1 text-xs text-danger">{formErrors.nom}</div>
                        )}
                    </div>
                    <div className='mt-3'>
                        <FormLabel htmlFor="residence-description">Description *</FormLabel>
                        <FormTextarea
                            id="residence-description"
                            placeholder="Description de la résidence"
                            value={currentResidence?.residenceDescription || ''}
                            onChange={(e) => onFormChange('residenceDescription', e.target.value)}
                            rows={3}
                            className={formErrors.description ? 'border-danger' : ''}
                        />
                        {formErrors.description && (
                            <div className="mt-1 text-xs text-danger">{formErrors.description}</div>
                        )}
                    </div>
                    <div className="mt-3">
                        <FormLabel htmlFor="residence-prix">Prix de base (F CFA) *</FormLabel>
                        <FormInput
                            id="residence-prix"
                            type="number"
                            // min={10000}
                            value={currentResidence?.residencePrixDeBase}
                            onChange={(e) => onFormChange('residencePrixDeBase', parseInt(e.target.value, 10))}
                            className={formErrors.prix ? 'border-danger' : ''}
                        />
                        {formErrors.prix && (
                            <div className="mt-1 text-xs text-danger">{formErrors.prix}</div>
                        )}
                    </div>
                    <div className="mt-3">
                        <FormLabel htmlFor="residence-adresse">Adresse *</FormLabel>
                        <FormInput
                            id="residence-adresse"
                            type="text"
                            placeholder='Adresse de la résidence'
                            value={currentResidence?.residenceAdresse || ''}
                            onChange={(e) => onFormChange('residenceAdresse', e.target.value)}
                            className={formErrors.adresse ? 'border-danger' : ''}
                        />
                        {formErrors.adresse && (
                            <div className="mt-1 text-xs text-danger">{formErrors.adresse}</div>
                        )}
                    </div>
                    <div className="mt-3">
                        <FormLabel htmlFor="residence-telephone">Téléphone *</FormLabel>
                        <FormInput
                            id="residence-telephone"
                            type="text"
                            placeholder='Format: +225 XX XX XX XX'
                            value={currentResidence?.residenceTelephone || ''}
                            onChange={(e) => onFormChange('residenceTelephone', e.target.value)}
                            className={formErrors.telephone ? 'border-danger' : ''}
                        />
                        {formErrors.telephone && (
                            <div className="mt-1 text-xs text-danger">{formErrors.telephone}</div>
                        )}
                    </div>
                    <div className="mt-3">
                        <FormLabel htmlFor="residence-email">E-mail</FormLabel>
                        <FormInput
                            id="residence-email"
                            type="email"
                            placeholder='E-mail de la résidence'
                            value={currentResidence?.residenceEmail || ''}
                            onChange={(e) => onFormChange('residenceEmail', e.target.value)}
                            className={formErrors.email ? 'border-danger' : ''}
                        />
                        {formErrors.email && (
                            <div className="mt-1 text-xs text-danger">{formErrors.email}</div>
                        )}
                    </div>
         
                    {/* Téléchargement de documents */}
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
                                accept="image/*,.pdf"
                            />

                            <div className="flex flex-wrap gap-3 mt-2">
                                {currentResidence?.residenceImages && currentResidence?.residenceImages?.map((image: string, index: number) => (
                                    <div key={index} className="relative">
                                        <div
                                            className="border rounded-md bg-gray-50 p-2 w-24 h-24 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                                        >
                                            <img
                                                src={image?.startsWith("data:image") ? image : `${BASE_URL}/image/${image}`}
                                                alt={`Image ${index + 1}`}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeDocument(index);
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

                            {formErrors.images && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.images}</p>
                            )}

                        </div>
                    </div>
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
                        type="button"
                        className="w-24"
                        onClick={onSave}
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

export default ResidenceForm; 