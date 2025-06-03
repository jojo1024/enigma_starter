import { useState, useEffect } from 'react';
import { Residence } from '../../../schema/residence.schema';

export const useImageCarousel = (residences: Residence[]) => {
    const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});

    useEffect(() => {
        const initialIndices: Record<number, number> = {};
        residences.forEach(residence => {
            initialIndices[residence.residenceId] = 0;
        });
        setActiveImageIndex(initialIndices);
    }, [residences]);

    const handleNextImage = (residenceId: number) => {
        const residence = residences.find(r => r.residenceId === residenceId);
        if (!residence?.residenceImages) return;

        const currentIndex = activeImageIndex[residenceId] || 0;
        const nextIndex = (currentIndex + 1) % residence.residenceImages.length;

        setActiveImageIndex(prev => ({
            ...prev,
            [residenceId]: nextIndex
        }));
    };

    const handlePrevImage = (residenceId: number) => {
        const residence = residences.find(r => r.residenceId === residenceId);
        if (!residence?.residenceImages) return;

        const currentIndex = activeImageIndex[residenceId] || 0;
        const prevIndex = (currentIndex - 1 + residence.residenceImages.length) % residence.residenceImages.length;

        setActiveImageIndex(prev => ({
            ...prev,
            [residenceId]: prevIndex
        }));
    };

    return {
        activeImageIndex,
        handleNextImage,
        handlePrevImage
    };
}; 