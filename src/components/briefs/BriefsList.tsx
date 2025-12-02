import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { normalizeCurrency } from '@/lib/normalizeCountry';
import { MoreHorizontal, FileText, Eye, Link as LinkIcon, Edit, Copy, Trash2, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SendBriefButton from './SendBriefButtont';

export type Brief = {
    id: number;
    brief_number: string;
    title: string;
    status: string;
    total: number;
    currency: string;
    brief_token: string;
    clients: { name: string, email?: string } | null;
};

type BriefsListProps = {
    briefs: Brief[];
    searchQuery: string;
    onCopyLink: (token: string) => void;
    onDelete: (brief: Brief) => void;
    onConvertToInvoice: (id: number) => void;
    onDuplicate: (id: number) => void;
    isConverting: boolean;
    isDuplicating: boolean;
    isDeleteAlertOpen?: boolean
};

export function BriefsList({
    briefs,
    searchQuery,
    onCopyLink,
    onDelete,
    onConvertToInvoice,
    onDuplicate,
    isConverting,
    isDuplicating,
    isDeleteAlertOpen
}: BriefsListProps) {
    const router = useRouter()
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            case 'sent':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return '✓';
            case 'rejected':
                return '✕';
            case 'sent':
                return '↗';
            default:
                return '○';
        }
    };

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden lg:block border border-border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-border text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Brief #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Client
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                                Total
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                        {briefs.length > 0 ? (
                            briefs.map((brief) => {
                                const currencySymbol = normalizeCurrency(brief.currency)?.currency?.symbol ?? brief?.currency;

                                return (
                                    <tr key={brief.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-primary hover:underline">
                                            <Link href={(brief.status === 'draft' || brief.status === 'rejected') ? `/briefs/${brief.id}/edit` : "#"}>{brief.brief_number}</Link>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{brief.title}</td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {brief.clients?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${getStatusClass(
                                                    brief.status
                                                )}`}
                                            >
                                                {brief.status === 'rejected' ? 'Changes Requested' : brief.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-foreground">
                                            {currencySymbol} {brief.total?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {brief.status === 'approved' && (
                                                        <DropdownMenuItem
                                                            onSelect={() => onConvertToInvoice(brief.id)}
                                                            disabled={isConverting}
                                                            className="font-semibold text-primary focus:text-primary"
                                                        >
                                                            <FileCheck className="w-4 h-4 mr-2" />
                                                            {isConverting ? 'Generating...' : 'Generate Invoice'}
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onSelect={() =>
                                                            window.open(`/brief/${brief.brief_token}`, '_blank')
                                                        }
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Public Page
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => onCopyLink(brief.brief_token)}>
                                                        <LinkIcon className="w-4 h-4 mr-2" />
                                                        Copy Approval Link
                                                    </DropdownMenuItem>
                                                    {(brief.status === 'draft' || brief.status === 'rejected') && (
                                                        <DropdownMenuItem
                                                            onSelect={() =>
                                                                window.open(`/briefs/${brief.id}/edit`, '_self')
                                                            }
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onSelect={() => onDuplicate(brief.id)}
                                                        disabled={isDuplicating}
                                                    >
                                                        <Copy className="w-4 h-4 mr-2" />
                                                        {isDuplicating ? 'Duplicating...' : 'Duplicate'}
                                                    </DropdownMenuItem>
                                                    {brief.status === 'draft' && (
                                                        <DropdownMenuItem
                                                            onSelect={() => onDelete(brief)}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem>
                                                        <SendBriefButton brief={brief} />
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                                    <EmptyState searchQuery={searchQuery} />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
                {briefs.length > 0 ? (
                    briefs.map((brief) => {
                        const currencySymbol = normalizeCurrency(brief.currency)?.currency?.symbol ?? brief?.currency;

                        return (
                            <div
                                key={brief.id}
                                onClick={() => {
                                    if (!isDeleteAlertOpen) {
                                        if ((brief.status === 'draft' || brief.status === 'rejected')) {
                                            router.push(`/briefs/${brief.id}/edit`)
                                        }
                                    };
                                }}
                                className="relative bg-card border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer"
                            >
                                {/* Gradient accent on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none" />

                                <div className="relative">
                                    {/* Header Section */}
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {/* Brief Icon */}
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
                                                <FileText className="w-6 h-6 text-primary-foreground" />
                                            </div>

                                            {/* Brief Number & Title */}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-sm text-primary truncate">
                                                    {brief.brief_number}
                                                </div>
                                                <div className="text-base font-medium text-foreground truncate">
                                                    {brief.title}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions Dropdown */}
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 hover:bg-muted/80"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    {brief.status === 'approved' && (
                                                        <DropdownMenuItem
                                                            onSelect={() => onConvertToInvoice(brief.id)}
                                                            disabled={isConverting}
                                                            className="font-semibold text-primary focus:text-primary"
                                                        >
                                                            <FileCheck className="w-4 h-4 mr-2" />
                                                            {isConverting ? 'Generating...' : 'Generate Invoice'}
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onSelect={() => window.open(`/brief/${brief.brief_token}`, '_blank')}
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Public Page
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={() => onCopyLink(brief.brief_token)}
                                                    >
                                                        <LinkIcon className="w-4 h-4 mr-2" />
                                                        Copy Link
                                                    </DropdownMenuItem>
                                                    {(brief.status === 'draft' || brief.status === 'rejected') && (
                                                        <DropdownMenuItem
                                                            onSelect={() => window.open(`/briefs/${brief.id}/edit`, '_self')}
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onSelect={() => onDuplicate(brief.id)}
                                                        disabled={isDuplicating}
                                                    >
                                                        <Copy className="w-4 h-4 mr-2" />
                                                        {isDuplicating ? 'Duplicating...' : 'Duplicate'}
                                                    </DropdownMenuItem>
                                                    {brief.status === 'draft' && (
                                                        <DropdownMenuItem
                                                            onSelect={() => onDelete(brief)}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    )}

                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    {/* Client & Status Row */}
                                    <div className="flex items-center justify-between gap-3 mb-3">
                                        <div className="text-sm text-muted-foreground truncate flex-1">
                                            <span className="font-medium">Client:</span>{' '}
                                            {brief.clients?.name || 'N/A'}
                                        </div>
                                        <div className="flex-shrink-0">
                                            <span
                                                className={`inline-flex items-center gap-1 text-xs font-semibold capitalize px-2.5 py-1 rounded-full ${getStatusClass(
                                                    brief.status
                                                )}`}
                                            >
                                                <span>{getStatusIcon(brief.status)}</span>
                                                {brief.status === 'rejected' ? 'Changes' : brief.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Total Amount */}
                                    <div className="flex justify-between items-center pt-3 border-t border-border/50">
                                        <span className="text-sm text-muted-foreground font-medium">Total Amount</span>
                                        <span className="text-lg font-bold text-foreground">
                                            {currencySymbol} {brief.total?.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <EmptyState searchQuery={searchQuery} />
                )}
            </div>
        </>
    );
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
    return (
        <div className="flex items-center justify-center gap-3 py-16 flex-col">
            <div className="h-20 w-20 p-0 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                    width="80"
                    height="80"
                    viewBox="-20 0 190 190"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M85.026 147.824L38.993 139.907L48.192 61.333L113.247 70.443L106.255 132.11L85.026 147.824ZM52.773 67.716L45.444 135.191L80.261 141.573L83.01 124.249L101.335 126.064L106.832 75.002L52.773 67.716ZM58.177 85.479L58.702 79.019L99.806 85.163L98.652 90.666L58.177 85.479ZM95.821 104.161L57.127 98.377L57.583 92.763L97.148 97.833L95.821 104.161ZM78.416 113.773L56.011 112.107L56.532 105.703L80.25 108.253L78.416 113.773Z"
                        fill="currentColor"
                        className="text-primary"
                    />
                </svg>
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                    {searchQuery ? 'No briefs found' : 'No briefs yet'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    {searchQuery
                        ? `No matches for "${searchQuery}"`
                        : "Get started by creating your first brief"}
                </p>
            </div>
        </div>
    );
}