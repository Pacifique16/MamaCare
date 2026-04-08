import React, { useState } from 'react';
import DoctorLayout from '../../components/layout/DoctorLayout';
import { 
  Search, 
  Send,
  MoreVertical,
  Paperclip,
  Image as ImageIcon,
  Phone,
  Video,
  CheckCheck
} from 'lucide-react';

const Messaging = () => {
    const [activeChat, setActiveChat] = useState(0);

    const chats = [
        { id: 0, name: 'Aline Silva', lastMessage: 'Okay, I will monitor it and let you know.', time: '10:48 AM', unread: 0, online: true, risk: 'HIGH RISK' },
        { id: 1, name: 'Elena Wright', lastMessage: 'Thank you for the ultrasound results!', time: 'Yesterday', unread: 2, online: false, risk: 'LOW RISK' },
        { id: 2, name: 'Maya Lopez', lastMessage: 'Should I continue taking the supplements?', time: 'Tuesday', unread: 0, online: true, risk: 'HIGH RISK' },
        { id: 3, name: 'Sarah Parker', lastMessage: 'My next appointment is confirmed.', time: 'Oct 12', unread: 0, online: false, risk: 'MEDIUM RISK' },
    ];

    return (
        <DoctorLayout title="Secure Messaging" subtitle="Communicate with your patients securely.">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden flex h-[600px]">
                
                {/* Chat List Sidebar */}
                <div className="w-[350px] border-r border-gray-100 flex flex-col bg-gray-50/50">
                    <div className="p-6 border-b border-gray-100">
                        <div className="relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search messages..." 
                                className="w-full h-12 bg-white border border-gray-200 rounded-2xl pl-12 pr-4 text-sm font-medium focus:border-[#005C5C] focus:ring-2 focus:ring-teal-500/10 focus:outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {chats.map((chat, idx) => (
                            <div 
                                key={chat.id} 
                                onClick={() => setActiveChat(idx)}
                                className={`p-6 border-b border-gray-50 cursor-pointer transition-all hover:bg-white flex items-start gap-4 ${activeChat === idx ? 'bg-white border-l-4 border-l-[#005C5C]' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-teal-100 text-[#005C5C] flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                                        {chat.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-900 truncate pr-2">{chat.name}</h4>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{chat.time}</span>
                                    </div>
                                    <p className={`text-sm truncate ${chat.unread > 0 ? 'font-bold text-gray-900' : 'text-gray-500 font-medium'}`}>
                                        {chat.lastMessage}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${chat.risk.includes('HIGH') ? 'bg-red-50 text-red-600' : chat.risk.includes('MEDIUM') ? 'bg-orange-50 text-orange-600' : 'bg-teal-50 text-teal-600'}`}>
                                            {chat.risk}
                                        </span>
                                    </div>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="w-5 h-5 bg-[#005C5C] rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm mt-1">
                                        {chat.unread}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Chat Header */}
                    <div className="h-20 border-b border-gray-100 px-8 flex justify-between items-center bg-white shadow-sm z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-teal-100 text-[#005C5C] flex items-center justify-center font-bold">
                                {chats[activeChat].name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-tight">{chats[activeChat].name}</h3>
                                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest pb-0.5">Online</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors hover:text-[#005C5C]"><Phone size={18} /></button>
                            <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors hover:text-[#005C5C]"><Video size={18} /></button>
                            <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors hover:text-gray-900"><MoreVertical size={18} /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
                        <div className="text-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-4 py-1.5 rounded-full">Today</span>
                        </div>
                        
                        {/* Patient Message */}
                        <div className="flex items-end gap-3 max-w-2xl">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-[#005C5C] flex items-center justify-center font-bold text-xs shrink-0">
                                {chats[activeChat].name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-5 shadow-sm">
                                <p className="text-sm font-medium text-gray-800 leading-relaxed">Hello Dr. Sarah, I'm feeling very dizzy and my vision is spotting. My blood pressure reading was 140/90 just now.</p>
                                <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-widest">10:42 AM</p>
                            </div>
                        </div>

                        {/* Doctor Message */}
                        <div className="flex items-end gap-3 justify-end max-w-2xl ml-auto">
                            <div className="bg-[#E0F2F1] rounded-2xl rounded-br-none p-5 shadow-none border border-teal-100">
                                <p className="text-sm font-bold text-[#004D4D] leading-relaxed">Aline, please remain seated. I have received your triage alert. Are you alone? Please have someone ready to drive you.</p>
                                <div className="flex items-center justify-end gap-1 mt-2">
                                    <p className="text-[9px] font-bold text-teal-600/60 uppercase tracking-widest">10:45 AM</p>
                                    <CheckCheck size={12} className="text-[#005C5C]" />
                                </div>
                            </div>
                        </div>

                        {/* Patient Message */}
                        <div className="flex items-end gap-3 max-w-2xl">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-[#005C5C] flex items-center justify-center font-bold text-xs shrink-0">
                                {chats[activeChat].name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-5 shadow-sm">
                                <p className="text-sm font-medium text-gray-800 leading-relaxed">My husband is here with me. We are getting ready to leave.</p>
                                <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-widest">10:48 AM</p>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-white border-t border-gray-100">
                        <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-full p-2 pr-2 hover:bg-white hover:border-[#005C5C] transition-all focus-within:bg-white focus-within:border-[#005C5C] focus-within:ring-4 focus-within:ring-teal-500/10">
                            <button className="p-2.5 text-gray-400 hover:text-[#005C5C] transition-colors rounded-full hover:bg-teal-50">
                                <Paperclip size={20} />
                            </button>
                            <button className="p-2.5 text-gray-400 hover:text-[#005C5C] transition-colors rounded-full hover:bg-teal-50">
                                <ImageIcon size={20} />
                            </button>
                            <input 
                                type="text"
                                placeholder="Type a secure message..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-900 px-2"
                            />
                            <button className="w-12 h-12 bg-[#005C5C] text-white rounded-full flex items-center justify-center hover:bg-teal-800 transition-all shadow-lg shadow-teal-900/20 active:scale-95">
                                <Send size={18} className="translate-x-0.5 -translate-y-0.5" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </DoctorLayout>
    );
};

export default Messaging;
