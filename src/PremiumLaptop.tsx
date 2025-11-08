/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PremiumLaptopCSS.js
import React from 'react';
import Image from 'next/image';

const PremiumLaptop = ({ imgSrc, imgAlt }: any) => {
    return (
        // The outer div provides the 3D space and acts as the hover "group"
        <div className="group" style={{ perspective: '2000px' }}>
            <div
                // These classes handle the smooth transition for all transformations
                className="relative w-[300px] h-[190px] md:w-[450px] md:h-[280px] cursor-pointer 
                   transition-all duration-500 ease-out"
                // This style is essential for enabling 3D transforms on child elements
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Laptop Screen & Body */}
                <div
                    // The main body that tilts on hover
                    className="w-full h-full rounded-xl border-8 border-slate-900 shadow-xl 
                     bg-slate-800 transition-all duration-500 ease-out
                     group-hover:scale-105 group-hover:shadow-2xl 
                     group-hover:[transform:rotateX(10deg)_rotateY(-10deg)]"
                >
                    {/* Camera Dot */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rounded-full z-10"></div>

                    {/* The Image Screen */}
                    <div className="w-full h-full bg-black rounded-md overflow-hidden">
                        <Image
                            src={imgSrc}
                            alt={imgAlt}
                            layout="fill"
                            objectFit="cover"
                            className="opacity-90"
                            fetchPriority='high'
                        />
                    </div>
                </div>

                {/* Laptop Base (Keyboard area) */}
                <div
                    className="absolute top-full left-[5%] w-[90%] h-4 bg-slate-700 rounded-b-lg origin-top 
                     transition-all duration-500 ease-out group-hover:scale-105
                     group-hover:[transform:rotateX(-70deg)_translateY(2px)]" // Adjusts on hover too
                    style={{
                        transform: 'rotateX(-70deg)',
                        background: 'linear-gradient(to bottom, #334155, #1e293b)',
                    }}
                >
                    {/* Trackpad illusion */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/4 h-1/3 bg-slate-600 rounded-sm"></div>
                </div>
            </div>
        </div>
    );
};

export default PremiumLaptop;