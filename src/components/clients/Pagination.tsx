import { Button } from '@/components/ui/button';
import Link from 'next/link';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    searchQuery: string;
};

export function Pagination({ currentPage, totalPages, totalCount, searchQuery }: PaginationProps) {
    return (
        <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
                Showing page {currentPage} of {totalPages} ({totalCount} total clients)
            </div>
            <div className="space-x-2">
                <Link href={`/clients?q=${searchQuery}&page=${currentPage - 1}`} passHref>
                    <Button variant="outline" disabled={currentPage <= 1}>Previous</Button>
                </Link>
                <Link href={`/clients?q=${searchQuery}&page=${currentPage + 1}`} passHref>
                    <Button variant="outline" disabled={currentPage >= totalPages}>Next</Button>
                </Link>
            </div>
        </div>
    );
}