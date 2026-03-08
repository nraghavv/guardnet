
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, MapPin, Radio, Battery, AlertTriangle, Navigation, CheckCircle2, Info, Activity, X, LogOut } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export const VolunteerView = ({ onClose, t, language }) => {
  const [status, setStatus] = useState("standby"); // standby, alerting, mission, accepted
  const [battery, setBattery] = useState(88);
  const [missionData, setMissionData] = useState({
    location: "Chooralmala, Wayanad (Zone 4)",
    task: "🚁 Aerial Surveillance Required",
    equipment: "🔋 Bring Drone (Thermal Camera)",
    victims: "14 People trapped",
    coordinates: [11.6750, 76.1400],
    distance: "1.2km"
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setBattery(prev => Math.max(0, prev - 1));
    }, 30000);

    if (status === "standby") {
      const timer = setTimeout(() => {
        setStatus("alerting");
        setTimeout(() => setStatus("mission"), 1500);
      }, 4000);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full max-w-[400px] h-[800px] bg-black border-2 border-primary/20 rounded-[3.5rem] overflow-hidden relative shadow-[0_0_80px_rgba(var(--primary),0.15)] flex flex-col font-sans"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-20 flex items-center justify-center gap-1.5 border-x border-b border-white/5">
          <div className="w-10 h-1 bg-white/10 rounded-full" />
        </div>

        <div className="p-8 pt-10 flex justify-between items-center text-[11px] font-mono text-primary/80">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-widest">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            <span className="flex gap-0.5">
              <div className="w-1.5 h-2.5 bg-primary" />
              <div className="w-1.5 h-2.5 bg-primary" />
              <div className="w-1.5 h-2.5 bg-primary" />
              <div className="w-1.5 h-1.5 bg-primary/20 mt-1" />
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              <Radio className="w-3 h-3 animate-pulse" />
              <span className="text-[9px] font-black uppercase">MESH</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold">{battery}%</span>
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <div className="px-8 py-3 border-y border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Guardian Interface</h2>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-4 h-4 text-white/40" />
          </motion.button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {status === "standby" && (
              <motion.div 
                key="standby"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-10 text-center"
              >
                <div className="relative mb-12">
                  <motion.div 
                    animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border-2 border-primary"
                  />
                  <div className="w-32 h-32 rounded-full border-2 border-primary/20 flex items-center justify-center relative bg-primary/5">
                    <Radio className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <h3 className="text-primary font-black text-sm mb-3 animate-pulse uppercase tracking-widest">
                  {language === 'en' ? 'Scanning for emergency signals...' : language === 'hi' ? 'आपातकालीन संकेतों की खोज...' : 'അടിയന്തര സിഗ്നലുകൾക്കായി തിരയുന്നു...'}
                </h3>
                <p className="text-white/30 text-[9px] font-mono uppercase tracking-[0.3em]">
                  Status: Optimized Standby
                </p>
              </motion.div>
            )}

            {status === "alerting" && (
              <motion.div 
                key="alerting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  backgroundColor: ["rgba(255,0,0,0)", "rgba(255,0,0,0.2)", "rgba(255,0,0,0)"]
                }}
                transition={{ 
                  backgroundColor: { repeat: Infinity, duration: 0.4 }
                }}
                className="h-full flex flex-col items-center justify-center p-10 text-center"
              >
                <AlertTriangle className="w-24 h-24 text-red-500 mb-8" />
                <h2 className="text-red-500 text-4xl font-black italic tracking-tighter mb-4 uppercase">
                  MISSION INCOMING
                </h2>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="h-full bg-red-500"
                  />
                </div>
              </motion.div>
            )}

            {status === "mission" && (
              <motion.div 
                key="mission"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col p-8"
              >
                <div className="bg-red-500/10 border-2 border-red-500/30 rounded-[2rem] p-6 mb-8 relative overflow-hidden shadow-2xl shadow-red-500/5">
                  <div className="absolute top-4 right-4 flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  </div>
                  <h4 className="text-red-500 font-black text-[10px] uppercase mb-6 flex items-center gap-2 tracking-[0.2em]">
                    🚨 Critical Deployment
                  </h4>
                  <div className="space-y-6">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0 border border-red-500/20">
                        <MapPin className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">{t.volunteer.mission.target}</p>
                        <p className="text-white text-base font-bold leading-tight">{missionData.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0 border border-red-500/20">
                        <Activity className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">URGENCY</p>
                        <p className="text-white text-base font-bold leading-tight">{missionData.victims}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0 border border-red-500/20">
                        <Navigation className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">OBJECTIVE</p>
                        <p className="text-white text-base font-bold leading-tight">{missionData.task}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-10 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">REQUIREMENTS</p>
                      <p className="text-white text-xs font-bold leading-relaxed">{missionData.equipment}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <motion.button 
                    onClick={() => setStatus("accepted")}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(var(--primary), 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary text-black font-black py-6 rounded-2xl flex items-center justify-center gap-3 shadow-xl text-lg uppercase tracking-wider"
                  >
                    <CheckCircle2 className="w-7 h-7" />
                    ACCEPT MISSION
                  </motion.button>
                  <motion.button 
                    onClick={onClose}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-white/5 text-white/40 font-bold py-5 rounded-2xl flex items-center justify-center gap-2 text-xs border border-white/5 uppercase tracking-widest"
                  >
                    REJECT / UNAVAILABLE
                  </motion.button>
                </div>
              </motion.div>
            )}

            {status === "accepted" && (
              <motion.div 
                key="accepted"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col"
              >
                <div className="bg-red-600 p-4 text-center shadow-[0_4px_20px_rgba(220,38,38,0.4)] relative z-10">
                   <p className="text-white font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3">
                     <AlertTriangle className="w-5 h-5 animate-pulse" />
                     {missionData.victims.toUpperCase()} - {t.volunteer.mission.accepted.toUpperCase()}
                   </p>
                </div>

                <div className="flex-1 relative bg-[#0a0a0a] overflow-hidden">
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute inset-0 topographic-bg scale-150" />
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <motion.path 
                        d="M10,90 Q50,10 90,40" 
                        stroke="var(--primary)" 
                        strokeWidth="0.8" 
                        fill="none" 
                        strokeDasharray="4,3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                      <circle cx="10" cy="90" r="2.5" fill="var(--primary)" />
                      <circle cx="90" cy="40" r="4" fill="#FF0000" className="animate-pulse shadow-lg" />
                    </svg>
                  </div>

                  <div className="absolute top-6 left-6 right-6 space-y-3">
                    <div className="bg-black/80 backdrop-blur-xl border border-primary/30 rounded-2xl p-5 flex justify-between items-center shadow-2xl">
                      <div>
                        <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em] mb-1">ETA TO SITE</p>
                        <p className="text-primary text-2xl font-black italic">4 MIN</p>
                      </div>
                      <div className="w-px h-10 bg-white/10" />
                      <div className="text-right">
                        <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em] mb-1">{t.volunteer.mission.distance.toUpperCase()}</p>
                        <p className="text-white text-2xl font-black italic">{missionData.distance}</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                      <div className="flex items-center gap-5 mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                          <Navigation className="w-7 h-7 text-primary rotate-45" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">Next Instruction</p>
                          <p className="text-white text-base font-bold leading-tight">Proceed to Zone 4 Recovery Point</p>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                          animate={{ width: ["20%", "95%"] }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-black border-t border-white/10 space-y-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl uppercase tracking-widest"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    I HAVE ARRIVED
                  </motion.button>
                  <motion.button 
                    onClick={onClose}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-red-500/10 text-red-500/60 font-black py-4 rounded-2xl flex items-center justify-center gap-3 text-xs border border-red-500/20 uppercase tracking-[0.2em] hover:bg-red-500/20 hover:text-red-500 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.volunteer.exit}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-5 border-t border-white/5 bg-white/[0.02] flex justify-center">
          <div className="w-24 h-1.5 bg-white/10 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};
