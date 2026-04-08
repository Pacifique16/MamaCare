import React, { useState } from 'react';

const trimesters = [
  { id: 'First',  label: '1st', range: 'Weeks 1-12' },
  { id: 'Second', label: '2nd', range: 'Weeks 13-26' },
  { id: 'Third',  label: '3rd', range: 'Weeks 27-40' },
];

const TrimesterSelector = ({ defaultValue = 'Second', onChange }) => {
  const [selected, setSelected] = useState(defaultValue);

  const handleSelect = (id) => {
    setSelected(id);
    onChange?.(id);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {trimesters.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => handleSelect(t.id)}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
            selected === t.id
              ? 'border-mamacare-teal bg-mamacare-teal/5 text-mamacare-teal'
              : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
          }`}
        >
          <span className="text-xl font-bold">{t.label}</span>
          <span className="text-[10px] font-medium uppercase tracking-tight opacity-70">{t.range}</span>
        </button>
      ))}
    </div>
  );
};

export default TrimesterSelector;
