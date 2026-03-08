"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, MapPin, Zap, Mountain, Wifi, Users, ChevronDown } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";

interface HeroProps {
  onGetStarted?: () => void;
  onViewMap?: () => void;
}

function ParticleField() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

function TerrainLines() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 600" preserveAspectRatio="none">
      {Array.from({ length: 15 }, (_, i) => (
        <motion.path
          key={i}
          d={`M0 ${200 + i * 25} Q 250 ${150 + i * 20 + Math.sin(i) * 30}, 500 ${200 + i * 25} T 1000 ${200 + i * 25}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 2, delay: i * 0.1 }}
        />
      ))}
    </svg>
  );
}

export function Hero({ onGetStarted, onViewMap }: HeroProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const STATS = [
    { icon: Users, value: "2,847", label: t.hero.stats.responders, suffix: "+" },
    { icon: Mountain, value: "12", label: t.hero.stats.districts, suffix: "" },
    { icon: Wifi, value: "98.7", label: t.hero.stats.uptime, suffix: "%" },
  ];

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/15 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
      
      <ParticleField />
      <TerrainLines />

      <motion.div 
        style={{ y, opacity }}
        className="container px-4 mx-auto relative z-10"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold mb-10 shadow-2xl backdrop-blur-xl">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-white/90 tracking-widest uppercase text-[10px]">GuardianNet: Kerala Edition</span>
              <div className="flex items-center gap-2 border-l border-white/10 pl-3 ml-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 text-[10px] font-black tracking-tighter">NODE-01 ACTIVE</span>
              </div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-[-0.04em] mb-10 leading-[0.9]"
          >
            <span className="text-white drop-shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
              {t.hero.title1}
            </span>
            <br />
            <span className="relative">
              <span className="text-primary italic drop-shadow-[0_0_40px_rgba(var(--primary),0.4)]">{t.hero.title2}</span>
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-16 leading-relaxed font-medium drop-shadow-sm"
          >
            {t.hero.subtitle}
            <span className="text-primary font-bold border-b-2 border-primary/30 pb-1 ml-1">{t.hero.subtitleHighlight}</span>.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mb-20"
          >
            <motion.button 
              onClick={onGetStarted}
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(var(--primary), 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 rounded-2xl bg-primary text-black font-black text-xl flex items-center gap-4 shadow-2xl shadow-primary/20 transition-all uppercase tracking-widest"
            >
              {t.hero.getStarted}
              <Zap className="w-6 h-6" />
            </motion.button>
            <motion.button 
              onClick={onViewMap}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 rounded-2xl border-2 border-white/10 font-black text-xl flex items-center gap-4 hover:bg-white/5 transition-all uppercase tracking-widest text-white/80"
            >
              <MapPin className="w-6 h-6" />
              {t.hero.viewMap}
            </motion.button>
          </motion.div>
  
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-primary/20 hover:bg-white/[0.05] transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-4xl font-black mb-2 text-white">
                  {stat.value}<span className="text-primary">{stat.suffix}</span>
                </p>
                <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
  
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-3 text-white/30"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t.hero.scroll}</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
