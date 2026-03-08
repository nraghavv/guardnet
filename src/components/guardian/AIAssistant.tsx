"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Send, Mic, X, Sparkles, MapPin, AlertTriangle, 
  Users, Truck, Radio, Activity, ChevronDown, Loader2
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const INITIAL_SUGGESTIONS = [
  "Show me high-risk zones in Wayanad",
  "How many drone pilots are available?",
  "Activate emergency protocol",
  "Check soil saturation levels"
];

const AI_RESPONSES: Record<string, { content: string; suggestions?: string[] }> = {
  "default": {
    content: "I'm GuardianNet AI, your emergency response coordinator. I can help you with asset discovery, risk assessment, and emergency protocols for the Western Ghats region. How can I assist you today?",
    suggestions: ["Show risk assessment", "List available assets", "Emergency protocols"]
  },
  "high-risk": {
    content: "🔴 **Critical Risk Zones in Wayanad District:**\n\n1. **Meppadi Sector** - Risk Level: CRITICAL\n   - Soil saturation: 94%\n   - Elevation: 1,200m\n   - 24hr Rainfall: 187mm\n\n2. **Chooralmala** - Risk Level: HIGH\n   - Soil saturation: 78%\n   - Elevation: 980m\n\n3. **Mundakkai** - Risk Level: MODERATE\n   - Soil saturation: 65%\n   - Elevation: 850m\n\n⚠️ Recommendation: Pre-position assets in Meppadi sector.",
    suggestions: ["Deploy assets to Meppadi", "View terrain map", "Alert local responders"]
  },
  "drone": {
    content: "📡 **Available Drone Pilots in Region:**\n\n✅ **Arun K.** - DJI Mavic 3 Pro\n   - Status: STANDBY | ETA: Immediate\n   - Specialization: Aerial surveillance, thermal imaging\n\n✅ **Suresh M.** - DJI Mini 4 Pro\n   - Status: AVAILABLE | ETA: 12 min\n   - Specialization: Search patterns\n\n✅ **Kerala Drone Collective** (3 units)\n   - Status: ON-CALL | ETA: 25 min\n   - Specialization: Multi-drone coordination\n\nTotal Coverage Capacity: 15km² per hour",
    suggestions: ["Deploy all drones", "Request thermal survey", "View flight zones"]
  },
  "emergency": {
    content: "🚨 **EMERGENCY PROTOCOL ACTIVATION**\n\n**Phase 1 - Immediate (0-30 min):**\n- Activate mesh network mode\n- Alert all verified responders in 5km radius\n- Deploy drone reconnaissance\n\n**Phase 2 - Response (30-60 min):**\n- Establish triage points\n- Route heavy machinery\n- Open Ham radio channels\n\n**Phase 3 - Coordination (1-2 hrs):**\n- KSDMA notification\n- Relief camp activation\n- Medical evacuation routes\n\n⚡ Say **\"CONFIRM\"** to initiate protocol.",
    suggestions: ["CONFIRM", "Modify protocol", "View responder list"]
  },
  "soil": {
    content: "🌧️ **Real-time Soil Saturation Analysis:**\n\n**Meppadi Sector:**\n```\n████████████████████░░░░ 94%\n```\n🔴 CRITICAL - Landslide imminent\n\n**Chooralmala:**\n```\n███████████████░░░░░░░░░ 78%\n```\n🟠 HIGH - Monitor closely\n\n**Mundakkai:**\n```\n████████████░░░░░░░░░░░░ 65%\n```\n🟡 MODERATE - Stable\n\n📊 Data source: ISRO soil sensors + local rain gauges\n⏱️ Last updated: 2 minutes ago",
    suggestions: ["Historical trends", "Predict next 6 hours", "Alert thresholds"]
  },
  "confirm": {
    content: "✅ **PROTOCOL ACTIVATED**\n\n🔄 Initiating emergency response sequence...\n\n**Actions Triggered:**\n1. ✅ Mesh network activated\n2. ✅ 6 responders alerted\n3. ✅ Drone pilot en route\n4. ✅ Ham radio channel VU2KER active\n5. ⏳ KSDMA notification pending\n6. ⏳ Heavy machinery dispatched\n\n📡 Real-time tracking enabled on map.\n\n**Next Update:** 30 seconds",
    suggestions: ["View live map", "Contact responders", "Cancel protocol"]
  }
};

function getAIResponse(input: string): { content: string; suggestions?: string[] } {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes("risk") || lowerInput.includes("zone") || lowerInput.includes("high")) {
    return AI_RESPONSES["high-risk"];
  }
  if (lowerInput.includes("drone") || lowerInput.includes("pilot") || lowerInput.includes("aerial")) {
    return AI_RESPONSES["drone"];
  }
  if (lowerInput.includes("emergency") || lowerInput.includes("protocol") || lowerInput.includes("activate")) {
    return AI_RESPONSES["emergency"];
  }
  if (lowerInput.includes("soil") || lowerInput.includes("saturation") || lowerInput.includes("rain")) {
    return AI_RESPONSES["soil"];
  }
  if (lowerInput.includes("confirm")) {
    return AI_RESPONSES["confirm"];
  }
  
  return AI_RESPONSES["default"];
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: "Welcome to GuardianNet AI. I'm here to assist with emergency coordination, asset discovery, and risk assessment for the Western Ghats region. How can I help you today?",
          timestamp: new Date(),
          suggestions: INITIAL_SUGGESTIONS
        }]);
        setIsTyping(false);
      }, 800);
    }
  }, [isOpen, messages.length]);

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(messageText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      setMessages(prev => [...prev, aiMessage]);
      setSuggestions(response.suggestions || []);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('```')) return null;
      if (line.match(/^[█░]+$/)) {
        return (
          <div key={i} className="font-mono text-xs bg-white/5 px-2 py-1 rounded my-1">
            {line}
          </div>
        );
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-white my-1">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/);
        return (
          <p key={i} className="my-1">
            {parts.map((part, j) => 
              part.startsWith('**') && part.endsWith('**') 
                ? <strong key={j} className="text-white">{part.replace(/\*\*/g, '')}</strong>
                : part
            )}
          </p>
        );
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="my-1">{line}</p>;
    });
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Bot className="w-6 h-6" />
        <motion.div 
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <span className="absolute bottom-full mb-2 right-0 px-3 py-1.5 rounded-lg bg-black/90 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          GuardianNet AI Assistant
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)] rounded-3xl overflow-hidden border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-primary/20 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/20">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      GuardianNet AI
                      <Sparkles className="w-3 h-3 text-accent" />
                    </h3>
                    <p className="text-[10px] text-foreground/40 uppercase tracking-widest">Emergency Coordinator</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] ${
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm" 
                      : "bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm"
                  } p-4`}>
                    <div className="text-sm leading-relaxed text-foreground/80">
                      {formatMessage(message.content)}
                    </div>
                    {message.suggestions && message.role === "assistant" && (
                      <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(suggestion)}
                            className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-foreground/40"
                >
                  <div className="p-2 rounded-xl bg-white/5">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex gap-1">
                    <motion.span 
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                    <motion.span 
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                    <motion.span 
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length > 0 && suggestions.length > 0 && !isTyping && (
              <div className="px-4 pb-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {suggestions.slice(0, 3).map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(suggestion)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-white/10 bg-black/20">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about assets, risks, or protocols..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-foreground/30 transition-all"
                  />
                </div>
                <button
                  type="button"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <Mic className="w-5 h-5 text-foreground/60" />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
