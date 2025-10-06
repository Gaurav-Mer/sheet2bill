import { Button } from '@/components/ui/button';
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
                            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{client.country}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <Button variant="outline" size="sm" onClick={() => onEdit(client)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => onDelete(client)}>Delete</Button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                                {searchQuery ? `No clients found for "${searchQuery}"` : "You haven't added any clients yet."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}