/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import React, { ReactElement, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Printer, ShieldCheck, Download, Check, AlertCircle, FileText, Zap, Maximize2, Edit3, RotateCcw, X, Expand } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import NonLoginNavbar from '@/components/landing/NonLoginNavbar';
import Head from 'next/head';
import { cn } from '@/lib/utils';
import { twMerge } from 'tailwind-merge';

// --- Types ---
interface ContractData {
    freelancerName: string;
    clientName: string;
    role: string;
    rate: string;
    startDate: string;
    deliverables: string;
    paymentSchedule: string;
    revisionLimit: string;
    latePaymentFee: string;
    depositPercentage: string;
    includeNDA: boolean;
    includeKillFee: boolean;
    includeExpenses: boolean;
    killFeePercentage: string;
}

interface TemplateData {
    id: string;
    label: string;
    role: string;
    rate: string;
    icon: React.ElementType;
}

// --- Data Constants ---
const TEMPLATES: TemplateData[] = [
    { id: 'web-design', label: 'Web Design', role: 'Web Designer', rate: '$75/hour', icon: FileText },
    { id: 'writing', label: 'Writing', role: 'Content Writer', rate: '$0.15/word', icon: FileText },
    { id: 'photography', label: 'Photography', role: 'Photographer', rate: '$2000/project', icon: FileText },
    { id: 'consulting', label: 'Consulting', role: 'Business Consultant', rate: '$150/hour', icon: FileText },
];

const FAQ_DATA = [
    {
        q: "Is this freelance contract template legally binding?",
        a: "Yes, when signed by both parties, this becomes a legally binding agreement. However, contract law varies by jurisdiction. For high-value projects or complex situations, we recommend having a lawyer review the contract."
    },
    {
        q: "Do I need a lawyer to use this contract template?",
        a: "For most standard freelance projects, this template provides adequate protection. However, for contracts over $10,000, international clients, or projects with unique requirements, consulting a lawyer is advisable."
    },
    {
        q: "Can I customize this contract for my specific needs?",
        a: "Absolutely! You can edit the generated text directly in the editor or copy it to your preferred word processor to make further changes."
    },
    {
        q: "How do I get my client to sign the contract?",
        a: "You can email the contract as a PDF, use electronic signature tools like DocuSign or HelloSign, or print and sign physically. Always keep a signed copy for your records."
    },
    {
        q: "What's the difference between a contract and an invoice?",
        a: "A contract establishes the terms of your working relationship before work begins. An invoice is a bill you send after completing work (or milestones) to request payment. You need both! Use this tool for contracts, then create invoices with Sheet2Bill."
    }
];

const INDUSTRY_TIPS = [
    {
        title: "Web Designers & Developers",
        content: "Include revision limits, browser compatibility standards, and clarify who provides hosting/domain. Specify if ongoing maintenance is included."
    },
    {
        title: "Writers & Content Creators",
        content: "Define word count, number of drafts, usage rights, and whether you retain byline/portfolio rights. Specify if SEO optimization is included."
    },
    {
        title: "Photographers & Videographers",
        content: "Clarify deliverable formats, number of final images/videos, editing rounds, and usage rights. Include travel/equipment fees if applicable."
    },
    {
        title: "Consultants & Coaches",
        content: "Define session length, number of meetings, communication channels, and response times. Include confidentiality and non-compete clauses."
    }
];

// --- Sub-Components ---

const TemplateSelector = ({ onSelect }: { onSelect: (t: TemplateData) => void }) => (
    <Card className="bg-gradient-to-br from-primary/20 to-white border-primary">
        <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary " />
                Quick Start Templates
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            {TEMPLATES.map((t) => (
                <Button
                    key={t.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => onSelect(t)}
                >
                    <t.icon className="h-3 w-3 mr-2" />
                    {t.label}
                </Button>
            ))}
        </CardContent>
    </Card>
);

const TrustIndicators = () => (
    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
        {['No signup required', '100% Free forever', 'Download as PDF or Word'].map((text, i) => (
            <div key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>{text}</span>
            </div>
        ))}
    </div>
);

const SEOContent = () => (
    <div className="mt-16 max-w-4xl mx-auto space-y-8">
        <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Every Freelancer Needs a Contract</h2>
            <p className="text-slate-600 leading-relaxed">
                A freelance contract (also called an independent contractor agreement) is your first line of defense against scope creep, late payments, and client disputes. Without a written agreement, you have no legal protection if a client refuses to pay or demands endless revisions.
            </p>

            <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">What Should a Freelance Contract Include?</h3>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Scope of Work:</strong> Clearly define what you will and won't do</li>
                <li><strong>Payment Terms:</strong> Your rate, payment schedule, and late fees</li>
                <li><strong>Revision Limits:</strong> Prevent unlimited free revisions</li>
                <li><strong>Kill Fee:</strong> Get paid even if the project is cancelled</li>
                <li><strong>Ownership Rights:</strong> Who owns the final work product</li>
                <li><strong>Confidentiality:</strong> Protect sensitive client information</li>
            </ul>

            <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">Industry-Specific Contract Tips</h3>
            <div className="grid md:grid-cols-2 gap-6 mt-4">
                {INDUSTRY_TIPS.map((tip, i) => (
                    <div key={i} className="bg-secondary p-6 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">{tip.title}</h4>
                        <p className="text-sm text-slate-600">{tip.content}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const FAQSection = () => (
    <div className="mt-12 bg-white rounded-xl p-8 shadow-sm border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h3>
        <div className="space-y-6 max-w-3xl mx-auto">
            {FAQ_DATA.map((faq, i) => (
                <div key={i}>
                    <h4 className="font-semibold text-slate-900 mb-2">{faq.q}</h4>
                    <p className="text-sm text-slate-600">{faq.a}</p>
                </div>
            ))}
        </div>
    </div>
);

// --- New Reusable Preview Components ---

interface ContractActions {
    onCopy: () => void;
    onDownloadWord: () => void;
    onDownloadPDF: () => void;
}

interface ContractEditorState {
    text: string;
    isEditing: boolean;
    isManualEdit: boolean;
    onEdit: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onToggleEdit: () => void;
    onReset: () => void;
}

const ContractToolbar = ({ actions, editorState, onFullscreen, className }: { actions: ContractActions, editorState: ContractEditorState, onFullscreen?: () => void, className?: string }) => (
    <div className={twMerge("flex items-center justify-between p-4 border-b bg-primary/5", className)}>
        <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Contract Preview</CardTitle>
            {editorState.isManualEdit && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">Manual Edits</span>}
        </div>
        <div className="flex gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={editorState.onToggleEdit}
                className="h-8 w-8 p-0"
                title={editorState.isEditing ? "View Mode" : "Edit Mode"}
            >
                {editorState.isEditing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </Button>
            {editorState.isManualEdit && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={editorState.onReset}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Reset to Auto-Generated"
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>
            )}
            {onFullscreen && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onFullscreen}
                    className="h-8 w-8 p-0"
                    title="Fullscreen"
                >
                    <Maximize2 className="h-4 w-4" />
                </Button>
            )}
        </div>
    </div>
);

const ContractFooter = ({ actions }: { actions: ContractActions }) => (
    <div className="border-t px-4 py-3 flex gap-2 justify-end bg-slate-50">
        <Button variant="outline" size="sm" onClick={actions.onCopy} className="gap-2 h-8 text-xs">
            <Copy className="h-3 w-3" /> Copy
        </Button>
        <Button variant="outline" size="sm" onClick={actions.onDownloadWord} className="gap-2 h-8 text-xs">
            <Download className="h-3 w-3" /> Word
        </Button>
        <Button variant="default" size="sm" onClick={actions.onDownloadPDF} className="gap-2 h-8 text-xs bg-primary hover:bg-indigo-700">
            <Printer className="h-3 w-3" /> PDF
        </Button>
    </div>
);

const ContractPaper = ({ text, isEditing, onEdit, className }: { text: string, isEditing: boolean, onEdit: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, className?: string }) => (
    <div className={cn("flex-1 overflow-auto bg-white relative", className)}>
        {isEditing ? (
            <Textarea
                value={text}
                onChange={onEdit}
                className="w-full h-full border-0 focus-visible:ring-0 resize-none p-8 font-mono text-sm leading-relaxed"
                placeholder="Start typing..."
            />
        ) : (
            <div className="p-8 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-800">
                {text}
            </div>
        )}
    </div>
);

// --- New Dialog Component ---

const ContractPreviewDialog = ({
    open,
    onOpenChange,
    actions,
    editorState
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    actions: ContractActions,
    editorState: ContractEditorState
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[80dvw] sm:max-w-[90dvw] h-[95dvh] flex flex-col p-0 gap-0 sm:rounded-xl">
                <ContractToolbar actions={actions} editorState={editorState} className='pe-24' />
                <ContractPaper
                    text={editorState.text}
                    isEditing={editorState.isEditing}
                    onEdit={editorState.onEdit}
                    className="min-h-0 w-full" // Important for flex scroll
                />
                <ContractFooter actions={actions} />
            </DialogContent>
        </Dialog>
    );
};

// --- Main Component ---

export default function EnhancedContractGenerator() {
    // Contract State
    const [data, setData] = useState<ContractData>({
        freelancerName: '',
        clientName: '',
        role: 'Web Designer',
        rate: '$50/hour',
        startDate: '',
        deliverables: '1. Homepage Design\n2. Mobile Responsive Layout\n3. 2 Revisions',
        paymentSchedule: 'milestone',
        revisionLimit: '2',
        killFeePercentage: '25',
        latePaymentFee: '5',
        depositPercentage: '50',
        includeNDA: false,
        includeKillFee: false,
        includeExpenses: false,
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [contractText, setContractText] = useState('');
    const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
    const [isManualEdit, setIsManualEdit] = useState(false);

    // Handlers
    const updateField = (field: keyof ContractData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleTemplateSelect = (t: TemplateData) => {
        setData(prev => ({
            ...prev,
            role: t.role,
            rate: t.rate
        }));
        setIsManualEdit(false);
    };

    // Auto-generate text based on state
    const generateAutoText = () => {
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const { freelancerName, clientName, role, rate, startDate, deliverables, paymentSchedule, depositPercentage, latePaymentFee, revisionLimit, includeKillFee, killFeePercentage, includeExpenses, includeNDA } = data;

        let contract = `INDEPENDENT CONTRACTOR AGREEMENT\n\nDate: ${today}\n\nBETWEEN:\n"${freelancerName || '[Contractor Name]'}" (Contractor)\nAND\n"${clientName || '[Client Name]'}" (Client)\n\n1. SERVICES PROVIDED\nThe Contractor agrees to provide the following services ("Services") to the Client:\n${deliverables}\n\n2. COMPENSATION & PAYMENT TERMS\nThe Client agrees to pay the Contractor at the rate of: ${rate}.\n`;

        if (paymentSchedule === 'milestone') {
            contract += `\nPayment Schedule: Milestone-based payments\n- ${depositPercentage}% deposit due upon contract signing\n- Remaining balance split across project milestones\n- Final payment due upon project completion\n`;
        } else if (paymentSchedule === 'hourly') {
            contract += `\nPayment Schedule: Invoiced bi-weekly for hours worked\nPayment due within 7 days of invoice receipt\n`;
        } else {
            contract += `\nPayment Schedule: 50% upfront, 50% upon completion\n`;
        }

        contract += `\nLate Payment: If payment is not received within the specified timeframe, a late fee of ${latePaymentFee}% per month will be applied to the outstanding balance.\n\nPayment Method: Via [Sheet2Bill Invoice / Bank Transfer / PayPal]\n\n3. PROJECT TIMELINE\nThis agreement commences on ${startDate || '[Start Date]'} and shall continue until the completion of the Services as outlined in Section 1.\n\n4. REVISIONS & SCOPE CHANGES\nThe project fee includes up to ${revisionLimit} rounds of revisions. Additional revisions beyond this limit will be charged at ${rate}.\n\nAny changes to the original scope of work must be agreed upon in writing by both parties and may result in additional charges and timeline adjustments.\n`;

        if (includeKillFee) contract += `\n5. KILL FEE\nIf the Client terminates the project before completion for reasons other than Contractor breach, the Client agrees to pay a kill fee of ${killFeePercentage}% of the total project fee, plus payment for all work completed to date.\n`;

        const expensesSectionNum = includeKillFee ? '6' : '5';
        if (includeExpenses) contract += `\n${expensesSectionNum}. EXPENSES\nThe Contractor will be reimbursed for pre-approved, reasonable expenses directly related to the project. All expenses over $100 must be approved in writing before being incurred. Receipts must be provided for reimbursement.\n`;

        const nextSection = parseInt(expensesSectionNum) + (includeExpenses ? 1 : 0);

        contract += `\n${nextSection}. OWNERSHIP & INTELLECTUAL PROPERTY\nUpon full payment, the Client shall own all rights to the work product created under this agreement. Until full payment is received, all work product remains the property of the Contractor.\n\nThe Contractor retains the right to use the work for portfolio purposes, unless otherwise agreed in writing.\n\n${nextSection + 1}. INDEPENDENT CONTRACTOR STATUS\nThe Contractor is an independent contractor, not an employee. The Contractor is responsible for:\n- All federal, state, and local taxes\n- Their own equipment, software, and tools\n- Their own insurance coverage\n- Their own work schedule and methodology\n\n${nextSection + 2}. CONFIDENTIALITY\n`;

        if (includeNDA) {
            contract += `Both parties acknowledge they may have access to proprietary and confidential information and agree to:\n- Keep all proprietary information strictly confidential\n- Not disclose confidential information to any third party\n- Use confidential information only for purposes of this project\n- Return or destroy all confidential materials upon project completion\n\nThis confidentiality obligation shall survive the termination of this agreement for a period of 2 years.\n`;
        } else {
            contract += `The Contractor acknowledges that they may have access to proprietary information and agrees to keep all such information confidential during and after the term of this agreement.\n`;
        }

        contract += `\n${nextSection + 3}. WARRANTY & LIABILITY\nThe Contractor warrants that:\n- All work will be performed in a professional manner\n- All work is original and does not infringe on third-party rights\n- The Contractor has the right to enter into this agreement\n\nThe Contractor's total liability under this agreement shall not exceed the total amount paid by the Client.\n\n${nextSection + 4}. TERMINATION\nEither party may terminate this agreement with 7 days written notice.\n\nThe Client agrees to pay for all work completed up to the termination date, including any non-refundable expenses already incurred.\n\n${nextSection + 5}. DISPUTE RESOLUTION\nIn the event of a dispute, both parties agree to first attempt to resolve the matter through good faith negotiation. If negotiation fails, the parties agree to mediation before pursuing legal action.\n\n${nextSection + 6}. ENTIRE AGREEMENT\nThis document constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements. Any modifications must be made in writing and signed by both parties.\n\n\n________________________                    Date: __________\n${freelancerName || '[Contractor Name]'} (Contractor)\n\n\n________________________                    Date: __________\n${clientName || '[Client Name]'} (Client)`;

        return contract;
    };

    // Update contract text when data changes, unless manually edited
    useEffect(() => {
        if (!isManualEdit) {
            setContractText(generateAutoText());
        }
    }, [data, isManualEdit]);

    const handleManualEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContractText(e.target.value);
        setIsManualEdit(true);
    };

    const handleReset = () => {
        setIsManualEdit(false);
        setContractText(generateAutoText());
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(contractText);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleDownloadPDF = () => {
        const printWindow = window.open('', '', 'height=800,width=900');
        if (printWindow) {
            printWindow.document.write(`<html><head><title>Freelance Contract</title><style>body{font-family:'Times New Roman',serif;padding:60px;line-height:1.8;font-size:12pt;white-space:pre-wrap}h1{text-align:center;margin-bottom:30px}@media print{body{padding:40px}}</style></head><body>${contractText}</body></html>`);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handleDownloadWord = () => {
        const blob = new Blob([contractText], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Freelance_Contract_${data.clientName.replace(/\s+/g, '_') || 'Template'}.doc`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Group actions and state for child components
    const actions: ContractActions = {
        onCopy: handleCopy,
        onDownloadWord: handleDownloadWord,
        onDownloadPDF: handleDownloadPDF
    };

    const editorState: ContractEditorState = {
        text: contractText,
        isEditing,
        isManualEdit,
        onEdit: handleManualEdit,
        onToggleEdit: () => setIsEditing(!isEditing),
        onReset: handleReset
    };

    return (
        <div className='min-h-screen flex flex-col bg-slate-50'>
            <Head>
                <title>Free Freelance Contract Generator | Sheet2Bill</title>
                <meta name="description" content="Generate a simple, professional freelance contract in seconds. Protect your work and get paid on time. No signup required." />
                <meta name="keywords" content="freelance contract generator, simple freelance agreement, web design contract template, independent contractor agreement free" />
            </Head>

            <NonLoginNavbar pageType="TOOLS" />

            <div className="flex-1 mt-12 bg-gradient-to-br from-slate-50 via-primary/5 to-slate-100 py-12 px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-3 bg-primary rounded-full mb-4">
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Free Freelance Contract Generator
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
                            Create a professional, legally-sound independent contractor agreement in minutes.
                        </p>
                        <TrustIndicators />
                    </div>

                    {showSuccess && (
                        <Alert className="max-w-2xl mx-auto mb-6 bg-green-50 border-green-200">
                            <Check className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                Contract copied to clipboard! You can paste it anywhere.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                        {/* LEFT SIDEBAR: Quick Templates */}
                        <div className="lg:col-span-1 space-y-4">
                            <TemplateSelector onSelect={handleTemplateSelect} />
                        </div>

                        {/* CENTER: Form Inputs */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>Enter the fundamental project details</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Your Name (Contractor)</Label>
                                            <Input placeholder="Jane Doe" value={data.freelancerName} onChange={e => updateField('freelancerName', e.target.value)} />
                                        </div>
                                        <div>
                                            <Label>Client Name</Label>
                                            <Input placeholder="Acme Corp" value={data.clientName} onChange={e => updateField('clientName', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Your Role/Service</Label>
                                            <Input placeholder="Graphic Designer" value={data.role} onChange={e => updateField('role', e.target.value)} />
                                        </div>
                                        <div>
                                            <Label>Start Date</Label>
                                            <Input type="date" value={data.startDate} onChange={e => updateField('startDate', e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Scope of Work (Deliverables)</Label>
                                        <Textarea className="min-h-[100px]" placeholder="- Deliverable 1&#10;- Deliverable 2" value={data.deliverables} onChange={e => updateField('deliverables', e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment & Pricing</CardTitle>
                                    <CardDescription>Define how and when you get paid</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Payment Rate/Structure</Label>
                                        <Input placeholder="$50/hour or $5000 fixed" value={data.rate} onChange={e => updateField('rate', e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Payment Schedule</Label>
                                            <select className="w-full border rounded-md p-2 text-sm" value={data.paymentSchedule} onChange={e => updateField('paymentSchedule', e.target.value)}>
                                                <option value="milestone">Milestone-based</option>
                                                <option value="upfront">50% upfront</option>
                                                <option value="hourly">Bi-weekly (hourly)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Deposit Required (%)</Label>
                                            <Input type="number" value={data.depositPercentage} onChange={e => updateField('depositPercentage', e.target.value)} min="0" max="100" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Late Fee (%/mo)</Label>
                                            <Input type="number" value={data.latePaymentFee} onChange={e => updateField('latePaymentFee', e.target.value)} min="0" />
                                        </div>
                                        <div>
                                            <Label>Revisions</Label>
                                            <Input type="number" value={data.revisionLimit} onChange={e => updateField('revisionLimit', e.target.value)} min="0" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-primary bg-primary/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShieldCheck className="h-5 w-5 text-primary " />
                                        Advanced Protection
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { id: 'killFee', label: 'Include Kill Fee Clause', desc: 'Protects you if client cancels mid-project', checked: data.includeKillFee, field: 'includeKillFee' },
                                        { id: 'nda', label: 'Enhanced NDA', desc: 'Stronger confidentiality terms', checked: data.includeNDA, field: 'includeNDA' },
                                        { id: 'expenses', label: 'Expense Reimbursement', desc: 'For projects with material costs', checked: data.includeExpenses, field: 'includeExpenses' },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-start gap-3">
                                            <input type="checkbox" id={item.id} checked={item.checked} onChange={e => updateField(item.field as keyof ContractData, e.target.checked)} className="mt-1 " />
                                            <div className="flex-1">
                                                <Label htmlFor={item.id} className="cursor-pointer font-medium">{item.label}</Label>
                                                <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                                                {item.id === 'killFee' && data.includeKillFee && (
                                                    <Input type="number" placeholder="Kill fee %" value={data.killFeePercentage} onChange={e => updateField('killFeePercentage', e.target.value)} className="mt-2 w-32 bg-white" min="0" max="100" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-sm">
                                    <strong>Legal Notice:</strong> This template is for informational purposes. Consult with a lawyer for complex projects.
                                </AlertDescription>
                            </Alert>
                        </div>

                        {/* RIGHT: Preview (Sticky / Fullscreen) */}
                        <div className="lg:col-span-2 lg:sticky lg:top-6 h-fit">

                            <Card className="shadow-xl border-slate-200 transition-all duration-300 flex flex-col p-4 rounded-2xl">
                                <CardHeader className="border-b bg-primary/10 flex flex-row items-center justify-between p-4  w-full rounded-2xl">
                                    <ContractToolbar
                                        actions={actions}
                                        editorState={editorState}
                                        onFullscreen={() => setIsPreviewDialogOpen(true)}
                                        className='w-full'
                                    />
                                </CardHeader>

                                <div className="bg-white flex flex-col flex-1 overflow-hidden max-h-[800px] p-0 rounded-b-2xl">
                                    <ContractFooter actions={actions} />
                                    <ContractPaper
                                        text={editorState.text}
                                        isEditing={editorState.isEditing}
                                        onEdit={editorState.onEdit}
                                        className="min-h-[500px]"
                                    />
                                </div>
                            </Card>

                            <Card className="mt-6 bg-gradient-to-br from-primary to-primary/70 text-white border-0">
                                <CardContent >
                                    <h3 className="font-bold text-lg mb-2">Complete Your Workflow</h3>
                                    <p className="text-white text-sm mb-4">
                                        Add your client, share a project brief for approval, and turn it into an invoice instantly.
                                    </p>
                                    <Button onClick={() => window.location.href = '/signup'} className="w-full bg-white text-primary hover:shadow-lg hover:bg-accent">
                                        Start Free Trial →
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <SEOContent />
                    <FAQSection />

                    {/* Final CTA Section */}
                    <div className="mt-12 bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-12 text-center text-white">
                        <h3 className="text-3xl font-bold mb-4">Ready to Get Paid Like a Pro?</h3>
                        <p className="text-lg text-white mb-6 max-w-2xl mx-auto">
                            Create contracts, share briefs for approval, and generate invoices in a single place. Streamline your entire freelance workflow with Sheet2Bill.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => window.location.href = '/signup'} size="lg" className="bg-white text-primary hover:bg-accent hover:shadow-lg">
                                Start Free Trial
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contract Preview Dialog */}
            <ContractPreviewDialog
                open={isPreviewDialogOpen}
                onOpenChange={setIsPreviewDialogOpen}
                actions={actions}
                editorState={editorState}
            />
        </div>
    );
}

EnhancedContractGenerator.getLayout = function getLayout(page: ReactElement) {
    return page;
};