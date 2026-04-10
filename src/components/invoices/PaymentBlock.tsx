// components/invoices/PaymentBlock.tsx
import { Profile } from '@/types';
import { ExternalLink } from 'lucide-react';

type PaymentBlockProps = {
    profile: Profile | null;
    invoiceStatus?: string;
};

export default function PaymentBlock({ profile, invoiceStatus }: PaymentBlockProps) {
    if (!profile) return null;

    const { upi_id, paypal_link, stripe_link, custom_payment_link, custom_payment_label } = profile;
    const hasAnyMethod = upi_id || paypal_link || stripe_link || custom_payment_link;

    if (!hasAnyMethod) return null;

    const isPaid = invoiceStatus === 'paid';

    return (
        <div className="max-w-[800px] mx-auto px-4 py-8">
            <div className="border rounded-xl p-6 space-y-6 bg-white shadow-sm">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {isPaid ? 'Payment Received' : 'How to Pay'}
                    </h2>
                    {isPaid ? (
                        <p className="text-sm text-green-600 mt-1">
                            This invoice has been marked as paid. Thank you!
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500 mt-1">
                            Choose any of the options below. Money goes directly to your freelancer.
                        </p>
                    )}
                </div>

                {!isPaid && (
                    <div className="space-y-4">
                        {/* UPI */}
                        {upi_id && (
                            <div className="flex items-center gap-4 p-4 rounded-lg border bg-orange-50 border-orange-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`upi://pay?pa=${upi_id}`)}&size=120x120&margin=6`}
                                    alt="UPI QR Code"
                                    width={120}
                                    height={120}
                                    className="rounded-lg border border-orange-200 bg-white flex-shrink-0"
                                />
                                <div className="min-w-0">
                                    <p className="font-medium text-gray-900">Pay via UPI</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Scan the QR code with any UPI app (PhonePe, GPay, Paytm, etc.)
                                    </p>
                                    <p className="text-sm font-mono mt-2 text-orange-700 break-all">
                                        {upi_id}
                                    </p>
                                    <a
                                        href={`upi://pay?pa=${upi_id}`}
                                        className="inline-block mt-2 text-sm text-orange-600 underline underline-offset-2"
                                    >
                                        Open in UPI app
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* PayPal */}
                        {paypal_link && (
                            <a
                                href={paypal_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between w-full p-4 rounded-lg border bg-blue-50 border-blue-100 hover:bg-blue-100 transition-colors group"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">Pay via PayPal</p>
                                    <p className="text-sm text-gray-500 mt-0.5">Credit/debit card accepted</p>
                                </div>
                                <ExternalLink className="h-4 w-4 text-blue-500 group-hover:text-blue-700 flex-shrink-0" />
                            </a>
                        )}

                        {/* Stripe */}
                        {stripe_link && (
                            <a
                                href={stripe_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between w-full p-4 rounded-lg border bg-violet-50 border-violet-100 hover:bg-violet-100 transition-colors group"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">Pay via Card / Stripe</p>
                                    <p className="text-sm text-gray-500 mt-0.5">Secure card payment</p>
                                </div>
                                <ExternalLink className="h-4 w-4 text-violet-500 group-hover:text-violet-700 flex-shrink-0" />
                            </a>
                        )}

                        {/* Custom */}
                        {custom_payment_link && (
                            <a
                                href={custom_payment_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between w-full p-4 rounded-lg border bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors group"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {custom_payment_label || 'Pay via Custom Link'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-0.5">Wise, bank transfer, or other</p>
                                </div>
                                <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-gray-700 flex-shrink-0" />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
