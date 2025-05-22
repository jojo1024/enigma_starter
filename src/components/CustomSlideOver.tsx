import React, { Fragment, ReactNode, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import Lucide from '../base-components/Lucide';

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'right' | 'left';
}

const CustomSlideOver: React.FC<SlideOverProps> = ({
  open,
  onClose,
  title = '',
  children,
  size = 'md',
  position = 'right'
}) => {


  // Déterminer la largeur en fonction de la taille
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-lg';
      case 'lg':
        return 'max-w-xl';
      case 'xl':
        return 'max-w-2xl';
      default:
        return 'max-w-lg';
    }
  };

  // Déterminer la position
  const getPositionClass = () => {
    return position === 'left' ? 'left-0' : 'right-0';
  };

  const getTransformClass = () => {
    return position === 'left' ? '-translate-x-full' : 'translate-x-full';
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />
          </Transition.Child>

          <div className="fixed inset-y-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom={getTransformClass()}
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo={getTransformClass()}
            >
              <div className={`relative flex-1 flex max-w-full ${getPositionClass()} ${getSizeClass()}`}>
                <div className="h-full flex flex-col overflow-y-auto bg-white dark:bg-gray-800 shadow-xl">
                  <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {title}
                      </h2>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={onClose}
                      >
                        <span className="sr-only">Fermer</span>
                        <Lucide icon="X" className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  <div className="relative flex-1 overflow-y-auto">
                    {children}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </div>
    </Transition.Root>
  );
};

export default CustomSlideOver;