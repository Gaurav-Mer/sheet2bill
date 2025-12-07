/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/settings.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useState, ChangeEvent } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Image from 'next/image';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Profile } from '@/types';
import { uploadLogo } from '@/lib/supabase/storage';
import { Textarea } from '@/components/ui/textarea';
import { FeatureGate } from '@/components/FeatureGate';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryList } from '@/lib/countryList';
import NotificationToggle from '@/components/push_notification/NotificationToggle';
import Script from 'next/script';

type SettingsPageProps = {
    profile: Profile | null;
    user: any
};

export default function SettingsPage({ profile, user }: SettingsPageProps) {
    const supabase = useSupabaseClient();
    // const usera = useUser();

    // --- State for all profile fields ---
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [companyName, setCompanyName] = useState(profile?.company_name || '');
    const [phone, setPhone] = useState(profile?.phone_number || '');
    const [website, setWebsite] = useState(profile?.website || '');
    const [address1, setAddress1] = useState(profile?.address_line_1 || '');
    const [city, setCity] = useState(profile?.city || '');
    const [country, setCountry] = useState(profile?.country || '');
    const [taxId, setTaxId] = useState(profile?.tax_id || '');
    const [brandColor, setBrandColor] = useState(profile?.brand_color || '#4f46e5'); // NEW STATE
    const [footerMessage, setFooterMessage] = useState(profile?.thank_u_note || 'Thank you for your business!'); // NEW STATE
    const [defaultCurrency, setDefaultCurrency] = useState(profile?.default_currency || 'USD'); // NEW STATE


    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(profile?.avatar_url || null);
    const updateProfileMutation = useMutation({
        mutationFn: async (updatedProfile: any) => {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProfile),
            });
            if (!response.ok) throw new Error('Failed to update profile');
            return response.json();
        },
        onSuccess: () => toast.success('Profile updated successfully!'),
        onError: () => toast.error('Error updating profile.'),
    });

    const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!user) return;

        let avatarUrl = logoPreview; // Start with the current preview/existing URL

        if (logoFile) {
            try {
                const filePath = await uploadLogo(supabase, user.id, logoFile);
                const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
                avatarUrl = data.publicUrl;
            } catch (error) {
                toast.error('Failed to upload logo.');
                console.error(error);
                return;
            }
        }

        updateProfileMutation.mutate({
            full_name: fullName,
            company_name: companyName,
            avatar_url: avatarUrl,
            phone_number: phone,
            website: website,
            address_line_1: address1,
            city: city,
            country: country,
            tax_id: taxId,
            brand_color: brandColor, // NEW
            thank_u_note: footerMessage,
            default_currency: defaultCurrency // NEW
        });
    };

    return (
        <>
            <Script
                src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
                strategy="afterInteractive"
            />
            <div className="container mx-auto  max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Settings</h1>
                            <p className="text-muted-foreground mt-2">Manage your account and profile settings.</p>
                        </div>
                        <Button type="submit" disabled={updateProfileMutation.isPending}>
                            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>This is your personal and company information.</CardDescription>
                            <NotificationToggle savedIds={profile?.onesignal_ids ?? []} />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Company Logo</Label>
                                <div className="flex items-center space-x-4">
                                    {logoPreview ? (
                                        <Image fetchPriority='low' src={logoPreview} alt="Logo Preview" width={64} height={64} className="rounded-md object-contain h-16 w-16 border" />
                                    ) : (
                                        <div className="h-16 w-16 rounded-md border bg-muted flex items-center justify-center text-muted-foreground text-xs">No Logo</div>
                                    )}
                                    <Input id="logo" type="file" accept="image/png, image/jpeg" onChange={handleLogoChange} className="max-w-xs" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} /></div>
                                <div className="space-y-2"><Label htmlFor="companyName">Company Name</Label><Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} maxLength={150} /></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" value={user?.email || ''} disabled /></div>

                            <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} /></div>

                            <div className="space-y-2 col-span-full"><Label htmlFor="website">Website</Label><Input maxLength={100} id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." /></div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Billing Address & Tax Info</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Select onValueChange={setCountry} defaultValue={country}>
                                        <SelectTrigger className='w-full' id="country"><SelectValue placeholder="Select your country..." /></SelectTrigger>
                                        <SelectContent>
                                            {countryList.map((country) => (
                                                <SelectItem key={country.code} value={country.code}>
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" value={city} onChange={(e) => setCity(e.target.value)} /></div>

                            </div>
                            <div className="space-y-2"><Label htmlFor="address1">Address</Label><Input id="address1" value={address1} onChange={(e) => setAddress1(e.target.value)} /></div>
                            <div className="space-y-2">
                                <Label htmlFor="defaultCurrency">Default Currency</Label>
                                <Select onValueChange={setDefaultCurrency} defaultValue={defaultCurrency}>
                                    <SelectTrigger id="defaultCurrency"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label htmlFor="taxId">Tax ID (e.g., GSTIN, VAT ID)</Label><Input id="taxId" value={taxId} onChange={(e) => setTaxId(e.target.value)} /></div>
                        </CardContent>
                    </Card>

                    <FeatureGate>
                        <Card id="branding">
                            <CardHeader>
                                <CardTitle>Branding</CardTitle>
                                <CardDescription>Customize the look of your invoices.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Logo Upload Section */}
                                <div className="space-y-2">
                                    <Label>Company Logo</Label>
                                    {/* ... logo upload JSX ... */}
                                </div>

                                {/* --- NEW: BRAND COLOR PICKER --- */}
                                <div className="space-y-2">
                                    <Label htmlFor="brandColor">Brand Color</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="brandColor"
                                            type="color"
                                            value={brandColor}
                                            onChange={(e) => setBrandColor(e.target.value)}
                                            className="p-1 h-10 w-14"
                                        />
                                        <Input
                                            type="text"
                                            value={brandColor}
                                            onChange={(e) => setBrandColor(e.target.value)}
                                            className="max-w-[120px]"
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">This color will be used on your invoices.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="footerMessage">Invoice Footer Message</Label>
                                    <Textarea
                                        id="footerMessage"
                                        value={footerMessage}
                                        onChange={(e) => setFooterMessage(e.target.value)}
                                        placeholder="e.g., Thank you for your business!"
                                        maxLength={250}
                                    />
                                    <p className="text-sm text-muted-foreground">This message will appear at the bottom of your invoices.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </FeatureGate>
                </form>
            </div>
        </>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();
    if (!user || authError) return { redirect: { destination: '/login', permanent: false } };

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return { props: { user: user, profile: profile || null } };
};