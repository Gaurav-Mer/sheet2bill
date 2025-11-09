import { Button } from '@/components/ui/button';
import { normalizeCountry } from '@/lib/normalizeCountry';
import type { Client } from '@/pages/clients'; // We will define this type in the main page

type ClientTableProps = {
    clients: Client[];
    onEdit: (client: Client) => void;
    onDelete: (client: Client) => void;
    searchQuery: string;
};

export function ClientTable({ clients, onEdit, onDelete, searchQuery }: ClientTableProps) {

    return (
        <div className="border border-border rounded-lg">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                    {clients.length > 0 ? clients.map(client => (
                        <tr key={client.id}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">{client.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{client.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{normalizeCountry(client?.country ?? "")}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <Button variant="outline" size="sm" onClick={() => onEdit(client)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => onDelete(client)}>Delete</Button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                                <div className='flex items-center justify-center gap-3 h-full flex-col'>
                                    <div className='h-20 w-20 p-4 rounded-full bg-primary/10'>
                                        <SearchDocumentIcon size={60} color="black" />
                                    </div>
                                    <p className="text-xs text-center text-black/50 mt-1">   {searchQuery ? `No clients found for "${searchQuery}"` : "You haven't added any clients yet."}</p>

                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}


export const SearchDocumentIcon = ({
    size = 48,
    color = "#000000",
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