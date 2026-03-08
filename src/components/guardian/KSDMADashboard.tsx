"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { 
  BarChart3, Map, Mountain, Users, AlertCircle, Activity,
  Cloud, Droplets, Wind, Thermometer, Radio, Satellite,
  TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle2, ChevronDown
} from "lucide-react";

type Region = 'wayanad' | 'idukki' | 'pathanamthitta' | 'alappuzha';

const REGIONAL_DATA: Record<Region, any> = {
  wayanad: {
    name: "Wayanad",
    metrics: [
      { label: "Rainfall (24h)", value: 187, unit: "mm", max: 250, trend: "up", critical: true },
      { label: "Soil Moisture", value: 94, unit: "%", max: 100, trend: "up", critical: true },
      { label: "Wind Speed", value: 45, unit: "km/h", max: 100, trend: "stable", critical: false },
      { label: "Temperature", value: 22, unit: "°C", max: 40, trend: "down", critical: false },
    ],
    riskNodes: [
      { name: "Meppadi", level: "critical", lat: 11.68, lng: 76.13, population: 12500 },
      { name: "Chooralmala", level: "high", lat: 11.67, lng: 76.14, population: 8200 },
      { name: "Mundakkai", level: "moderate", lat: 11.69, lng: 76.12, population: 5600 },
      { name: "Kalpetta", level: "low", lat: 11.61, lng: 76.08, population: 28900 },
    ],
    alerts: [
      { type: "critical", message: "Landslide warning active for Meppadi sector", time: "2 min ago" },
      { type: "warning", message: "Soil saturation exceeding 90% threshold", time: "5 min ago" },
      { type: "info", message: "Ham radio network activated - Channel VU2KER", time: "12 min ago" },
    ]
  },
  idukki: {
    name: "Idukki",
    metrics: [
      { label: "Dam Level", value: 2392, unit: "ft", max: 2403, trend: "up", critical: true },
      { label: "Inflow Rate", value: 12400, unit: "cusecs", max: 20000, trend: "up", critical: true },
      { label: "Wind Speed", value: 52, unit: "km/h", max: 100, trend: "up", critical: false },
      { label: "Temperature", value: 18, unit: "°C", max: 40, trend: "down", critical: false },
    ],
    riskNodes: [
      { name: "Idukki Arch Dam", level: "high", lat: 9.84, lng: 76.97, population: 500 },
      { name: "Cheruthoni", level: "critical", lat: 9.85, lng: 76.96, population: 15400 },
      { name: "Mullaperiyar", level: "critical", lat: 9.53, lng: 77.14, population: 2000 },
      { name: "Painavu", level: "moderate", lat: 9.84, lng: 76.94, population: 12000 },
    ],
    alerts: [
      { type: "critical", message: "Blue alert issued for Idukki Reservoir", time: "1 min ago" },
      { type: "warning", message: "Cheruthoni shutters likely to open in 6 hours", time: "15 min ago" },
      { type: "info", message: "Evacuation protocol initiated for low-lying areas", time: "20 min ago" },
    ]
  },
  pathanamthitta: {
    name: "Pathanamthitta",
    metrics: [
      { label: "Pamba Level", value: 8.4, unit: "m", max: 10, trend: "up", critical: true },
      { label: "Rainfall (24h)", value: 142, unit: "mm", max: 250, trend: "up", critical: false },
      { label: "Wind Speed", value: 28, unit: "km/h", max: 100, trend: "stable", critical: false },
      { label: "Humidity", value: 98, unit: "%", max: 100, trend: "up", critical: true },
    ],
    riskNodes: [
      { name: "Pampa Triveni", level: "critical", lat: 9.41, lng: 77.07, population: 5000 },
      { name: "Ranni Town", level: "high", lat: 9.38, lng: 76.78, population: 24000 },
      { name: "Kozhencherry", level: "moderate", lat: 9.34, lng: 76.71, population: 18000 },
      { name: "Pandalam", level: "low", lat: 9.23, lng: 76.67, population: 42000 },
    ],
    alerts: [
      { type: "critical", message: "Flood warning for Pamba river basin", time: "4 min ago" },
      { type: "warning", message: "Sabarimala pilgrims advised to stay at base camps", time: "10 min ago" },
      { type: "info", message: "NDRF team positioned at Chengannur", time: "45 min ago" },
    ]
  },
  alappuzha: {
    name: "Alappuzha",
    metrics: [
      { label: "Water Level", value: 1.2, unit: "m MSL", max: 2.5, trend: "up", critical: true },
      { label: "Sea State", value: 4, unit: "rough", max: 5, trend: "up", critical: true },
      { label: "Wind Speed", value: 58, unit: "km/h", max: 100, trend: "up", critical: true },
      { label: "Temperature", value: 27, unit: "°C", max: 40, trend: "stable", critical: false },
    ],
    riskNodes: [
      { name: "Kuttanad", level: "critical", lat: 9.44, lng: 76.43, population: 185000 },
      { name: "Thottappally", level: "high", lat: 9.31, lng: 76.38, population: 12000 },
      { name: "Alappuzha Beach", level: "high", lat: 9.49, lng: 76.32, population: 65000 },
      { name: "Chengannur", level: "moderate", lat: 9.32, lng: 76.61, population: 35000 },
    ],
    alerts: [
      { type: "critical", message: "Sea erosion warning for coastal belt", time: "Just now" },
      { type: "warning", message: "Kuttanad water logging risk high", time: "8 min ago" },
      { type: "info", message: "Fishermen advised not to venture into sea", time: "1 hour ago" },
    ]
  }
};

function RealTimeChart() {
  const [data, setData] = useState<number[]>([40, 60, 45, 90, 100, 80, 50, 30, 40, 60, 75, 85]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), Math.floor(Math.random() * 60) + 40];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-40 flex items-end gap-1">
      {data.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.5 }}
          className={`flex-1 rounded-t-sm ${h > 80 ? "bg-red-500/80" : h > 60 ? "bg-orange-500/60" : "bg-primary/50"}`}
        />
      ))}
    </div>
  );
}

function MetricCard({ metric, index }: { metric: any; index: number }) {
  const [value, setValue] = useState(metric.value);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev: number) => {
        const change = (Math.random() - 0.5) * 4;
        return Math.max(0, Math.min(metric.max, prev + change));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [metric.max, metric.value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-2xl ${metric.critical ? "bg-red-500/10 border border-red-500/20" : "bg-white/5 border border-white/10"}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-widest text-foreground/40">{metric.label}</span>
        {metric.trend === "up" ? (
          <TrendingUp className={`w-3 h-3 ${metric.critical ? "text-red-400" : "text-green-400"}`} />
        ) : metric.trend === "down" ? (
          <TrendingDown className="w-3 h-3 text-blue-400" />
        ) : (
          <Activity className="w-3 h-3 text-yellow-400" />
        )}
      </div>
      <div className="flex items-end gap-1">
        <span className={`text-2xl font-bold ${metric.critical ? "text-red-400" : "text-white"}`}>
          {typeof value === 'number' ? Math.round(value) : value}
        </span>
        <span className="text-[10px] text-foreground/40 mb-1">{metric.unit}</span>
      </div>
      <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / metric.max) * 100}%` }}
          className={`h-full rounded-full ${metric.critical ? "bg-red-500" : "bg-primary"}`}
        />
      </div>
    </motion.div>
  );
}

export function KSDMADashboard() {
  const { t, language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentRegion, setCurrentRegion] = useState<Region>('wayanad');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [time, setTime] = useState<string>("--:--:--");
  const [mounted, setMounted] = useState(false);

  const regionData = REGIONAL_DATA[currentRegion];

  useEffect(() => {
    setMounted(true);
    setTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "moderate": return "bg-yellow-500";
      default: return "bg-green-500";
    }
  };

  return (
    <section id="ksdma" ref={containerRef} className="py-32 relative overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Satellite className="w-4 h-4 animate-pulse" />
                <span>KSDMA Integration</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 tracking-tight">{t.dashboard.title}</h2>
              <p className="text-foreground/50 leading-relaxed mb-6">
                {t.dashboard.subtitle}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-8">
                {(Object.keys(REGIONAL_DATA) as Region[]).map((region) => (
                  <button
                    key={region}
                    onClick={() => setCurrentRegion(region)}
                    className={`px-4 py-3 rounded-xl text-[10px] font-black tracking-wider uppercase border transition-all ${
                      currentRegion === region 
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]" 
                        : "bg-white/5 border-white/10 text-foreground/40 hover:bg-white/10"
                    }`}
                  >
                    {REGIONAL_DATA[region].name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2 mb-4">
                <Mountain className="w-4 h-4" />
                {t.dashboard.nodes} ({regionData.name})
              </h3>
              {regionData.riskNodes.map((node, i) => (
                <motion.div
                  key={node.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedNode(selectedNode === node.name ? null : node.name)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                    selectedNode === node.name 
                      ? "bg-white/10 border-white/20 shadow-xl" 
                      : "bg-white/5 border-transparent hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(node.level)} ${node.level === "critical" ? "animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" : ""}`} />
                      <span className="font-bold text-sm">{node.name}</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${
                      node.level === "critical" ? "bg-red-500/20 text-red-400 border border-red-500/20" :
                      node.level === "high" ? "bg-orange-500/20 text-orange-400 border border-orange-500/20" :
                      node.level === "moderate" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20" :
                      "bg-green-500/20 text-green-400 border border-green-500/20"
                    }`}>
                      {node.level}
                    </span>
                  </div>
                  {selectedNode === node.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pt-4 mt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-xs"
                    >
                      <div>
                        <span className="text-foreground/40 text-[9px] font-black uppercase tracking-widest">Coordinates</span>
                        <p className="font-mono text-foreground/80">{node.lat}°N, {node.lng}°E</p>
                      </div>
                      <div>
                        <span className="text-foreground/40 text-[9px] font-black uppercase tracking-widest">Population</span>
                        <p className="font-mono text-foreground/80">{node.population.toLocaleString()}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-8"
          >
            <div className="glass-card rounded-[2.5rem] p-1 overflow-hidden shadow-2xl shadow-black/40">
              <div className="bg-black/80 rounded-[2.2rem] overflow-hidden border border-white/5">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-black/40 via-transparent to-transparent">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Live Command Feed</span>
                    </div>
                    <div className="h-5 w-px bg-white/10" />
                    <span className="text-[10px] font-mono text-foreground/40 tracking-widest">
                      {time} IST
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/30">{regionData.name} SECTOR</span>
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                      <Radio className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                  </div>
                </div>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" /> Rainfall Intensity
                      </h5>
                      <span className="text-[9px] px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 font-black border border-red-500/20">LIVE METRICS</span>
                    </div>
                    <RealTimeChart />
                    
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 shadow-xl shadow-red-500/5">
                      <div className="flex items-start gap-4">
                        <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-red-400 font-black uppercase tracking-widest mb-1">CRITICAL ALERT</p>
                          <p className="text-[11px] text-foreground/70 leading-relaxed font-medium">
                            {regionData.alerts[0].message}. All emergency response units in {regionData.name} are on high alert.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                      <Map className="w-4 h-4 text-primary" /> Terrain Analysis
                    </h5>
                    <div className="relative aspect-square rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 overflow-hidden group">
                      <div className="absolute inset-0 topographic-bg opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
                      
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        <defs>
                          <radialGradient id="criticalGlow">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient id="highGlow">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                        
                        {[10, 20, 30, 40, 50].map((i) => (
                          <motion.path
                            key={i}
                            d={`M5 ${50 + i} Q 25 ${40 + i * 0.5}, 50 ${50 + i * 0.3} T 95 ${50 + i}`}
                            fill="none"
                            stroke="white"
                            strokeOpacity="0.05"
                            strokeWidth="0.5"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 2.5, delay: i * 0.1 }}
                          />
                        ))}

                        <motion.circle
                          cx="35" cy="40"
                          r="18"
                          fill="url(#criticalGlow)"
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                        />
                        <circle cx="35" cy="40" r="3.5" fill="#ef4444" className="shadow-lg shadow-red-500" />
                        
                        <circle cx="60" cy="55" r="12" fill="url(#highGlow)" />
                        <circle cx="60" cy="55" r="3" fill="#f97316" />
                        
                        <circle cx="75" cy="35" r="2" fill="#eab308" />
                        <circle cx="25" cy="65" r="2" fill="#22c55e" />

                        <motion.line
                          x1="35" y1="40" x2="60" y2="55"
                          stroke="#ef4444"
                          strokeWidth="1"
                          strokeDasharray="4 3"
                          strokeOpacity="0.4"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          transition={{ duration: 1.5, delay: 0.8 }}
                        />
                      </svg>

                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="flex gap-3">
                          {[
                            { color: "bg-red-500", label: "Crit" },
                            { color: "bg-orange-500", label: "High" },
                            { color: "bg-yellow-500", label: "Mod" },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${item.color} shadow-[0_0_5px_rgba(255,255,255,0.2)]`} />
                              <span className="text-[8px] text-foreground/40 font-black uppercase tracking-tighter">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {regionData.metrics.map((metric: any, i: number) => (
                      <MetricCard key={metric.label} metric={metric} index={i} />
                    ))}
                  </div>
                </div>

                <div className="px-8 pb-8">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-5 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-primary" /> {t.dashboard.activeAlerts}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {regionData.alerts.map((alert: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center gap-4 p-4 rounded-2xl border ${
                          alert.type === "critical" ? "bg-red-500/10 border-red-500/20" :
                          alert.type === "warning" ? "bg-yellow-500/10 border-yellow-500/20" :
                          "bg-white/5 border-white/10"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          alert.type === "critical" ? "bg-red-500/20 text-red-400" :
                          alert.type === "warning" ? "bg-yellow-500/10 text-yellow-400" :
                          "bg-primary/20 text-primary"
                        }`}>
                          {alert.type === "critical" ? (
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          ) : alert.type === "warning" ? (
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold leading-tight mb-1">{alert.message}</p>
                          <div className="flex items-center gap-2 opacity-40 font-mono text-[9px] uppercase tracking-widest">
                            <Clock className="w-3 h-3" />
                            {alert.time}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
