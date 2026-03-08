"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Truck, Radio, HeartPulse, UserCheck, ShieldCheck, 
  Drill as Drone, ChevronRight, MapPin, Clock, CheckCircle2,
  Sparkles, Zap
} from "lucide-react";

const ASSETS = [
  {
    icon: Truck,
    title: "Heavy Machinery",
    description: "Verified registry of JCBs, earthmovers, and cranes for debris clearance.",
    count: 42,
    unit: "Units",
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    details: ["8 JCB Excavators", "12 Earthmovers", "6 Cranes", "16 Tractors"]
  },
  {
    icon: Drone,
    title: "Drone Fleet",
    description: "Private pilots for aerial surveillance when ground access is impossible.",
    count: 18,
    unit: "Pilots",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    details: ["DJI Mavic 3 Pro x 6", "Thermal Imaging x 4", "Night Vision x 3", "Multi-rotor x 5"]
  },
  {
    icon: Radio,
    title: "Ham Operators",
    description: "Alternative communication nodes for when cell towers fail.",
    count: 24,
    unit: "Nodes",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    details: ["VHF Stations x 10", "UHF Stations x 8", "HF Long-range x 6"]
  },
  {
    icon: HeartPulse,
    title: "Medical Teams",
    description: "Trauma surgeons and orthopedic specialists tagged for crush injuries.",
    count: 12,
    unit: "Specialists",
    color: "from-red-500 to-rose-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    details: ["Trauma Surgeons x 4", "Orthopedics x 3", "Emergency Nurses x 5"]
  },
];

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = (duration * 1000) / end;
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count}</span>;
}

export function AssetGrid() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section id="technology" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 topographic-bg opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[200px]" />
      
      <div className="container px-4 mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Asset-Backed Resilience Engine</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Map What Matters
            </span>
          </h2>
          <p className="text-foreground/50 max-w-2xl mx-auto text-lg">
            Instead of generic volunteers, we map high-impact assets and specialized skills 
            critical for the <span className="text-primary font-medium">first 48 hours</span> of a landslide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {ASSETS.map((asset, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setExpandedCard(expandedCard === index ? null : index)}
              className={`relative p-8 rounded-3xl cursor-pointer transition-all duration-500 ${
                expandedCard === index 
                  ? "glass-card border-primary/40 shadow-2xl shadow-primary/10" 
                  : "glass-card hover:border-white/20"
              }`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${asset.color.split(' ')[0].replace('from-', '')}40, transparent)` }}
              />
              
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-2xl ${asset.bgColor} border ${asset.borderColor} transition-transform duration-300 ${hoveredCard === index ? "scale-110" : ""}`}>
                  <asset.icon className={`w-8 h-8 bg-gradient-to-br ${asset.color} bg-clip-text text-transparent`} style={{ color: asset.color.includes('orange') ? '#f97316' : asset.color.includes('blue') ? '#3b82f6' : asset.color.includes('purple') ? '#a855f7' : '#ef4444' }} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold">{asset.title}</h3>
                    <motion.div
                      animate={{ rotate: expandedCard === index ? 90 : 0 }}
                      className="p-1 rounded-lg bg-white/5"
                    >
                      <ChevronRight className="w-5 h-5 text-foreground/40" />
                    </motion.div>
                  </div>
                  
                  <p className="text-sm text-foreground/50 mb-6 leading-relaxed">
                    {asset.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-4xl font-bold bg-gradient-to-r ${asset.color} bg-clip-text text-transparent`}>
                        <AnimatedCounter value={asset.count} />
                      </span>
                      <span className="text-sm text-foreground/40 uppercase tracking-widest">{asset.unit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <AnimatePresence>
                {expandedCard === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-white/10"
                  >
                    <p className="text-xs uppercase tracking-widest text-foreground/40 mb-4">Asset Breakdown</p>
                    <div className="grid grid-cols-2 gap-3">
                      {asset.details.map((detail, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-2 p-3 rounded-xl bg-white/5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-sm">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-8 md:p-12 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-primary/20" />
          <div className="absolute inset-0 glass-card" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/30">
                  <UserCheck className="w-12 h-12 text-accent" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl md:text-3xl font-bold mb-3">Community Verification</h4>
              <p className="text-foreground/60 text-lg max-w-xl">
                Partnered with <span className="text-accent font-medium">Kudumbashree networks</span> to verify skills and assets at the grassroots level. Every node in GuardianNet is trust-vetted.
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-bold text-lg flex items-center gap-2 shadow-xl shadow-accent/20"
            >
              <Zap className="w-5 h-5" />
              Join Network
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
