import React from 'react';
import Button from '../Button';
import Lucide from '../Lucide';

// Utiliser le type exact des icônes Lucide
type LucideIcon = Parameters<typeof Lucide>[0]['icon'];

interface CustomButtonProps {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning' | 'outline-info';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    loadingText?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    libelle?: string;
    children?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingText,
    icon,
    iconPosition = 'left',
    className = '',
    disabled = false,
    onClick,
    type = 'button',
    libelle,
    children,
}) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-2 py-1 text-xs';
            case 'lg':
                return 'px-4 py-2 text-lg';
            default:
                return 'px-3 py-1.5 text-sm';
        }
    };

    const renderIcon = (iconName: LucideIcon) => (
        <Lucide icon={iconName} className={`w-4 h-4 ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`} />
    );

    return (
        <Button
            variant={variant as any}
            type={type}
            className={`${getSizeClasses()} ${className}`}
            disabled={disabled || isLoading}
            onClick={onClick}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <Lucide icon="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    {loadingText || 'Chargement...'}
                </div>
            ) : (
                <div className="flex items-center justify-center">
                    {icon && iconPosition === 'left' && renderIcon(icon)}
                    {libelle || children}
                    {icon && iconPosition === 'right' && renderIcon(icon)}
                </div>
            )}
        </Button>
    );
};

export default CustomButton; 