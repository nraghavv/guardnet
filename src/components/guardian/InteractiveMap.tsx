"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, Radio, Truck, Activity, MapPin, 
  Satellite, Wifi, WifiOff, Zap, Navigation,
  Crosshair, Layers, TriangleAlert
} from "lucide-react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

const WAYANAD_CENTER: [number, number] = [11.6854, 76.1320];

interface Asset {
  id: number;
  type: "drone" | "medical" | "jeep" | "excavator" | "ham";
  name: string;
  location: [number, number];
  task: string;
  status: "standby" | "deployed" | "en-route";
  eta?: string;
  verified: boolean;
}

const ASSETS: Asset[] = [
  { id: 1, type: "drone", name: "Arun K. - Drone Pilot", location: [11.6920, 76.1250], task: "Aerial Surveillance", status: "standby", verified: true },
  { id: 2, type: "medical", name: "Dr. Priya M. - Trauma Surgeon", location: [11.6780, 76.1400], task: "Field Triage Setup", status: "standby", eta: "8 min", verified: true },
  { id: 3, type: "jeep", name: "Rajesh T. - 4x4 Mahindra", location: [11.6900, 76.1450], task: "Evacuation Support", status: "standby", verified: true },
  { id: 4, type: "excavator", name: "Anand JCB Services", location: [11.6750, 76.1200], task: "Debris Clearance", status: "standby", eta: "15 min", verified: true },
  { id: 5, type: "ham", name: "VU2ABC - Ham Operator", location: [11.6830, 76.1350], task: "Emergency Comms", status: "standby", verified: true },
  { id: 6, type: "medical", name: "Leela - Army Nurse (Retd)", location: [11.6870, 76.1280], task: "First Aid Station", status: "standby", verified: true },
  { id: 7, type: "ham", name: "VU2NRO - Nilambur Ham Radio", location: [11.2750, 76.2250], task: "Analog Backup Comms", status: "standby", verified: true },
  { id: 8, type: "medical", name: "Meppadi Kudumbashree Unit", location: [11.5580, 76.1280], task: "Community Kitchen & Logistics", status: "standby", verified: true },
];

const RISK_ZONES = [
  { center: [11.6854, 76.1320] as [number, number], radius: 800, level: "critical", name: "Meppadi Sector" },
  { center: [11.6750, 76.1400] as [number, number], radius: 500, level: "high", name: "Chooralmala" },
  { center: [11.6950, 76.1200] as [number, number], radius: 400, level: "moderate", name: "Mundakkai" },
];

function AssetMarkers({ 
  assets, 
  activeAssets, 
  setSelectedAsset, 
  getAssetIcon 
}: { 
  assets: Asset[], 
  activeAssets: number[], 
  setSelectedAsset: (asset: Asset) => void,
  getAssetIcon: (type: string) => string
}) {
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  if (!L) return null;

  return (
    <>
      {assets.map((asset) => {
        const isActive = activeAssets.includes(asset.id);
        
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="relative cursor-pointer group">
              <div class="p-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-[#22c55e] text-white shadow-lg shadow-green-500/30 scale-110" 
                  : "bg-white/20 text-white/60 scale-90"
              }">
                <span class="text-lg">${getAssetIcon(asset.type)}</span>
                ${isActive ? `
                  <div class="absolute inset-0 rounded-xl border-2 border-[#22c55e] animate-ping opacity-20"></div>
                ` : ''}
              </div>
              ${isActive ? `
                <div class="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap z-[1001]">
                  <span class="px-2 py-1 rounded-md bg-black/80 text-[10px] font-bold text-white shadow-lg">
                    ${asset.name.split(" - ")[0]}
                  </span>
                </div>
              ` : ''}
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        return (
          <Marker
            key={asset.id}
            position={asset.location}
            icon={icon}
            eventHandlers={{
              click: () => setSelectedAsset(asset),
            }}
          />
        );
      })}
    </>
  );
}

export function InteractiveMap({ onLandslideTrigger }: { onLandslideTrigger?: (isTriggered: boolean) => void }) {
  const [isTriggered, setIsTriggered] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [mapType, setMapType] = useState<"dark" | "topo">("dark");
  const [activeAssets, setActiveAssets] = useState<number[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [networkStatus, setNetworkStatus] = useState<"online" | "degraded" | "mesh">("online");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [deployedCount, setDeployedCount] = useState(0);

    useEffect(() => {
      if (onLandslideTrigger) {
        onLandslideTrigger(isTriggered);
      }
    }, [isTriggered, onLandslideTrigger]);

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  useEffect(() => {
    if (isTriggered) {
      setNetworkStatus("degraded");
      setScanProgress(0);
      
      const scanInterval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 5, 100));
      }, 100);

      const timer1 = setTimeout(() => {
        setActiveAssets([1, 5, 8]);
        setDeployedCount(3);
      }, 1200);
      const timer2 = setTimeout(() => {
        setActiveAssets([1, 5, 8, 2, 6, 7]);
        setDeployedCount(6);
        setNetworkStatus("mesh");
      }, 2400);
      const timer3 = setTimeout(() => {
        setActiveAssets([1, 2, 3, 4, 5, 6, 7, 8]);
        setDeployedCount(8);
      }, 3600);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearInterval(scanInterval);
      };
    } else {
      setActiveAssets([]);
      setNetworkStatus("online");
      setScanProgress(0);
      setDeployedCount(0);
    }
  }, [isTriggered]);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "drone": return "🛸";
      case "medical": return "🏥";
      case "jeep": return "🚙";
      case "excavator": return "🚜";
      case "ham": return "📡";
      default: return "📍";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return { fill: "#ef4444", stroke: "#dc2626" };
      case "high": return { fill: "#f97316", stroke: "#ea580c" };
      case "moderate": return { fill: "#eab308", stroke: "#ca8a04" };
      default: return { fill: "#22c55e", stroke: "#16a34a" };
    }
  };

  return (
    <section id="map" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container px-4 mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
            <Satellite className="w-4 h-4 animate-pulse" />
            <span>Live Simulation • Wayanad District</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            The <span className="text-primary italic">Wayanad</span> Scenario
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Experience real-time asset discovery when connectivity fails. Watch how GuardianNet activates mesh networks and identifies critical resources within the Golden Hour radius.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 left-0 right-0 z-[1000] p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                      networkStatus === "online" ? "bg-green-500/20 text-green-400" :
                      networkStatus === "degraded" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-purple-500/20 text-purple-400"
                    }`}>
                      {networkStatus === "mesh" ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                      {networkStatus === "online" ? "ONLINE" : networkStatus === "degraded" ? "DEGRADED" : "MESH MODE"}
                    </div>
                    {isTriggered && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold"
                      >
                        <TriangleAlert className="w-3 h-3 animate-pulse" />
                        LANDSLIDE TRIGGERED
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setMapType(mapType === "dark" ? "topo" : "dark")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                        mapType === "topo" ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      {mapType === "dark" ? "DARK" : "TOPO"}
                    </button>
                    <button 
                      onClick={() => setIs3D(!is3D)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                        is3D ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 border-2 ${is3D ? "border-primary" : "border-current"} rounded-sm rotate-45 transform-gpu`} />
                      3D
                    </button>
                    <button 
                      onClick={() => setShowHeatmap(!showHeatmap)}
                      className={`p-2 rounded-lg transition-all ${showHeatmap ? "bg-primary/20 text-primary" : "bg-white/10 text-white/60"}`}
                    >
                      <Layers className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 text-white/60 hover:text-white transition-all">
                      <Crosshair className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div 
                className="h-[500px] relative perspective-1000 overflow-hidden"
                style={{ perspective: "1500px" }}
              >
                <motion.div 
                  animate={{ 
                    rotateX: is3D ? 45 : 0,
                    rotateZ: is3D ? -10 : 0,
                    scale: is3D ? 1.2 : 1,
                    y: is3D ? 40 : 0,
                    translateZ: is3D ? 100 : 0
                  }}
                  transition={{ type: "spring", stiffness: 40, damping: 15 }}
                  className="w-full h-full origin-center"
                >
                  {mapLoaded && typeof window !== "undefined" && (
                    <MapContainer
                      key={`${mapType}-${is3D}`}
                      center={WAYANAD_CENTER}
                      zoom={12}
                      style={{ height: "100%", width: "100%" }}
                      zoomControl={false}
                      attributionControl={false}
                    >
                      <TileLayer
                        url={mapType === "dark" 
                          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                          : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                        }
                      />
                      
                      {showHeatmap && RISK_ZONES.map((zone, idx) => (
                        <Circle
                          key={idx}
                          center={zone.center}
                          radius={zone.radius}
                          pathOptions={{
                            fillColor: getRiskColor(zone.level).fill,
                            fillOpacity: isTriggered && zone.level === "critical" ? 0.4 : 0.15,
                            color: getRiskColor(zone.level).stroke,
                            weight: 2,
                          }}
                        />
                      ))}

                      {isTriggered && activeAssets.length > 1 && (
                        <Polyline
                          positions={ASSETS.filter(a => activeAssets.includes(a.id)).map(a => a.location)}
                          pathOptions={{
                            color: "#22c55e",
                            weight: 2,
                            dashArray: "10, 10",
                            opacity: 0.6,
                          }}
                        />
                      )}

                      <AssetMarkers 
                        assets={ASSETS}
                        activeAssets={activeAssets}
                        setSelectedAsset={setSelectedAsset}
                        getAssetIcon={getAssetIcon}
                      />
                    </MapContainer>
                  )}
                </motion.div>
              </div>

              {isTriggered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{ zIndex: 999 }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-500/10 blur-[100px] animate-pulse" />
                </motion.div>
              )}

              <div className="absolute bottom-0 left-0 right-0 z-[1000] p-4 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Active Assets</p>
                      <p className="text-2xl font-bold text-primary">{deployedCount}<span className="text-sm text-white/40">/{ASSETS.length}</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Golden Hour</p>
                      <p className="text-2xl font-bold text-accent">5km<span className="text-sm text-white/40"> radius</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Elevation</p>
                      <p className="text-2xl font-bold">1,200<span className="text-sm text-white/40">m</span></p>
                    </div>
                  </div>
                  {isTriggered && scanProgress < 100 && (
                    <div className="w-32">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Scanning</p>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${scanProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Meppadi, Wayanad
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-foreground/60">Risk Level</span>
                  <span className="text-sm font-bold text-red-400">CRITICAL</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-foreground/60">Soil Saturation</span>
                  <span className="text-sm font-bold text-orange-400">94%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-foreground/60">Rainfall (24h)</span>
                  <span className="text-sm font-bold">187mm</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-foreground/60">Terrain Type</span>
                  <span className="text-sm font-bold">Western Ghats</span>
                </div>
              </div>
            </motion.div>

            <motion.button
              onClick={() => setIsTriggered(!isTriggered)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-lg ${
                isTriggered 
                  ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30" 
                  : "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:shadow-lg hover:shadow-accent/30"
              }`}
            >
              {isTriggered ? (
                <>
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                  Reset Simulation
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Trigger Landslide Event
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {isTriggered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-xs text-red-400 font-bold uppercase mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3" /> System Alert
                    </p>
                    <p className="text-sm text-red-400/80">
                      Road access blocked. Activating mesh network protocol. Searching for local assets within 5km radius...
                    </p>
                  </div>
                  
                  <div className="glass-card rounded-xl p-4 space-y-3">
                    <p className="text-xs uppercase tracking-widest text-foreground/40">Deployed Assets</p>
                    {ASSETS.filter(a => activeAssets.includes(a.id)).map((asset) => (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
                      >
                        <span className="text-lg">{getAssetIcon(asset.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{asset.name}</p>
                          <p className="text-[10px] text-foreground/40">{asset.task}</p>
                        </div>
                        <div className="flex items-center gap-1 text-primary">
                          <Navigation className="w-3 h-3" />
                          <span className="text-[10px] font-bold">{asset.eta || "READY"}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {activeAssets.length >= 4 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
                    >
                      <p className="text-xs text-yellow-400 font-bold uppercase mb-2">Skill Deficit Detected</p>
                      <p className="text-sm text-yellow-400/80">
                        No additional excavators found in zone. Auto-alerting Kalpetta Heavy Machinery Union...
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
