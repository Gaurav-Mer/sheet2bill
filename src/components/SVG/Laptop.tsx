import Image from 'next/image';
import React from 'react';

const Laptop = () => {
    return (
        <div className="relative w-[400px] h-[250px] flex justify-center items-center">

            {/* Background shadow layer */}
            <div className="absolute w-[520px] h-[280px] bg-gradient-to-br from-gray-300 via-gray-200 to-white rounded-2xl shadow-2xl -z-10 transform rotate-[-2deg]" />

            {/* Laptop body */}
            <div className="relative bg-white h-[220px] w-[340px] rounded-2xl border-4 border-gray-100 shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-100 to-white opacity-80 z-0" />
                <Image
                    src="/landing.png"
                    alt="Laptop Screen"
                    fill
                    className="object-cover z-10"
                    fetchPriority='high'
                />
            </div>

            {/* Layered perspective frame */}
            <div className="absolute w-[360px] h-[240px] bg-white rounded-2xl border-4 border-gray-50 shadow-2xl -translate-x-1/2 -translate-y-1/2 transform rotate-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-60 rounded-2xl" />
            </div>
        </div>
    );
};

export default Laptop;
