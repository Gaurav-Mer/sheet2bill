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
    const hasData = Array.isArray(data) && data.some(d => d.revenue && d.revenue > 0);

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
                {hasData ? <Pie data={chartData} options={options} /> : <div className='flex  gap-3 items-center justify-center h-full flex-col'>
                    <div className='h-20 w-20 p-4 rounded-full bg-secondary'>
                        <svg fill="#000000" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                            width="full" height="full" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xmlSpace="preserve">
                            <g>
                                <path d="M34,31h29c0.553,0,1-0.447,1-1C64,13.432,50.568,0,34,0c-0.553,0-1,0.447-1,1v29C33,30.553,33.447,31,34,31z M35,2.025
		C49.667,2.541,61.459,14.332,61.975,29H35V2.025z"/>
                                <path d="M63,33H36c-0.044,0-0.082,0.019-0.125,0.024c-0.084,0.011-0.168,0.019-0.248,0.05c-0.078,0.031-0.143,0.084-0.209,0.133
		c-0.036,0.027-0.079,0.041-0.112,0.072c-0.002,0.002-0.003,0.006-0.005,0.008c-0.086,0.084-0.152,0.185-0.203,0.295
		c-0.004,0.009-0.014,0.016-0.018,0.025c-0.016,0.038-0.015,0.084-0.026,0.125c-0.023,0.084-0.051,0.169-0.052,0.256L35,34
		c0,0.053,0.022,0.1,0.031,0.152c0.012,0.074,0.016,0.148,0.044,0.219c0.035,0.088,0.092,0.16,0.149,0.233
		c0.021,0.028,0.031,0.063,0.057,0.089l0.01,0.01c0.001,0.002,0.002,0.003,0.004,0.004l18.742,19.409
		c0.074,0.077,0.164,0.126,0.254,0.175l0.922,0.922C60.643,49.784,64,42.284,64,34l0,0C64,33.447,63.553,33,63,33z M55.126,52.365
		L38.356,35h23.618C61.741,41.637,59.2,47.683,55.126,52.365z"/>
                                <path d="M49.827,53.795c0,0-17.231-18.523-18.212-19.504C31.012,33.688,31,32.605,31,32.605V5c0-0.553-0.447-1-1-1
		C13.432,4,0,17.432,0,34s13.432,30,30,30c8.284,0,15.784-3.357,21.213-8.787l-1.335-1.335
		C49.858,53.852,49.851,53.82,49.827,53.795z M30,62C14.536,62,2,49.464,2,34C2,18.871,14,6.553,29,6.025c0,0,0,26.068,0,26.975
		s0.343,1.81,1.016,2.482s18.332,19.658,18.332,19.658C43.434,59.41,37.021,62,30,62z"/>
                            </g>
                        </svg>
                    </div>
                    <p className="text-xs text-center text-black/50 mt-1">Try creating some briefs or recording transactions to see insights here.</p>

                </div>}
            </CardContent>
        </Card>
    );
};
