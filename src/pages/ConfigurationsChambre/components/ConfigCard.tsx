import React from 'react';
import Lucide from '../../../base-components/Lucide';
import { BASE_URL } from '../../../utils/constant';
import { IConfigChambre } from '../../../schema/configChambre.schema';

interface ConfigCardProps {
    config: IConfigChambre;
    activeImageIndex: number;
    onNextImage: () => void;
    onPrevImage: () => void;
    onEdit: (config: IConfigChambre) => void;
    onDelete: (configId: number) => void;
}

const ConfigCard: React.FC<ConfigCardProps> = ({
    config,
    activeImageIndex,
    onNextImage,
    onPrevImage,
    onEdit,
    onDelete
}) => {
    const configId = config.configChambreId ?? 0;

    return (
        <div className="overflow-hidden transition duration-300 transform rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
            {/* Section Image avec overlay */}
            <div className="relative h-56 overflow-hidden">
                {config.configChambreImages && config.configChambreImages.length > 0 && (
                    <img
                        alt={config.configChambreNom}
                        className="w-full h-full object-cover"
                        src={`${BASE_URL}/image/${config.configChambreImages[activeImageIndex]}`}
                    />
                )}

                {/* Overlay pour le type et balcon */}
                <div className="absolute top-0 left-0 right-0 flex justify-between p-3">
                    <div className="flex items-center space-x-2">
                        <div className="px-3 py-1.5 text-xs font-medium text-white rounded-full bg-primary/90 backdrop-blur-sm">
                            {config.typeChambreNom}
                        </div>
                    </div>
                    {/* <div className="px-3 py-1.5 text-xs font-medium text-white rounded-full bg-black/90 backdrop-blur-sm">
                        {configId} chambre{configId > 1 ? 's' : ''}
                    </div> */}
                </div>

                {/* Navigation du carousel */}
                {config?.configChambreImages?.length && config?.configChambreImages?.length > 1 && (
                    <>
                        <div
                            className="absolute flex items-center justify-center w-8 h-8 rounded-full cursor-pointer left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onPrevImage();
                            }}
                        >
                            <Lucide icon="ChevronLeft" className="w-4 h-4" />
                        </div>
                        <div
                            className="absolute flex items-center justify-center w-8 h-8 rounded-full cursor-pointer right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onNextImage();
                            }}
                        >
                            <Lucide icon="ChevronRight" className="w-4 h-4" />
                        </div>
                    </>
                )}
            </div>

            {/* Contenu de la carte */}
            <div className="p-5 bg-white">
                {/* En-tête avec nom et résidence */}
                <div className="mb-3">
                    <h3 className="text-lg font-medium text-gray-800 truncate">
                        {config.configChambreNom}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                        <Lucide icon="MapPin" className="w-4 h-4 mr-1 text-primary" />
                        {config.residenceNom}
                    </div>
                </div>

                {/* Description */}
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                    {config.configChambreDescription}
                </p>

                {/* Caractéristiques */}
                <div className="grid grid-cols-2 gap-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <Lucide icon="Users" className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{config.configCapaciteAdultes} adulte{config.configCapaciteAdultes > 1 ? 's' : ''}</span>
                    </div>
                </div>

                {/* Inclusions */}
                <div className="mb-4 md:mb-6">
                    <div className="flex flex-wrap gap-2">
                        {config.configAvantageChambre?.map((avantage, idx) => (
                            <div key={idx} className="flex items-center bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm">
                                <span className="mr-1"><Lucide icon="Star" className='w-3 h-3' /></span>
                                <span>{avantage}</span>
                            </div>
                        ))}
                    </div>
                </div>

                

                {/* Prix */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-500">Prix semaine</p>
                        <p className="font-semibold text-primary">{config.configChambrePrixSemaine.toLocaleString()} F CFA</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Prix weekend</p>
                        <p className="font-semibold text-primary">{config.configChambrePrixWeekend.toLocaleString()} F CFA</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
                <div className="flex space-x-3">
                    <button
                        onClick={() => onEdit(config)}
                        className="flex items-center text-sm font-medium text-primary"
                    >
                        <Lucide icon="Edit" className="w-4 h-4 mr-1" /> Modifier
                    </button>
                    <button
                        onClick={() => onDelete(configId)}
                        className="flex items-center text-sm font-medium text-red-600 hover:text-red-700"
                    >
                        <Lucide icon="Trash" className="w-4 h-4 mr-1" /> Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfigCard; 