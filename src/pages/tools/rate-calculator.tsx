/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Calculator, DollarSign, TrendingUp, Briefcase, Clock, Target, PiggyBank, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import NonLoginNavbar from '@/components/landing/NonLoginNavbar';

export default function PremiumRateCalculator() {
    // Basic Inputs
    const [goal, setGoal] = useState(60000);
    const [expenses, setExpenses] = useState(500);
    const [hours, setHours] = useState(30);
    const [weeksOff, setWeeksOff] = useState(4);

    // Advanced Inputs
    const [taxRate, setTaxRate] = useState(25);
    const [healthInsurance, setHealthInsurance] = useState(400);
    const [retirement, setRetirement] = useState(500);
    const [experienceLevel, setExperienceLevel] = useState('intermediate');
    const [industry, setIndustry] = useState('general');
    const [profitMargin, setProfitMargin] = useState(20);

    // Outputs
    const [hourlyRate, setHourlyRate] = useState(0);
    const [monthlyTarget, setMonthlyTarget] = useState(0);
    const [projectRate, setProjectRate] = useState(0);
    const [yearlyRevenue, setYearlyRevenue] = useState(0);
    const [marketComparison, setMarketComparison] = useState('average');

    // Industry benchmarks
    const industryMultipliers: any = {
        'general': 1.0,
        'web-dev': 1.2,
        'graphic-design': 0.9,
        'writing': 0.85,
        'marketing': 1.1,
        'consulting': 1.3,
        'video': 1.15
    };

    const experienceMultipliers: any = {
        'beginner': 0.7,
        'intermediate': 1.0,
        'advanced': 1.3,
        'expert': 1.6
    };

    useEffect(() => {
        // Annual personal expenses
        const annualHealthInsurance = healthInsurance * 12;
        const annualRetirement = retirement * 12;
        const annualBusinessExpenses = expenses * 12;

        // Total before tax
        const totalBeforeTax = goal + annualHealthInsurance + annualRetirement + annualBusinessExpenses;

        // Add taxes
        const totalWithTax = totalBeforeTax / (1 - taxRate / 100);

        // Add profit margin
        const totalWithProfit = totalWithTax * (1 + profitMargin / 100);

        // Calculate billable hours
        const totalBillableWeeks = 52 - weeksOff;
        const totalAnnualHours = totalBillableWeeks * hours;

        // Apply reality factors (admin time, unbilled time)
        const realisticHours = totalAnnualHours * 0.75;

        // Base rate
        let baseRate = totalWithProfit / realisticHours;

        // Apply industry and experience multipliers
        baseRate *= industryMultipliers[industry ?? "" as any];
        baseRate *= experienceMultipliers[experienceLevel];

        // Set all outputs
        setHourlyRate(Math.ceil(baseRate));
        setMonthlyTarget(Math.ceil(totalWithProfit / 12));
        setProjectRate(Math.ceil(baseRate * 40)); // 40-hour project
        setYearlyRevenue(Math.ceil(totalWithProfit));

        // Market comparison
        if (baseRate < 50) setMarketComparison('below');
        else if (baseRate >= 50 && baseRate < 100) setMarketComparison('average');
        else setMarketComparison('above');
    }, [goal, expenses, hours, weeksOff, taxRate, healthInsurance, retirement, experienceLevel, industry, profitMargin]);

    return (
        <div className='flex h-dvh  flex-col gap-4'>
            <NonLoginNavbar pageType="TOOLS" />
            <div className="flex-1 mt-12 overflow-auto bg-gradient-to-br from-slate-50 via-primary/10 to-slate-100 py-12 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-3 bg-primary rounded-full mb-4">
                            <Calculator className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4 bg-clip-text  bg-gradient-to-r from-slate-900 to-primary">
                            Freelance Rate Calculator 2025
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
                            Calculate your ideal hourly rate based on income goals, expenses, and market data. Stop undercharging—know your worth.
                        </p>
                        <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <span>Free Forever</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <span>Industry Benchmarks</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <span>Tax Inclusive</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT: INPUTS */}
                        <div className="lg:col-span-2 space-y-6">
                            <Tabs defaultValue="basic" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="basic">Basic Calculator</TabsTrigger>
                                    <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
                                </TabsList>

                                {/* BASIC TAB */}
                                <TabsContent value="basic" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Target className="h-5 w-5 text-primary" />
                                                Income Goals
                                            </CardTitle>
                                            <CardDescription>What do you want to take home after taxes and expenses?</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-8">
                                            {/* Target Annual Income */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <Label className="text-base font-semibold">Target Annual Take-Home Income</Label>
                                                    <span className="text-2xl font-bold text-primary">${goal.toLocaleString()}</span>
                                                </div>
                                                <Slider
                                                    value={[goal]}
                                                    onValueChange={(val) => setGoal(val[0])}
                                                    max={300000}
                                                    step={5000}
                                                    className="py-4"
                                                />
                                                <div className="flex justify-between text-xs text-slate-500">
                                                    <span>$0</span>
                                                    <span>$300,000+</span>
                                                </div>
                                                <p className="text-sm text-slate-600 flex items-start gap-2">
                                                    <Info className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                                                    This is your desired personal income (like a salary), not your business revenue.
                                                </p>
                                            </div>

                                            {/* Monthly Expenses */}
                                            <div className="grid gap-3">
                                                <Label htmlFor="expenses" className="text-base font-semibold flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4 text-primary" />
                                                    Monthly Business Expenses
                                                </Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                    <Input
                                                        id="expenses"
                                                        type="number"
                                                        className="pl-10 text-lg h-12"
                                                        value={expenses}
                                                        onChange={(e) => setExpenses(Number(e.target.value))}
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-600">
                                                    Software subscriptions, internet, office space, equipment, marketing, accounting, etc.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                {/* Hours per week */}
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <Label className="text-base font-semibold flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-primary" />
                                                            Billable Hours/Week
                                                        </Label>
                                                        <span className="text-xl font-bold text-primary">{hours}h</span>
                                                    </div>
                                                    <Slider
                                                        value={[hours]}
                                                        onValueChange={(val) => setHours(val[0])}
                                                        max={50}
                                                        min={10}
                                                        step={1}
                                                    />
                                                    <p className="text-xs text-slate-600">
                                                        Only count client work time, not admin, sales, or marketing.
                                                    </p>
                                                </div>

                                                {/* Weeks Off */}
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <Label className="text-base font-semibold flex items-center gap-2">
                                                            <PiggyBank className="h-4 w-4 text-primary" />
                                                            Weeks Off/Year
                                                        </Label>
                                                        <span className="text-xl font-bold text-primary">{weeksOff}w</span>
                                                    </div>
                                                    <Slider
                                                        value={[weeksOff]}
                                                        onValueChange={(val) => setWeeksOff(val[0])}
                                                        max={12}
                                                        step={1}
                                                    />
                                                    <p className="text-xs text-slate-600">
                                                        Vacation, holidays, sick days, and personal time.
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* ADVANCED TAB */}
                                <TabsContent value="advanced" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Professional Details</CardTitle>
                                            <CardDescription>Refine your rate with experience level and industry data</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid gap-3">
                                                <Label>Your Experience Level</Label>
                                                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                                                        <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                                                        <SelectItem value="advanced">Advanced (5-10 years)</SelectItem>
                                                        <SelectItem value="expert">Expert (10+ years)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid gap-3">
                                                <Label>Your Industry</Label>
                                                <Select value={industry} onValueChange={setIndustry}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="general">General Freelancing</SelectItem>
                                                        <SelectItem value="web-dev">Web Development</SelectItem>
                                                        <SelectItem value="graphic-design">Graphic Design</SelectItem>
                                                        <SelectItem value="writing">Content Writing</SelectItem>
                                                        <SelectItem value="marketing">Digital Marketing</SelectItem>
                                                        <SelectItem value="consulting">Business Consulting</SelectItem>
                                                        <SelectItem value="video">Video Production</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <Label>Estimated Tax Rate (%)</Label>
                                                    <span className="font-bold text-primary">{taxRate}%</span>
                                                </div>
                                                <Slider
                                                    value={[taxRate]}
                                                    onValueChange={(val) => setTaxRate(val[0])}
                                                    max={45}
                                                    min={15}
                                                    step={1}
                                                />
                                                <p className="text-xs text-slate-600">
                                                    Federal + State + Self-Employment tax (15.3%). Consult a tax professional.
                                                </p>
                                            </div>

                                            <div className="grid gap-3">
                                                <Label htmlFor="health">Monthly Health Insurance</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                    <Input
                                                        id="health"
                                                        type="number"
                                                        className="pl-10"
                                                        value={healthInsurance}
                                                        onChange={(e) => setHealthInsurance(Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-3">
                                                <Label htmlFor="retirement">Monthly Retirement Savings</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                    <Input
                                                        id="retirement"
                                                        type="number"
                                                        className="pl-10"
                                                        value={retirement}
                                                        onChange={(e) => setRetirement(Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <Label>Desired Profit Margin (%)</Label>
                                                    <span className="font-bold text-primary">{profitMargin}%</span>
                                                </div>
                                                <Slider
                                                    value={[profitMargin]}
                                                    onValueChange={(val) => setProfitMargin(val[0])}
                                                    max={40}
                                                    min={10}
                                                    step={5}
                                                />
                                                <p className="text-xs text-slate-600">
                                                    Buffer for business growth, emergencies, and reinvestment.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            {/* SEO Content */}
                            <Card className="border-primary bg-primary/10">
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-3">Why Use a Freelance Hourly Rate Calculator?</h3>
                                    <div className="prose prose-slate text-sm text-slate-700 space-y-3">
                                        <p>
                                            Most freelancers undercharge by 30-50% because they forget critical costs. This calculator accounts for:
                                        </p>
                                        <ul className="space-y-2 ml-4">
                                            <li><strong>Non-billable hours</strong> – Marketing, admin, invoicing typically consume 25% of your time</li>
                                            <li><strong>Self-employment taxes</strong> – An additional 15.3% on top of income tax</li>
                                            <li><strong>Business expenses</strong> – Software, equipment, insurance, office costs</li>
                                            <li><strong>Benefits</strong> – Health insurance, retirement, paid time off you&apos;d get as an employee</li>
                                            <li><strong>Industry standards</strong> – Web developers command higher rates than writers</li>
                                            <li><strong>Experience premiums</strong> – Senior freelancers earn 2-3x more than beginners</li>
                                        </ul>
                                        <p className="font-semibold">
                                            To earn $60,000 take-home, you can&apos;t charge $30/hour. You need $50-75/hour depending on your situation.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT: RESULTS */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Main Rate Card */}
                                <Card className="bg-gradient-to-br from-slate-900 via-primary to-slate-900 text-white border-none shadow-2xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                                    <CardHeader className="relative z-10">
                                        <CardDescription className="text-white">Your Minimum Hourly Rate</CardDescription>
                                        <div className="flex items-baseline gap-2 mt-2">
                                            <span className="text-6xl font-bold text-white">${hourlyRate}</span>
                                            <span className="text-xl text-slate-300">/hr</span>
                                        </div>

                                        {marketComparison === 'below' && (
                                            <div className="flex items-center gap-2 mt-3 text-yellow-300">
                                                <AlertCircle className="h-4 w-4" />
                                                <span className="text-sm">Below market average</span>
                                            </div>
                                        )}
                                        {marketComparison === 'average' && (
                                            <div className="flex items-center gap-2 mt-3 text-green-300">
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span className="text-sm">Competitive market rate</span>
                                            </div>
                                        )}
                                        {marketComparison === 'above' && (
                                            <div className="flex items-center gap-2 mt-3 text-white">
                                                <TrendingUp className="h-4 w-4" />
                                                <span className="text-sm">Premium market rate</span>
                                            </div>
                                        )}
                                    </CardHeader>

                                    <CardContent className="relative z-10">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                <span className="text-white">Monthly Revenue Goal</span>
                                                <span className="text-xl font-bold">${monthlyTarget.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                <span className="text-white">Annual Revenue Target</span>
                                                <span className="text-xl font-bold">${yearlyRevenue.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                <span className="text-white">Day Rate (8 hours)</span>
                                                <span className="text-xl font-bold">${(hourlyRate * 8).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3">
                                                <span className="text-white">40-Hour Project</span>
                                                <span className="text-xl font-bold">${projectRate.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                                            <p className="text-xs text-white leading-relaxed">
                                                <strong>Pro Tip:</strong> This is your minimum sustainable rate. Consider charging 20-30% more for rush jobs, specialized expertise, or clients with bigger budgets.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* CTA Card */}
                                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white">
                                    <CardHeader>
                                        <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center mb-3">
                                            <TrendingUp className="h-6 w-6 text-white" />
                                        </div>
                                        <CardTitle className="text-xl">Ready to Bill Confidently?</CardTitle>
                                        <CardDescription className="text-base">
                                            Create professional invoices that reflect your true value and get paid faster with Sheet2Bill.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Button className="w-full gap-2 font-semibold h-12 text-base bg-primary hover:bg-primary">
                                            Start Invoicing Free
                                            <ArrowRight className="h-5 w-5" />
                                        </Button>
                                        <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span>No credit card required • Cancel anytime</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Stats */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Industry Insights 2025</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Avg. Web Developer</span>
                                            <span className="font-bold">$75-150/hr</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Avg. Designer</span>
                                            <span className="font-bold">$60-120/hr</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Avg. Writer</span>
                                            <span className="font-bold">$50-100/hr</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Avg. Consultant</span>
                                            <span className="font-bold">$100-200/hr</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Additional SEO Content */}
                    <div className="mt-12  mx-auto">
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Use This Freelance Rate Calculator</h2>
                                <div className="prose prose-slate max-w-none space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-900">Step 1: Enter Your Income Goal</h3>
                                    <p className="text-slate-700">
                                        Start with your desired take-home income – what you want to earn after all taxes and expenses. Be realistic but ambitious. Research average salaries for your profession in your region.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900">Step 2: Calculate Business Expenses</h3>
                                    <p className="text-slate-700">
                                        Add up monthly costs like software subscriptions (Adobe, Figma, Slack), internet, phone, coworking space, equipment, insurance, accounting services, and marketing. Most freelancers underestimate this at $200-300 when it&apos;s actually $500-1000.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900">Step 3: Be Honest About Billable Hours</h3>
                                    <p className="text-slate-700">
                                        Only count hours spent on actual client work. Don&apos;t include time spent on proposals, invoicing, social media, learning, or meetings. A full-time freelancer typically bills 25-30 hours per week, not 40.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900">Step 4: Factor in Time Off</h3>
                                    <p className="text-slate-700">
                                        Unlike employees, freelancers don&apos;t get paid vacation. Account for holidays, sick days, and personal time. Most freelancers should budget 4-6 weeks off per year minimum for sustainability.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900">Step 5: Use Advanced Options for Precision</h3>
                                    <p className="text-slate-700">
                                        Switch to the Advanced tab to include tax rates (typically 25-35% for freelancers including self-employment tax), health insurance ($300-600/month), retirement savings, and your profit margin for business growth.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900">Common Freelance Pricing Mistakes</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                                        <li>Forgetting about self-employment tax (15.3% on top of income tax)</li>
                                        <li>Not accounting for unpaid admin time (proposals, invoicing, emails)</li>
                                        <li>Underestimating business expenses and tools</li>
                                        <li>Comparing to employee salaries without adding benefits value</li>
                                        <li>Setting rates based on what you think clients will pay instead of your needs</li>
                                        <li>Not adjusting rates as you gain experience and expertise</li>
                                    </ul>

                                    <h3 className="text-lg font-semibold text-slate-900">When to Charge More Than Your Minimum Rate</h3>
                                    <p className="text-slate-700">
                                        Your calculated rate is the minimum to sustain your business. Charge premium rates for: rush projects (add 25-50%), specialized skills, enterprise clients with bigger budgets, long-term retainers (stable income premium), and when demand for your services is high.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

PremiumRateCalculator.getLayout = function getLayout(page: ReactElement) {
    return page;
};
