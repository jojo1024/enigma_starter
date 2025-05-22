import React from 'react';
import Lucide from '../base-components/Lucide';
import { Tab } from '../base-components/Headless';

interface ViewToggleProps {
    currentView: 'list' | 'card';
    onViewChange: (view: 'list' | 'card') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
    return (
        <Tab.Group>
            <div className="pr-1 intro-y">
                <div className="p-1 box">
                    <Tab.List variant="pills">
                        <Tab>
                            <Tab.Button
                                className={`w-full flex py-2 text-xs sm:text-sm truncate ${currentView === 'list' ? 'bg-primary text-white' : ''}`}
                                as="button"
                                onClick={() => onViewChange('list')}
                            >
                                <Lucide icon="List" className="w-4 h-4 mr-1" />
                                Liste
                            </Tab.Button>
                        </Tab>
                        <Tab>
                            <Tab.Button
                                className={`w-full flex py-2 text-xs sm:text-sm truncate ${currentView === 'card' ? 'bg-primary text-white' : ''}`}
                                as="button"
                                onClick={() => onViewChange('card')}
                            >
                                <Lucide icon="LayoutGrid" className="w-4 h-4 mr-1" />
                                Cartes
                            </Tab.Button>
                        </Tab>
                    </Tab.List>
                </div>
            </div>
        </Tab.Group>
    );
};

export default ViewToggle; 