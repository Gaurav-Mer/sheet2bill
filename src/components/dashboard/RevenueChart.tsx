/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// We must register the components we're using
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const RevenueChart = ({ data }: { data: any[] }) => {
    const hasData = Array.isArray(data) && data.some(d => d.revenue && d.revenue > 0);

    const labels = data.length === 1
        ? ['', new Date(data[0].month).toLocaleString('default', { month: 'short' }), '']
        : data.map(d => new Date(d.month).toLocaleString('default', { month: 'short' }));

    // Format the data for Chart.js
    // const labels = data.map(d => new Date(d.month).toLocaleString('default', { month: 'short' }));
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Revenue',
                data: data.map(d => d.revenue ?? 0),
                borderRadius: 4,
                maxBarThickness: 40, // ✅ Prevent wide bars
                barThickness: data.length === 1 ? 40 : undefined, // for 1 bar case
                backgroundColor: "#61ac0c", // ✅ your custom color (Tailwind's blue-500)


            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true },
        },
        scales: {
            y: { beginAtZero: true },
            x: {
                grid: { display: false },
                // ✅ add offset for single or few data points
                offset: data.length <= 2,
            },
        },
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] relative">

                {hasData ? <Bar options={options} data={chartData} /> : <>

                    <div className='flex items-center justify-center gap-3 h-full flex-col'>
                        <div className='h-20 w-20 p-2 rounded-full bg-primary/10'>
                            <svg width="full" height="full" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.11413 8.35688C4.75894 8.56999 4.64377 9.03069 4.85688 9.38587C5.06999 9.74106 5.53069 9.85623 5.88587 9.64312L5.11413 8.35688ZM10.5 6L10.95 5.4C10.7061 5.21704 10.3756 5.19999 10.1141 5.35688L10.5 6ZM14.5 9L14.05 9.6C14.3236 9.80522 14.7014 9.79932 14.9685 9.58565L14.5 9ZM19.9685 5.58565C20.292 5.32689 20.3444 4.85493 20.0857 4.53148C19.8269 4.20803 19.3549 4.15559 19.0315 4.41435L19.9685 5.58565ZM17.75 19C17.75 19.4142 18.0858 19.75 18.5 19.75C18.9142 19.75 19.25 19.4142 19.25 19H17.75ZM19.25 11C19.25 10.5858 18.9142 10.25 18.5 10.25C18.0858 10.25 17.75 10.5858 17.75 11H19.25ZM9.75 19C9.75 19.4142 10.0858 19.75 10.5 19.75C10.9142 19.75 11.25 19.4142 11.25 19H9.75ZM11.25 11C11.25 10.5858 10.9142 10.25 10.5 10.25C10.0858 10.25 9.75 10.5858 9.75 11H11.25ZM13.75 19C13.75 19.4142 14.0858 19.75 14.5 19.75C14.9142 19.75 15.25 19.4142 15.25 19H13.75ZM15.25 14C15.25 13.5858 14.9142 13.25 14.5 13.25C14.0858 13.25 13.75 13.5858 13.75 14H15.25ZM5.75 19C5.75 19.4142 6.08579 19.75 6.5 19.75C6.91421 19.75 7.25 19.4142 7.25 19H5.75ZM7.25 14C7.25 13.5858 6.91421 13.25 6.5 13.25C6.08579 13.25 5.75 13.5858 5.75 14H7.25ZM5.88587 9.64312L10.8859 6.64312L10.1141 5.35688L5.11413 8.35688L5.88587 9.64312ZM10.05 6.6L14.05 9.6L14.95 8.4L10.95 5.4L10.05 6.6ZM14.9685 9.58565L19.9685 5.58565L19.0315 4.41435L14.0315 8.41435L14.9685 9.58565ZM19.25 19V11H17.75V19H19.25ZM11.25 19V11H9.75V19H11.25ZM15.25 19V14H13.75V19H15.25ZM7.25 19V14H5.75V19H7.25Z" fill="#61ac0c" />
                            </svg>
                        </div>
                        <p className="text-xs text-center text-black/50 mt-1">Try creating some briefs or recording transactions to see insights here.</p>

                    </div>
                </>}
            </CardContent>
        </Card>
    );
};