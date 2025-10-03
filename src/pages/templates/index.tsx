import React from 'react';

const TemplatesPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Invoice Templates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Placeholder for template gallery */}
        <div className="bg-white p-4 rounded-lg shadow aspect-[8.5/11]">
          <h2 className="text-xl font-bold mb-4">Template 1</h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow aspect-[8.5/11]">
          <h2 className="text-xl font-bold mb-4">Template 2</h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow aspect-[8.5/11]">
          <h2 className="text-xl font-bold mb-4">Template 3</h2>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;