import { Button } from '@/components/ui/button';
import { normalizeCountry } from '@/lib/normalizeCountry';
import type { Client } from '@/pages/clients';
import { Mail, MapPin, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ClientTableProps = {
    clients: Client[];
    onEdit: (client: Client) => void;
    onDelete: (client: Client) => void;
    searchQuery: string;
};

export function ClientTable({ clients, onEdit, onDelete, searchQuery }: ClientTableProps) {
    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden lg:block border border-border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Country
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                        {clients.length > 0 ? (
                            clients.map((client) => (
                                <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">
                                        {client.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                        {client.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                        {normalizeCountry(client?.country ?? '')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => onEdit(client)}>
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => onDelete(client)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                                    <EmptyState searchQuery={searchQuery} />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
                {clients.length > 0 ? (
                    clients.map((client) => (
                        <div
                            key={client.id}
                            className="group relative bg-card border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                        >
                            {/* Gradient accent on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />

                            <div className="relative flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    {/* Client Avatar/Initial */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold text-lg shadow-md">
                                            {client.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-base text-foreground truncate">
                                                {client.name}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                                <Mail className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{client.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Country Info */}
                                    {client.country && (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5 w-fit">
                                            <MapPin className="w-3 h-3 flex-shrink-0" />
                                            <span>{normalizeCountry(client.country)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-muted/80"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem
                                            onClick={() => onEdit(client)}
                                            className="cursor-pointer"
                                        >
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onDelete(client)}
                                            className="cursor-pointer text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Quick Action Buttons - Mobile */}
                            <div className="relative flex gap-2 mt-4 pt-3 border-t border-border/50">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(client)}
                                    className="flex-1 text-xs"
                                >
                                    <Pencil className="w-3 h-3 mr-1.5" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onDelete(client)}
                                    className="flex-1 text-xs"
                                >
                                    <Trash2 className="w-3 h-3 mr-1.5" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))
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
            <div className="h-20 w-20 p-4 rounded-full bg-primary/10 flex items-center justify-center">
                <SearchDocumentIcon size={40} color="currentColor" className="text-primary" />
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                    {searchQuery ? 'No clients found' : 'No clients yet'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    {searchQuery
                        ? `No matches for "${searchQuery}"`
                        : "Get started by adding your first client"}
                </p>
            </div>
        </div>
    );
}

export const SearchDocumentIcon = ({
    size = 48,
    color = '#000000',
    ...props
}: React.SVGProps<SVGSVGElement> & { size?: number; color?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M31.5642,17.3199V7.1278c0-1.4453-1.1825-2.6278-2.6278-2.6278H11.8432c-1.4453,0-2.6278,1.1825-2.6278,2.6278v33.7443c0,1.4453,1.1825,2.6278,2.6278,2.6278h17.0932c1.4453,0,2.6278-1.1825,2.6278-2.6278v-1.6946" />
        <circle cx="30.0366" cy="28.3614" r="8.4729" />
        <line x1="38.7846" y1="39.4232" x2="35.1324" y2="35.1268" />
        <line x1="18.0567" y1="8.0365" x2="22.7229" y2="8.0365" />
        <polyline points="11.966 18.1058 15.1096 18.1058 16.7305 21.102 18.8426 14.2254 20.1196 18.1058 22.9685 18.1058" />
        <circle cx="20.3898" cy="39.7179" r="1.1738" />
    </svg>
);