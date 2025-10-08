import React from 'react';

export const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="200" height="200" className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="gradientSheet" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4CAF50" />
                    <stop offset="100%" stop-color="#66BB6A" />
                </linearGradient>
                <linearGradient id="gradientBill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#2196F3" />
                    <stop offset="100%" stop-color="#42A5F5" />
                </linearGradient>
            </defs>

            <rect x="40" y="50" width="60" height="100" rx="8" ry="8" fill="url(#gradientSheet)" />
            <rect x="48" y="60" width="44" height="10" fill="#E8F5E9" />
            <rect x="48" y="75" width="44" height="10" fill="#E8F5E9" />
            <rect x="48" y="90" width="44" height="10" fill="#E8F5E9" />

            <path d="M 95 95 L 115 100 L 95 105 Z" fill="#607D8B" />
            <rect x="90" y="98" width="20" height="4" rx="1" ry="1" fill="#607D8B" />

            <rect x="100" y="50" width="60" height="100" rx="8" ry="8" fill="url(#gradientBill)" />
            <rect x="110" y="65" width="40" height="8" fill="#E3F2FD" />
            <rect x="110" y="80" width="30" height="8" fill="#E3F2FD" />
            <rect x="110" y="95" width="45" height="8" fill="#E3F2FD" />
            <rect x="110" y="110" width="25" height="8" fill="#E3F2FD" />

            <text x="40" y="175" font-family="Inter, sans-serif" font-size="20" font-weight="bold" fill="#4CAF50">Sheet</text>
            <text x="120" y="175" font-family="Inter, sans-serif" font-size="20" font-weight="bold" fill="#2196F3">Bill</text>
        </svg>
    );
};