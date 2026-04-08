import React from 'react';
import { Plus } from 'lucide-react';

const FAQCard = ({ icon: Icon, question, answer }) => {
  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-50 flex flex-col gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 bg-mamacare-teal/10 rounded-xl flex items-center justify-center text-mamacare-teal group-hover:bg-mamacare-teal group-hover:text-white transition-all duration-300">
          <Icon size={24} />
        </div>
        <button className="text-mamacare-teal">
          <Plus size={20} />
        </button>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900">{question}</h3>
        <p className="text-gray-500 font-medium leading-relaxed text-sm">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default FAQCard;
