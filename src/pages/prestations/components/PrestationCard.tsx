import React from 'react';
import { Prestation } from '../../../schema/prestation.schema';
import Button from '../../../base-components/Button';
import Lucide from '../../../base-components/Lucide';
import { BASE_URL } from '../../../utils/constant';

const PrestationCard: React.FC<any> = ({
    prestation,
    activeImageIndex,
    onEdit,
    onDelete,
    onRestore,
    onNextImage,
    onPrevImage
}) => {
    const hasImages = prestation.prestationImages && prestation.prestationImages.length > 0;
    const currentImage = hasImages ? prestation.prestationImages[activeImageIndex] : null;

    return (
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 2xl:col-span-3 intro-y">
            <div className="box">
                <div className="p-5">
                    <div className="relative h-40 mb-5">
                        {hasImages ? (
                            <>
                                <img
                                    src={`${BASE_URL}/prestationImage/${currentImage}`}
                                    alt={prestation.prestationNom}
                                    className="object-cover w-full h-full rounded-md"
                                />
                                {prestation.prestationImages && prestation.prestationImages.length > 1 && (
                                    <>
                                        <div
                                            className="absolute flex items-center justify-center w-8 h-8 rounded-full cursor-pointer left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white"
                                            onClick={() => onPrevImage(prestation.prestationId)}
                                        >
                                            <Lucide icon="ChevronLeft" className="w-4 h-4" />
                                        </div>
                                        <div
                                            className="absolute flex items-center justify-center w-8 h-8 rounded-full cursor-pointer right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white"
                                            onClick={() => onNextImage(prestation.prestationId)}
                                        >
                                            <Lucide icon="ChevronRight" className="w-4 h-4" />
                                        </div>
                                        <div className="absolute flex justify-center w-full bottom-2">
                                            {prestation?.prestationImages.map((_: string, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className={`w-2 h-2 mx-1 rounded-full ${idx === activeImageIndex ? 'bg-white' : 'bg-white/50'}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-slate-100 rounded-md">
                                <Lucide icon="Image" className="w-12 h-12 text-slate-400" />
                            </div>
                        )}
                    </div>
                    <div className="text-base font-medium truncate">{prestation.prestationNom}</div>
                    {prestation.prestationDescription && (
                        <div className="mt-1 text-slate-500 text-sm line-clamp-2">
                            {prestation.prestationDescription}
                        </div>
                    )}
                    <div className="flex items-center justify-between mt-5">
                        <div className="text-xs text-slate-500">
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline-primary"
                                className=""
                                onClick={() => onEdit(prestation)}
                            >
                                <Lucide icon="Edit" className="w-4 h-4" /> Modifier
                            </Button>
                            {/* <Button
                                variant="outline-danger"
                                className=""
                                onClick={() => onDelete(prestation.prestationId)}
                            >
                                <Lucide icon="Trash2" className="w-4 h-4" /> Supprimer
                            </Button> */}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrestationCard; 