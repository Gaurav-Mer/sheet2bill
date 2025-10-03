import React from 'react';
import { Eye, Edit } from 'lucide-react';

const TemplateCard = ({ name }: { name: string }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 group transition-shadow hover:shadow-md">
      <div className="aspect-[8.5/11] bg-gray-100 rounded-t-xl flex items-center justify-center">
        <p className="text-gray-400">Invoice Preview</p>
      </div>
      <div className="p-4 flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">{name}</h3>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 rounded-full hover:bg-gray-200">
            <Eye className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200">
            <Edit className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TemplatesPage = () => {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Templates</h1>
        <p className="text-gray-500 mt-1">Customize your invoice templates.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TemplateCard name="Modern" />
        <TemplateCard name="Classic" />
        <TemplateCard name="Minimalist" />
      </div>
    </div>
  );
};

export default TemplatesPage;