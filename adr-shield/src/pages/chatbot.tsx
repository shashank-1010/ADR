import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Send, User, Bot, AlertCircle } from "lucide-react";

type Message = { id: string; role: "user" | "assistant"; content: string; isDisclaimer?: boolean; };

const MOCK_RESPONSES: Record<string, string> = {
  "interaction": "When checking drug interactions, consider the patient's liver and kidney function, as these can significantly affect drug metabolism.",
  "side effect": "Common side effects include nausea, headache, and fatigue. Serious side effects should be reported immediately.",
  "dosage": "Dosage should be adjusted based on renal function, age, and concomitant medications. Always follow prescribing guidelines.",
};

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ id: "welcome", role: "assistant", content: "Hello. I am the ADR Shield Clinical Assistant. I can help answer questions about drug safety, interactions, and pharmacovigilance. How can I assist you today?" }]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      let reply = "Thank you for your question. Based on clinical guidelines, I recommend consulting the drug's prescribing information and considering patient-specific factors.";
      for (const [key, value] of Object.entries(MOCK_RESPONSES)) { if (userMsg.content.toLowerCase().includes(key)) { reply = value; break; } }
      setMessages(prev => [...prev, { id: Date.now().toString() + "-resp", role: "assistant", content: reply }, { id: Date.now().toString() + "-disc", role: "assistant", content: "This information is for educational purposes only and does not constitute medical advice.", isDisclaimer: true }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col p-6 bg-gray-50 max-w-4xl mx-auto w-full">
      <div className="mb-4"><h1 className="text-3xl font-bold tracking-tight text-gray-900">Clinical AI Assistant</h1><p className="text-gray-500 mt-1">Intelligent query system for pharmacological safety information.</p></div>
      <Card className="flex-1 flex flex-col shadow-sm overflow-hidden border-gray-200"><CardHeader className="bg-gray-50 border-b py-3"><CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-700"><Shield className="h-4 w-4 text-blue-600" />Secure Session</CardTitle></CardHeader><CardContent className="flex-1 overflow-hidden p-0 relative"><div ref={scrollRef} className="absolute inset-0 overflow-y-auto p-4 space-y-6">{messages.map((msg) => (<div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}><div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 ${msg.role === "user" ? "bg-blue-600 text-white" : msg.isDisclaimer ? "bg-amber-100 text-amber-600" : "bg-gray-200 text-gray-700"}`}>{msg.role === "user" ? <User className="h-4 w-4" /> : msg.isDisclaimer ? <AlertCircle className="h-4 w-4" /> : <Bot className="h-4 w-4" />}</div><div className={`rounded-lg px-4 py-3 text-sm ${msg.role === "user" ? "bg-blue-600 text-white" : msg.isDisclaimer ? "bg-amber-50 text-amber-800 border border-amber-200 font-medium text-xs" : "bg-gray-100 text-gray-800"}`}>{msg.content}</div></div>))}{loading && (<div className="flex gap-3 max-w-[80%]"><div className="shrink-0 h-8 w-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center mt-1"><Bot className="h-4 w-4" /></div><div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 text-sm flex items-center gap-1"><span className="animate-bounce">.</span><span className="animate-bounce" style={{ animationDelay: "75ms" }}>.</span><span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span></div></div>)}</div></CardContent><CardFooter className="p-4 bg-white border-t"><form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2"><Input placeholder="Type your medical query here..." value={input} onChange={(e) => setInput(e.target.value)} disabled={loading} className="flex-1 bg-gray-50" /><Button type="submit" disabled={!input.trim() || loading} className="shrink-0"><Send className="h-4 w-4" /></Button></form></CardFooter></Card>
      <div className="text-center mt-2"><span className="text-xs text-gray-400">AI responses are advisory only. Not a substitute for clinical judgment.</span></div>
    </div>
  );
}