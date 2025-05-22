import React from 'react';
import BasePagination from '../../../base-components/Pagination';
import Button from '../../../base-components/Button';
import { twMerge } from 'tailwind-merge';

interface ReservationPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const ReservationPagination: React.FC<ReservationPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Première page
        if (startPage > 1) {
            pages.push(
                <BasePagination.Link key="first" onClick={() => onPageChange(1)}>
                    1
                </BasePagination.Link>
            );
            if (startPage > 2) {
                pages.push(
                    <BasePagination.Link key="first-ellipsis" className="pointer-events-none">
                        ...
                    </BasePagination.Link>
                );
            }
        }

        // Pages numérotées
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <BasePagination.Link
                    key={i}
                    active={i === currentPage}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </BasePagination.Link>
            );
        }

        // Dernière page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <BasePagination.Link key="last-ellipsis" className="pointer-events-none">
                        ...
                    </BasePagination.Link>
                );
            }
            pages.push(
                <BasePagination.Link key="last" onClick={() => onPageChange(totalPages)}>
                    {totalPages}
                </BasePagination.Link>
            );
        }

        return pages;
    };

    return (
        <div className="flex justify-center mt-4">
            <BasePagination>
                <BasePagination.Link
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className={twMerge([
                        currentPage === 1 && "opacity-50 cursor-not-allowed pointer-events-none"
                    ])}
                >
                    &laquo;
                </BasePagination.Link>
                {renderPageNumbers()}
                <BasePagination.Link
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    className={twMerge([
                        currentPage === totalPages && "opacity-50 cursor-not-allowed pointer-events-none"
                    ])}
                >
                    &raquo;
                </BasePagination.Link>
            </BasePagination>
        </div>
    );
};

export default ReservationPagination; 