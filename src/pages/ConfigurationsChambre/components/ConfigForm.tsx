import React, { useRef, useState } from 'react';
import { FormInput, FormLabel, FormTextarea, FormSelect } from '../../../base-components/Form';
import type { Residence, TypeChambre } from '../types';
import { IConfigChambre } from '../../../schema/configChambre.schema';
import CustomSelectWithSearch from '../../../components/CustomSelectWithSearch';
import Spinner from '../../../base-components/Spinner';
import Lucide from '../../../base-components/Lucide';
import { BASE_URL } from '../../../utils/constant';
import { fileToBase64 } from '../../../utils/functions';

interface ConfigFormProps {
    currentConfig: IConfigChambre;
    formErrors: Record<string, string>;
    residences: Residence[];
    typesChambre: TypeChambre[];
    onFormChange: (field: keyof IConfigChambre, value: any) => void;
    onImageUpload: (files: File[]) => void;
    onRemoveImage: (index: number) => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({
    currentConfig,
    formErrors,
    residences,
    typesChambre,
    onFormChange,
    onImageUpload,
    onRemoveImage,
}) => {
    const [selectedAvantages, setSelectedAvantages] = useState<string[]>(currentConfig.configAvantageChambre || []);
    const [selectedEquipements, setSelectedEquipements] = useState<string[]>(currentConfig.configEquipementChambre || []);
    const [isProcessingFiles, setIsProcessingFiles] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const avantages = [
        { avantageIdaId: "Piscine", nomAvantage: 'Piscine' },
        { avantageIdaId: "Petit-déjeuner", nomAvantage: 'Petit-déjeuner' },
        {avantageIdaId:"Massage", nomAvantage: "Massage"},
        {avantageIdaId:"Salle de sport", nomAvantage: "Salle de sport"},
    ];

    const equipements = [
        { equipementId: "Wi-Fi", nomEquipement: 'Wi-Fi' },
        { equipementId: "Climatisation", nomEquipement: 'Climatisation' },
        { equipementId: "Salle de bain", nomEquipement: 'Salle de bain' },
        { equipementId: "Machine à café", nomEquipement: 'Machine à café' },
        { equipementId: "TV écran plat", nomEquipement: 'TV écran plat' },
        { equipementId: "Coffre fort", nomEquipement: 'Coffre fort' },
    ];

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || !currentConfig) return;

        setIsProcessingFiles(true);
        try {
            const newImages = await Promise.all(Array.from(files).map(async (file) => {
                const base64String = await fileToBase64(file);
                return base64String

            }));
            console.log("🚀 ~ newImages ~ newImages:", newImages)

            const updatedImages = [...(currentConfig.configChambreImages || []), ...newImages];
            onFormChange('configChambreImages', updatedImages);
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
        if (!currentConfig?.configChambreImages) return;
        const updatedImages = [...currentConfig.configChambreImages];
        updatedImages.splice(index, 1);



        onFormChange('configChambreImages', updatedImages);
    };


    return (
        <div className="space-y-4">
            <div>
                <FormLabel htmlFor="config-residence">Résidence *</FormLabel>
                <FormSelect
                    id="config-residence"
                    value={currentConfig.configResidenceId}
                    onChange={(e) => onFormChange('configResidenceId', parseInt(e.target.value, 10))}
                    className={formErrors.residence ? 'border-danger' : ''}
                >
                    <option value="">Sélectionnez une résidence</option>
                    {residences.map((residence) => (
                        <option key={residence.residenceId} value={residence.residenceId}>
                            {residence.residenceNom}
                        </option>
                    ))}
                </FormSelect>
                {formErrors.residence && (
                    <div className="mt-1 text-xs text-danger">{formErrors.residence}</div>
                )}
            </div>

            <div>
                <FormLabel htmlFor="config-type">Type de chambre *</FormLabel>
                <FormSelect
                    id="config-type"
                    value={currentConfig.configTypeChambreId}
                    onChange={(e) => onFormChange('configTypeChambreId', parseInt(e.target.value, 10))}
                    className={formErrors.type ? 'border-danger' : ''}
                >
                    <option value="">Sélectionnez un type</option>
                    {typesChambre.map((type) => (
                        <option key={type.typeChambreId} value={type.typeChambreId}>
                            {type.typeChambreNom}
                        </option>
                    ))}
                </FormSelect>
                {formErrors.type && (
                    <div className="mt-1 text-xs text-danger">{formErrors.type}</div>
                )}
            </div>

            <div>
                <FormLabel htmlFor="config-nom">Nom *</FormLabel>
                <FormInput
                    id="config-nom"
                    type="text"
                    placeholder="Nom de la configuration"
                    value={currentConfig.configChambreNom}
                    onChange={(e) => onFormChange('configChambreNom', e.target.value)}
                    className={formErrors.nom ? 'border-danger' : ''}
                />
                {formErrors.nom && (
                    <div className="mt-1 text-xs text-danger">{formErrors.nom}</div>
                )}
            </div>

            <div>
                <FormLabel htmlFor="config-description">Description</FormLabel>
                <FormTextarea
                    id="config-description"
                    placeholder="Description de la configuration"
                    value={currentConfig.configChambreDescription}
                    onChange={(e) => onFormChange('configChambreDescription', e.target.value)}
                    rows={3}
                    className={formErrors.description ? 'border-danger' : ''}
                />
                {formErrors.description && (
                    <div className="mt-1 text-xs text-danger">{formErrors.description}</div>
                )}
            </div>

            <div>
                <FormLabel htmlFor="config-prix-semaine">Prix semaine (F CFA) *</FormLabel>
                <FormInput
                    id="config-prix-semaine"
                    type="number"
                    min={5000}
                    value={currentConfig.configChambrePrixSemaine}
                    onChange={(e) => onFormChange('configChambrePrixSemaine', parseInt(e.target.value, 10))}
                    className={formErrors.prixSemaine ? 'border-danger' : ''}
                />
                {formErrors.prixSemaine && (
                    <div className="mt-1 text-xs text-danger">{formErrors.prixSemaine}</div>
                )}
            </div>

            <div>
                <FormLabel htmlFor="config-prix-weekend">Prix weekend (F CFA) *</FormLabel>
                <FormInput
                    id="config-prix-weekend"
                    type="number"
                    min={5000}
                    value={currentConfig.configChambrePrixWeekend}
                    onChange={(e) => onFormChange('configChambrePrixWeekend', parseInt(e.target.value, 10))}
                    className={formErrors.prixWeekend ? 'border-danger' : ''}
                />
                {formErrors.prixWeekend && (
                    <div className="mt-1 text-xs text-danger">{formErrors.prixWeekend}</div>
                )}
            </div>

            <div>
                <FormLabel htmlFor="config-capacite-adultes">Capacité adultes *</FormLabel>
                <FormInput
                    id="config-capacite-adultes"
                    type="number"
                    min={1}
                    value={currentConfig.configCapaciteAdultes}
                    onChange={(e) => onFormChange('configCapaciteAdultes', parseInt(e.target.value, 10))}
                    className={formErrors.capaciteAdultes ? 'border-danger' : ''}
                />
                {formErrors.capaciteAdultes && (
                    <div className="mt-1 text-xs text-danger">{formErrors.capaciteAdultes}</div>
                )}
            </div>

            <div>
                <CustomSelectWithSearch
                    id="avantageIdaId"
                    label="Avantages"
                    valuesSelected={selectedAvantages}
                    onChange={(values: string[]) => {
                        setSelectedAvantages(values);
                        onFormChange('configAvantageChambre', values);
                    }}
                    data={avantages}
                    keys={["avantageIdaId", "nomAvantage"]}
                    className='w-full'
                    isMultipleSelect={true}
                />
            </div>

            <div>
                <CustomSelectWithSearch
                    id="equipementId"
                    label="Equipements et services"
                    valuesSelected={selectedEquipements}
                    onChange={(values: string[]) => {
                        setSelectedEquipements(values);
                        onFormChange('configEquipementChambre', values);
                    }}
                    data={equipements}
                    keys={["equipementId", "nomEquipement"]}
                    className='w-full'
                    isMultipleSelect={true}
                />
            </div>

            <div className='mt-3'>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Images
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
                        {currentConfig.configChambreImages?.map((image, index) => (
                            <div key={index} className="relative">
                                <div className="border rounded-md bg-gray-50 p-2 w-24 h-24 flex items-center justify-center cursor-pointer hover:bg-gray-100">
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
        </div>
    );
};

export default ConfigForm; 