import React from 'react';
import { BASE_URL } from '../../../utils/constant';
import Lucide from '../../../base-components/Lucide';

const ResidenceCard: React.FC<any> = ({
    residence,
    activeImageIndex,
    onEdit,
    onDelete,
    onRestore,
    onNextImage,
    onPrevImage
}) => {
    return (
        <div className="col-span-12 intro-y md:col-span-6 xl:col-span-4 2xl:col-span-3 box">
            <div className="p-5">
                <div className="relative h-40 2xl:h-56 image-fit">
                    {residence.residenceImages && residence.residenceImages.length > 0 && (
                        <img
                            alt={residence.residenceNom}
                            className="rounded-md w-full h-full object-cover"
                            src={`${BASE_URL}/image/${residence.residenceImages[activeImageIndex]}`}
                        />
                    )}
                    {residence.residenceImages && residence.residenceImages.length > 1 && (
                        <>
                            <div
                                className="absolute flex items-center justify-center w-8 h-8 rounded-full cursor-pointer left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white"
                                onClick={() => onPrevImage(residence.residenceId)}
                            >
                                <Lucide icon="ChevronLeft" className="w-4 h-4" />
                            </div>
                            <div
                                className="absolute flex items-center justify-center w-8 h-8 rounded-full cursor-pointer right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white"
                                onClick={() => onNextImage(residence.residenceId)}
                            >
                                <Lucide icon="ChevronRight" className="w-4 h-4" />
                            </div>
                            <div className="absolute flex justify-center w-full bottom-2">
                                {residence?.residenceImages.map((_: string, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 mx-1 rounded-full ${idx === activeImageIndex ? 'bg-white' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <a href="#" className="block mt-5 text-base font-medium">
                    {residence.residenceNom}
                </a>
                <div className="mt-2 text-slate-600 dark:text-slate-500 line-clamp-3">
                    {residence.residenceDescription?.slice(0, 100)}...
                </div>
                <div className="mt-3 flex flex-col space-y-2">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Lucide icon="Tag" className="w-4 h-4 mr-2 text-gray-500" />
                        Prix de base:{" "}
                        <span className="font-medium ml-1 text-gray-700 dark:text-gray-300">
                            {residence.residencePrixDeBase.toLocaleString()} F CFA
                        </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Lucide icon="MapPin" className="w-4 h-4 mr-2 text-gray-500" />
                        Adresse:{" "}
                        <span className="font-medium ml-1 text-gray-700 dark:text-gray-300 truncate max-w-xs">
                            {residence.residenceAdresse}
                        </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Lucide icon="Phone" className="w-4 h-4 mr-2 text-gray-500" />
                        Téléphone:{" "}
                        <span className="font-medium ml-1 text-gray-700 dark:text-gray-300">
                            {residence.residenceTelephone}
                        </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Lucide icon="Mail" className="w-4 h-4 mr-2 text-gray-500" />
                        E-mail:{" "}
                        <span className="font-medium ml-1 text-gray-700 dark:text-gray-300 truncate max-w-xs">
                            {residence.residenceEmail}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
                <div className="flex items-center mr-auto text-primary">
                    {residence.status === 0 && (
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => onRestore(residence.residenceId)}
                        >
                            <Lucide icon="RefreshCw" className="w-4 h-4 mr-1" /> Restaurer
                        </div>
                    )}
                </div>
                <div
                    onClick={() => onEdit(residence)}
                    className="flex items-center mr-3 cursor-pointer text-primary"
                >
                    <Lucide icon="Edit" className="w-4 h-4 mr-1" /> Modifier
                </div>
                <div
                    onClick={() => onDelete(residence.residenceId)}
                    className="flex items-center cursor-pointer text-danger"
                >
                    <Lucide icon="Trash" className="w-4 h-4 mr-1" /> Supprimer
                </div>
            </div>
        </div>
    );
};

export default ResidenceCard; 