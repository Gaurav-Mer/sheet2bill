import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { countryList } from '@/lib/countryList';
import type { Client } from '@/pages/clients';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormEvent } from 'react';

type ClientFormProps = {
    client?: Client | null;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    submitButtonText: string;
};

export function ClientForm({ client, onSubmit, submitButtonText }: ClientFormProps) {
    return (
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="name">Name*</Label><Input id="name" name="name" required defaultValue={client?.name} /></div>
                <div><Label htmlFor="email">Email*</Label>
                    <Input required id="email" name="email" type="email" defaultValue={client?.email ?? ''} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input id="contact_person" name="contact_person" defaultValue={client?.contact_person ?? ''} />
                </div>
                <div><Label htmlFor="phone_number">Phone</Label><Input id="phone_number" name="phone_number" defaultValue={client?.phone_number ?? ''} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="country">Country</Label>
                    <Select name='country' defaultValue={client?.country ?? "IN"}>
                        <SelectTrigger className='w-full' name='country' id="country">
                            <SelectValue placeholder="Select your country..." /></SelectTrigger>
                        <SelectContent>
                            {countryList.map((country, i) => (
                                <SelectItem key={i} value={country.code}>
                                    {country.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* <Input id="country" name="country" defaultValue={client?.country ?? ''} /> */}
                </div>
                <div><Label htmlFor="city">City</Label><Input id="city" name="city" defaultValue={client?.city ?? ''} /></div>

            </div>
            <div><Label htmlFor="tax_id">Tax ID (e.g., GSTIN, VAT ID)</Label><Input id="tax_id" name="tax_id" defaultValue={client?.tax_id ?? ''} /></div>
            <div><Label htmlFor="notes">Notes</Label><Textarea id="notes" name="notes" placeholder="Private notes about this client..." defaultValue={client?.notes ?? ''} /></div>
            <div className="flex justify-end mt-4">
                <Button type="submit">{submitButtonText}</Button>
            </div>
        </form>
    );
}