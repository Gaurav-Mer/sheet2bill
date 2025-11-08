/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Register required components for Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

export const RevenuePieChart = ({ data }: { data: any[] }) => {
    // Labels — month names
    const labels = data.map(d =>
        new Date(d.month).toLocaleString('default', { month: 'short' })
    );

    // Colors — use Tailwind palette or your brand colors
    const colors = [
        '#61ac0c', // green
        '#3B82F6', // blue
        '#F59E0B', // amber
        '#EF4444', // red
        '#8B5CF6', // violet
        '#06B6D4', // cyan
    ];

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Revenue Distribution',
                data: data.map(d => d.revenue ?? 0),
                backgroundColor: colors.slice(0, data.length),
                borderWidth: 2,
                borderColor: '#fff',
                hoverOffset: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true,
                },
            },
        },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
                <Pie data={chartData} options={options} />
            </CardContent>
        </Card>
    );
};
