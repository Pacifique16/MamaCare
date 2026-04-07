import React from 'react';
import { Send } from 'lucide-react';

const ContactForm = () => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-card border border-gray-50 h-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="form-label">Name</label>
            <input 
              type="text" 
              placeholder="Your name" 
              className="input-field bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20"
            />
          </div>
          <div className="space-y-2">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              className="input-field bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="form-label">Subject</label>
          <input 
            type="text" 
            placeholder="How can we help?" 
            className="input-field bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20"
          />
        </div>

        <div className="space-y-2">
          <label className="form-label">Message</label>
          <textarea 
            rows="5"
            placeholder="Tell us more about your inquiry..." 
            className="input-field bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20 resize-none"
          ></textarea>
        </div>

        <button type="submit" className="w-full btn-primary py-4 text-lg group">
          Send Message
          <Send size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
