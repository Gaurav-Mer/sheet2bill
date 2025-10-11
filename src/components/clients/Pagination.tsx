// components/clients/Pagination.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const DOTS = '...';

// A helper function to create a range of numbers
const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

const usePagination = ({
    totalPages,
    siblingCount = 1,
    currentPage
}: {
    totalPages: number;
    siblingCount?: number;
    currentPage: number;
}) => {
    const paginationRange = useMemo(() => {
        const totalPageNumbers = siblingCount + 5;

        if (totalPageNumbers >= totalPages) {
            return range(1, totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = range(1, leftItemCount);
            return [...leftRange, DOTS, totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = range(totalPages - rightItemCount + 1, totalPages);
            return [firstPageIndex, DOTS, ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }
    }, [totalPages, siblingCount, currentPage]);

    return paginationRange;
};

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    searchQuery?: string;
    basePath: string;
    itemPerPage?: number;
};

export function Pagination({
    currentPage,
    totalPages,
    totalCount,
    searchQuery = '',
    basePath,
    itemPerPage = 20
}: PaginationProps) {
    const paginationRange = usePagination({ currentPage, totalPages });

    if (currentPage === 0 || (currentPage === 1 && totalCount < itemPerPage)) {
        return null;
    }
    console.log("currentPage", currentPage)
    const disableNext = currentPage >= totalPages;

    return (
        <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} ({totalCount} total items)
            </div>
            <div className="flex items-center space-x-1">
                <Link href={`${basePath}?q=${searchQuery}&page=1`} passHref>
                    <Button variant="outline" size="icon" disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                </Link>
                <Link href={`${basePath}?q=${searchQuery}&page=${currentPage - 1}`} passHref>
                    <Button variant="outline" size="icon" disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                </Link>
                {paginationRange?.map((pageNumber, index) => {
                    if (pageNumber === DOTS) {
                        return <span key={index} className="px-2 py-1">&#8230;</span>;
                    }

                    return (
                        <Link key={index} href={`${basePath}?q=${searchQuery}&page=${pageNumber}`} passHref>
                            <Button variant={pageNumber === currentPage ? 'default' : 'outline'} size="icon">
                                {pageNumber}
                            </Button>
                        </Link>
                    );
                })}
                {disableNext ? null : <Link href={`${basePath}?q=${searchQuery}&page=${currentPage + 1}`} passHref>
                    <Button variant="outline" size="icon" disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                </Link>}
                <Link href={`${basePath}?q=${searchQuery}&page=${totalPages}`} passHref>
                    <Button variant="outline" size="icon" disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
                </Link>
            </div>
        </div>
    );
}