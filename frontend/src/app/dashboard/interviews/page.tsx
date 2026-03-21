"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
};

export default function InterviewSimulator() {
  const { getToken } = useAuth();
  const [role, setRole] = useState("Frontend Engineer");
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startInterview = async () => {
    setIsStarted(true);
    const initialMsg: Message = { id: Date.now().toString(), sender: 'ai', text: `Hi! I'll be your interviewer today for the ${role} position. To start off, could you briefly introduce yourself and tell me why you're interested in this role?` };
    setMessages([initialMsg]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput("");
    setIsTyping(true);

    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/ai/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role, messageHistory: updatedHistory })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: "Error: Could not reach the interviewer." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: "Error: Connection failed." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-slate-900">AI Interview Simulator</h1>
        <p className="text-slate-500 mt-1">Practice mock interviews tailored to your target role.</p>
      </div>

      {!isStarted ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center animate-in zoom-in-95 duration-300 m-auto max-w-lg w-full">
           <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border-8 border-indigo-50/50">
              🎙️
           </div>
           <h2 className="text-2xl font-bold text-slate-900 mb-2">Configure Your Interview</h2>
           <p className="text-slate-500 mb-8">Our AI will evaluate your answers and ask role-based technical and behavioral questions.</p>
           
           <div className="space-y-4">
              <div className="text-left">
                 <label className="text-sm font-semibold text-slate-700 block mb-2">Target Role</label>
                 <select 
                   value={role} 
                   onChange={e => setRole(e.target.value)}
                   className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                 >
                    <option value="Frontend Engineer">Frontend Engineer</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                 </select>
              </div>
              <button 
                onClick={startInterview}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl shadow-md transition-all mt-4"
              >
                 Start Mock Interview
              </button>
           </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden animate-in fade-in">
           {/* Chat Header */}
           <div className="h-16 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl">🤖</div>
                 <div>
                    <h3 className="font-bold text-slate-900 text-sm">AI Interviewer</h3>
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                       Active Role: {role}
                    </p>
                 </div>
              </div>
              <button onClick={() => setIsStarted(false)} className="text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors">
                 End Interview
              </button>
           </div>
           
           {/* Chat Messages */}
           <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {messages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${msg.sender === 'user' ? 'bg-indigo-600 text-white shadow-md rounded-tr-sm' : 'bg-white border text-slate-800 border-slate-200 shadow-sm rounded-tl-sm'}`}>
                       <p className="leading-relaxed whitespace-pre-wrap text-[15px]">{msg.text}</p>
                    </div>
                 </div>
              ))}
              {isTyping && (
                 <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-sm px-5 py-4 flex gap-1.5">
                       <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></div>
                       <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '150ms'}}></div>
                       <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
           </div>
           
           {/* Chat Input */}
           <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                 <textarea 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         handleSendMessage(e);
                      }
                   }}
                   placeholder="Type your answer... (Press Enter to send)"
                   className="w-full bg-slate-100 rounded-xl pl-4 pr-16 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none h-[52px] overflow-hidden"
                   rows={1}
                 />
                 <button 
                   type="submit" 
                   disabled={!input.trim() || isTyping}
                   className="absolute right-2 top-1.5 bottom-1.5 aspect-square bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg flex items-center justify-center transition-colors"
                 >
                    ↑
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
