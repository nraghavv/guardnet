"use client";

import { Hero } from "@/components/guardian/Hero";
import { InteractiveMap } from "@/components/guardian/InteractiveMap";
import { AssetGrid } from "@/components/guardian/AssetGrid";
import { InstructionsPanel } from "@/components/guardian/InstructionsPanel";
import { KSDMADashboard } from "@/components/guardian/KSDMADashboard";
import { AIAssistant } from "@/components/guardian/AIAssistant";
import { VerificationPortal } from "@/components/guardian/VerificationPortal";
import { VolunteerView } from "@/components/guardian/VolunteerView";
import { Shield, Menu, Github, ExternalLink, X, Users, Briefcase, Zap, Globe, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isLandslideTriggered, setIsLandslideTriggered] = useState(false);
  const [isVolunteerViewOpen, setIsVolunteerViewOpen] = useState(false);
  const [showVolunteerInfo, setShowVolunteerInfo] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (isLandslideTriggered) {
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [isLandslideTriggered]);

  const ZONES = [
    { 
      id: "zone-1", 
      name: "Zone 1", 
      area: "Punchirimattom", 
      task: "High-Altitude Search", 
      gear: "Thermal Drones, Ropes", 
      color: "red",
      protocol: "Focus on steep terrain scanning. All volunteers must be tethered. Continuous monitoring for secondary slides."
    },
    { 
      id: "zone-2", 
      name: "Zone 2", 
      area: "Mundakkai", 
      task: "Search & Rescue", 
      gear: "Excavators, Sniffer Dogs", 
      color: "orange",
      protocol: "Primary impact zone. Heavy machinery priority. Silence periods every 30 mins for voice detection."
    },
    { 
      id: "zone-3", 
      name: "Zone 3", 
      area: "School Area", 
      task: "Transit & Medical", 
      gear: "Trauma Kits, OT Units", 
      color: "yellow",
      protocol: "Casualty collection point. Triage active. Maintain clear ambulance path to Meppadi hospital."
    },
    { 
      id: "zone-4", 
      name: "Zone 4", 
      area: "Chooralmala Town", 
      task: "Command & Comms", 
      gear: "Ham Radio, Sat-Link", 
      color: "blue",
      protocol: "Central base. Registration of all personnel entering/exiting. Mesh network node maintenance."
    },
    { 
      id: "zone-5", 
      name: "Zone 5", 
      area: "Village Area", 
      task: "Debris Clearance", 
      gear: "Hydraulic Jacks, JCBs", 
      color: "purple",
      protocol: "Structure stabilization. Safe removal of debris. Check all voids before mechanical clearance."
    },
    { 
      id: "zone-6", 
      name: "Zone 6", 
      area: "Downstream", 
      task: "Recovery Ops", 
      gear: "Boats, Underwater Drones", 
      color: "green",
      protocol: "Monitoring Chaliyar river banks. Specialized dive teams only. Systematic mapping of debris deposition."
    }
  ];

  const handleExternalLink = (url: string) => {
    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement> | null, id: string) => {
    if (e) e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <div className="noise-overlay" />
        
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-0 w-full z-50 transition-all duration-500 ${
            scrolled 
              ? "bg-background/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20" 
              : "bg-transparent"
          }`}
        >
          <div className="container mx-auto px-4 h-20 flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                  <Shield className="w-6 h-6" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">GuardianNet</span>
                <span className="hidden sm:inline text-xs text-foreground/40 ml-2 font-mono">Kerala Edition</span>
              </div>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-1">
              {[
                { name: t.nav.technology, id: "technology" },
                { name: t.nav.ksdma, id: "ksdma" },
                { name: t.nav.instructions, id: "protocols" },
                { name: t.nav.keralaContext, id: "#" },
                { name: t.nav.about, id: "#" }
              ].map((item) => (
                <motion.a 
                  key={item.name}
                  href={`#${item.id}`}
                  onClick={(e) => item.id !== "#" && scrollToSection(e, item.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-white/5 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.name}
                </motion.a>
              ))}
              <div className="w-px h-6 bg-white/10 mx-2" />
              
              <div className="flex items-center gap-1 mr-4 bg-white/5 rounded-xl p-1 border border-white/5">
                {[
                  { code: 'en', label: 'EN' },
                  { code: 'hi', label: 'HI' },
                  { code: 'ml', label: 'ML' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                      language === lang.code 
                        ? "bg-primary text-primary-foreground shadow-lg" 
                        : "text-foreground/40 hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              <motion.button 
                onClick={() => setIsPortalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t.nav.volunteer}
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-background/95 backdrop-blur-xl border-t border-white/5"
              >
                <div className="container mx-auto px-4 py-6 space-y-2">
                  {[
                    { name: t.nav.technology, id: "technology" },
                    { name: t.nav.ksdma, id: "ksdma" },
                    { name: t.nav.instructions, id: "protocols" },
                    { name: t.nav.keralaContext, id: "#" },
                    { name: t.nav.about, id: "#" }
                  ].map((item) => (
                    <a 
                      key={item.name}
                      href={`#${item.id}`} 
                      onClick={(e) => {
                        if (item.id !== "#") {
                          scrollToSection(e, item.id);
                          setMobileMenuOpen(false);
                        }
                      }}
                      className="block px-4 py-3 rounded-xl text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-white/5 transition-all"
                    >
                      {item.name}
                    </a>
                  ))}

                  <div className="flex items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/5 mt-4">
                    {[
                      { code: 'en', label: 'English' },
                      { code: 'hi', label: 'हिंदी' },
                      { code: 'ml', label: 'മലയാളം' }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as any);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          language === lang.code 
                            ? "bg-primary text-primary-foreground" 
                            : "text-foreground/40"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      setIsPortalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm text-center mt-4"
                  >
                    {t.nav.volunteerNow}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        <Hero 
          onGetStarted={() => setIsPortalOpen(true)}
          onViewMap={() => scrollToSection(null, "map")}
        />
        <InteractiveMap onLandslideTrigger={setIsLandslideTriggered} />

        <AnimatePresence>
          {isLandslideTriggered && (
            <motion.section 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="py-12 bg-secondary/10 relative overflow-hidden"
            >
              <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 glass-card p-8 rounded-[2.5rem] border-primary/20 shadow-[0_0_50px_rgba(var(--primary),0.1)]">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold italic tracking-tight">{t.volunteer.activeUnits}</h3>
                        <p className="text-foreground/60 text-sm font-mono">{t.volunteer.status}</p>
                      </div>
                    </div>
                    <p className="text-foreground/60 max-w-xl mb-6 leading-relaxed">
                      {t.volunteer.detected} <span className="text-red-400 font-bold">Meppadi-Chooralmala</span> {t.volunteer.sector}. 
                      Volunteers are categorized into specialized strike teams. Access the mobile interface to receive direct assignments.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <motion.button
                        onClick={() => setShowVolunteerInfo(!showVolunteerInfo)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all shadow-xl"
                      >
                        {showVolunteerInfo ? t.volunteer.briefing.hide : t.volunteer.briefing.show}
                        <Zap className={`w-4 h-4 ${showVolunteerInfo ? "rotate-180" : ""} transition-transform text-primary`} />
                      </motion.button>
                      <motion.button
                        onClick={() => setIsVolunteerViewOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-black flex items-center gap-3 shadow-lg shadow-primary/20"
                      >
                        <Briefcase className="w-5 h-5" />
                        {t.volunteer.interface}
                      </motion.button>

                      <div className="flex flex-col gap-2 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                        <span className="text-[10px] font-black uppercase text-red-500/60 tracking-tighter mb-1">
                          {t.volunteer.noConnection.title}
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleExternalLink("https://meshrelay-9dtn549.public.builtwithrocket.new/device-connection-hub")}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white text-[10px] font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                          >
                            {t.volunteer.noConnection.server1}
                          </button>
                          <button 
                            onClick={() => handleExternalLink("https://web-ble-mesh-chat.vercel.app/")}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white text-[10px] font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                          >
                            {t.volunteer.noConnection.server2}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {showVolunteerInfo && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex-[1.5] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                      >
                        {ZONES.map((item) => (
                          <motion.div 
                            key={item.id} 
                            layoutId={item.id}
                            onClick={() => setSelectedZone(selectedZone === item.id ? null : item.id)}
                            className={`p-5 rounded-3xl cursor-pointer transition-all border ${
                              selectedZone === item.id 
                                ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(var(--primary),0.2)] scale-[1.02]" 
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{item.name}</span>
                              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: item.color }} />
                            </div>
                            <h4 className="font-bold text-base mb-1">{item.area}</h4>
                            <p className="text-xs text-primary font-mono uppercase mb-2">{item.task}</p>
                            
                            <AnimatePresence mode="wait">
                              {selectedZone === item.id ? (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="pt-3 border-t border-white/10 mt-3"
                                >
                                  <p className="text-[10px] text-foreground/80 mb-3 leading-relaxed">
                                    <span className="text-primary font-bold">PROTOCOL:</span> {item.protocol}
                                  </p>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[9px] text-foreground/40 font-mono italic">Gear: {item.gear}</span>
                                    <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold">
                                      ASSIGN
                                    </button>
                                  </div>
                                </motion.div>
                              ) : (
                                <motion.p 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-[10px] text-foreground/40 italic truncate"
                                >
                                  Click for deployment protocol...
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <AssetGrid />
        <InstructionsPanel />
        <KSDMADashboard />
        <AIAssistant />

        <VerificationPortal 
          isOpen={isPortalOpen} 
          onClose={() => setIsPortalOpen(false)} 
        />

        <AnimatePresence>
          {isVolunteerViewOpen && (
            <VolunteerView 
              onClose={() => setIsVolunteerViewOpen(false)} 
              t={t}
              language={language}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showNotification && (
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="fixed bottom-8 right-8 z-[100] w-full max-w-sm"
            >
              <div className="bg-red-600 border border-white/20 p-6 rounded-2xl shadow-2xl flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-black text-lg mb-1 uppercase italic tracking-tight">CRITICAL ALERT</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Landslide event detected in <span className="text-white font-bold underline">Mundakkai/Chooralmala</span> sectors. Emergency protocols activated.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button 
                      onClick={() => {
                        scrollToSection(null, "map");
                        setShowNotification(false);
                      }}
                      className="bg-white text-red-600 px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-white/90 transition-colors"
                    >
                      VIEW ON MAP
                    </button>
                    <button 
                      onClick={() => setShowNotification(false)}
                      className="text-white/60 text-xs font-bold uppercase px-2 hover:text-white transition-colors"
                    >
                      DISMISS
                    </button>
                  </div>
                </div>
                <button onClick={() => setShowNotification(false)}>
                   <X className="w-4 h-4 text-white/40" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="py-24 border-t border-white/5 bg-gradient-to-t from-secondary/20 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 topographic-bg opacity-20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-20">
              <div className="max-w-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground">
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold">GuardianNet</span>
                    <p className="text-xs text-foreground/40 font-mono">Kerala Edition</p>
                  </div>
                </div>
                <p className="text-foreground/40 leading-relaxed mb-6">
                  Hyper-local resilience for the Western Ghats. Built to ensure that the nearest help 
                  is always connected, even when the grid fails.
                </p>
                <p className="text-sm text-primary font-medium italic">
                  "The drone pilot next door. The excavator operator down the street."
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-16">
                <div>
                  <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-foreground/60">{t.footer.platform}</h4>
                  <ul className="space-y-4 text-sm text-foreground/40">
                    {t.footer.platformItems.map((item) => (
                      <li key={item}>
                        <a href="#" className="hover:text-primary transition-colors">{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-foreground/60">{t.footer.regions}</h4>
                  <ul className="space-y-4 text-sm text-foreground/40">
                    {t.footer.regionItems.map((item) => (
                      <li key={item}>
                        <a href="#" className="hover:text-primary transition-colors">{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-foreground/60">{t.footer.resources}</h4>
                  <ul className="space-y-4 text-sm text-foreground/40">
                    <li>
                      <a 
                        href="https://timesofindia.indiatimes.com/topic/wayanad-floods"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          handleExternalLink("https://timesofindia.indiatimes.com/topic/wayanad-floods");
                        }}
                        className="hover:text-primary transition-colors text-left block flex items-center gap-2"
                      >
                        {t.footer.links.documentation}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="hover:text-primary transition-colors text-left block flex items-center gap-2 cursor-not-allowed opacity-50"
                      >
                        {t.footer.links.apiAccess}
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://sdma.kerala.gov.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          handleExternalLink("https://sdma.kerala.gov.in/");
                        }}
                        className="hover:text-primary transition-colors text-left block flex items-center gap-2"
                      >
                        {t.footer.links.ksdmaPortal}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://sdma.kerala.gov.in/emergency-contacts/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          handleExternalLink("https://sdma.kerala.gov.in/emergency-contacts/");
                        }}
                        className="hover:text-primary transition-colors text-left block flex items-center gap-2"
                      >
                        {t.footer.links.emergencyContacts}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6 text-xs text-foreground/30">
                <span>© 2025 GuardianNet</span>
                <a href="#" className="hover:text-foreground/60 transition-colors">Privacy</a>
                <a href="#" className="hover:text-foreground/60 transition-colors">Terms</a>
              </div>
              <div className="flex items-center gap-4">
                <motion.a 
                  href="#" 
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
