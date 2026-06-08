import React, { useState, useRef, useEffect } from "react";
import { useSendChatMessage, type ChatQueryInputConversationHistoryItem } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Send, User, Bot, AlertCircle } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isDisclaimer?: boolean;
};

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello. I am the ADR Shield Clinical Assistant. I can help answer questions about drug safety, interactions, and general pharmacovigilance. How can I assist you today?"
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendMessage = useSendChatMessage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const history: ChatQueryInputConversationHistoryItem[] = messages
      .filter(m => !m.isDisclaimer)
      .map(m => ({ role: m.role, content: m.content }));

    sendMessage.mutate({
      data: { message: userMessage.content, conversationHistory: history }
    }, {
      onSuccess: (response) => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString() + "-resp",
            role: "assistant",
            content: response.message
          }
        ]);

        if (response.disclaimer) {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString() + "-disc",
              role: "assistant",
              content: response.disclaimer!,
              isDisclaimer: true
            }
          ]);
        }
      },
      onError: () => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString() + "-err",
            role: "assistant",
            content: "Sorry, I could not connect to the server. Please make sure the API server is running on port 3001."
          }
        ]);
      }
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500 max-w-4xl mx-auto w-full">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clinical AI Assistant</h1>
        <p className="text-slate-500 mt-1">Intelligent query system for pharmacological safety information.</p>
      </div>

      <Card className="flex-1 flex flex-col shadow-sm overflow-hidden border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Shield className="h-4 w-4 text-primary" />
            Secure Session
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0 relative">
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-y-auto p-4 space-y-6"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1
                  ${msg.role === "user" ? "bg-primary text-primary-foreground" :
                    msg.isDisclaimer ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-700"}`}
                >
                  {msg.role === "user" ? <User className="h-4 w-4" /> :
                   msg.isDisclaimer ? <AlertCircle className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`rounded-lg px-4 py-3 text-sm
                  ${msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : msg.isDisclaimer
                      ? "bg-amber-50 text-amber-800 border border-amber-200 font-medium text-xs"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {sendMessage.isPending && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="shrink-0 h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center mt-1">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-slate-100 text-slate-800 rounded-lg px-4 py-3 text-sm flex items-center gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce" style={{animationDelay: "75ms"}}>.</span>
                  <span className="animate-bounce" style={{animationDelay: "150ms"}}>.</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex w-full gap-2"
          >
            <Input
              placeholder="Type your medical query here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sendMessage.isPending}
              className="flex-1 bg-slate-50 focus-visible:ring-primary"
            />
            <Button type="submit" disabled={!input.trim() || sendMessage.isPending} className="shrink-0">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
      <div className="text-center mt-2">
        <span className="text-xs text-slate-400">AI responses are advisory only. Not a substitute for clinical judgment.</span>
      </div>
    </div>
  );
}
