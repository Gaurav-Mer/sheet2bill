/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// We must register the components we're using
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const RevenueChart = ({ data }: { data: any[] }) => {
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
            <CardContent className="h-[350px]">
                <Bar options={options} data={chartData} />
            </CardContent>
        </Card>
    );
};