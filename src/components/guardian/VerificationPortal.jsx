"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, CheckCircle, User, Phone, 
  CreditCard, QrCode, Loader2,
  X, Briefcase, Fingerprint, Search,
  ArrowRight, ShieldCheck, MapPin,
  Calendar, Check, Download, Share2, AlertCircle,
  Building2, Globe, Database, Award
} from "lucide-react";
import registryData from "../../lib/data/verified_registry.json";

const SKILL_CATEGORIES = [
  { id: "drone", label: "Drone Operator (DGCA)", icon: "🛸", org: "DGCA" },
  { id: "medical", label: "Medical Professional (IMA)", icon: "🏥", org: "IMA" },
  { id: "machinery", label: "Heavy Machinery (RTO)", icon: "🚜", org: "RTO" },
  { id: "ham", label: "Ham Radio Operator", icon: "📡", org: "KSDMA" },
  { id: "unskilled", label: "General Volunteer", icon: "👩", org: "Kudumbashree" },
];

export function VerificationPortal({ isOpen, onClose }) {
  const [step, setStep] = useState("form"); // form, connecting, validating, success, error
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    skill: "drone",
    idNumber: ""
  });
  const [verifiedUser, setVerifiedUser] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const startVerification = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.idNumber) return;
    
    setStep("connecting");
    
    // Simulate lookup in our registry
    setTimeout(() => {
      setStep("validating");
      
      const found = registryData.find(u => 
        u.id.toLowerCase() === formData.idNumber.toLowerCase() ||
        u.name.toLowerCase().includes(formData.fullName.toLowerCase())
      );

      setTimeout(() => {
        if (found) {
          setVerifiedUser(found);
          setStep("success");
        } else {
          setStep("error");
        }
      }, 2500);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-xl bg-slate-50 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10"
      >
        {/* Government Header Bar */}
        <div className="bg-[#064e3b] px-8 py-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                <Shield className="w-32 h-32" />
            </div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase leading-none">GuardianNet</h2>
                <p className="text-[10px] text-emerald-400/80 uppercase tracking-[0.2em] font-bold mt-1">Kerala State Disaster Management Authority</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Secure Verification Portal</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-10">
          <AnimatePresence mode="wait">
            {step === "form" && (
              <motion.form 
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={startVerification}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <User className="w-3 h-3" /> Full Name (As per Govt ID)
                    </label>
                    <input 
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Arun K. Pillai"
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-[#064e3b] focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-300"
                    />
                    </div>

                    <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Phone className="w-3 h-3" /> Registered Mobile
                    </label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold border-r border-slate-200 pr-3">+91</span>
                        <input 
                        required
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        className="w-full pl-16 pr-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-[#064e3b] focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-300"
                        />
                    </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Briefcase className="w-3 h-3" /> Skill Specialization
                    </label>
                    <select 
                      name="skill"
                      value={formData.skill}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-[#064e3b] focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-800 font-medium bg-white appearance-none"
                    >
                      {SKILL_CATEGORIES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <CreditCard className="w-3 h-3" /> License / Registration ID
                    </label>
                    <input 
                      required
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. DGCA-2024-001"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-[#064e3b] focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-300 uppercase"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    className="w-full py-5 rounded-[1.25rem] bg-[#064e3b] hover:bg-[#065f46] text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-emerald-900/20 transition-all active:scale-[0.98] group"
                  >
                    Authenticate Credentials
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-4 mt-8 p-4 rounded-2xl bg-slate-100/50 border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Globe className="w-5 h-5 text-[#064e3b]" />
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-relaxed">
                      Cross-referencing with official DGCA, IMA, and RTO Kerala registries in real-time.
                    </p>
                  </div>
                </div>
              </motion.form>
            )}

            {(step === "connecting" || step === "validating") && (
              <motion.div 
                key="simulation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 flex flex-col items-center justify-center text-center space-y-10"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-32 h-32 rounded-full border-[6px] border-slate-100 border-t-[#064e3b] relative z-10"
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    {step === "connecting" ? (
                      <Database className="w-10 h-10 text-slate-300 animate-pulse" />
                    ) : (
                      <Fingerprint className="w-10 h-10 text-[#064e3b]" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                    {step === "connecting" ? "Establishing Secure Link" : "Verifying Identity"}
                  </h3>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                      {step === "connecting" 
                        ? "Connecting to NIC Gov Cloud Infrastructure..." 
                        : "Matching ID with Certified Registry..."}
                    </p>
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                            <motion.div 
                                key={i}
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                            />
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "success" && (
                <motion.div 
                  key="id-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest mb-2">
                        <CheckCircle className="w-4 h-4" /> Authenticated
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">Digital ID Generated</h3>
                  </div>

                  {/* High-fidelity Digital ID Card */}
                  <div className="relative group perspective-1000">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-[#064e3b] rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl">
                      {/* ID Header */}
                      <div className="bg-[#064e3b] px-6 py-5 text-white flex justify-between items-center border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-6 h-6 text-emerald-400" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Official Responder</span>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-400/30">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Active</span>
                        </div>
                      </div>

                      <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                          <div className="relative">
                            <div className="w-32 h-32 rounded-3xl bg-slate-50 border-4 border-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
                              <User className="w-16 h-16 text-slate-200" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-emerald-500 border-4 border-white flex items-center justify-center text-white shadow-lg">
                                <Award className="w-5 h-5" />
                            </div>
                          </div>
                          
                          <div className="flex-1 space-y-4 w-full">
                            <div className="space-y-1">
                              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Authorized Personnel</p>
                              <p className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">
                                {verifiedUser?.name || formData.fullName}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-1">
                                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Designation</p>
                                <p className="text-[11px] font-black text-slate-800 uppercase bg-slate-100 px-2 py-1 rounded inline-block">
                                  {SKILL_CATEGORIES.find(s => s.id === (verifiedUser?.skill || formData.skill))?.label.split(" (")[0]}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Issuing Body</p>
                                <p className="text-[11px] font-black text-slate-800 uppercase">
                                  {verifiedUser?.org || "KSDMA AUTHORITY"}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex gap-8 border-t border-slate-100 pt-4">
                              <div className="space-y-1">
                                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Assigned Sector</p>
                                <p className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">{verifiedUser?.district || "WAYANAD"}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Validity</p>
                                <p className="text-[11px] font-black text-slate-800 tracking-widest">DEC 2026</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex-shrink-0 flex flex-col items-center gap-3">
                            <div className="p-3 border-2 border-slate-100 rounded-3xl bg-slate-50/50 shadow-inner group-hover:border-emerald-200 transition-colors">
                              <QrCode className="w-20 h-20 text-slate-800" />
                            </div>
                            <div className="text-center">
                                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">System ID</p>
                                <p className="text-[10px] font-mono font-black text-slate-600 tracking-tighter">{verifiedUser?.id || formData.idNumber}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Verified Stamp - Refined */}
                      <div className="absolute bottom-10 right-24 rotate-[-15deg] opacity-[0.15] pointer-events-none scale-150">
                        <div className="border-[12px] border-emerald-600 rounded-3xl px-8 py-3 text-emerald-600 font-black text-5xl uppercase tracking-tighter flex items-center gap-4">
                          <CheckCircle className="w-12 h-12" />
                          VERIFIED
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-3 py-5 rounded-[1.25rem] border-2 border-slate-200 text-slate-600 text-sm font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                      <Download className="w-5 h-5" /> Download ID
                    </button>
                    <button className="flex items-center justify-center gap-3 py-5 rounded-[1.25rem] bg-emerald-500 text-white text-sm font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200">
                      <Share2 className="w-5 h-5" /> Share Access
                    </button>
                  </div>
                </motion.div>
            )}

            {step === "error" && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-8"
              >
                <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-red-500 shadow-inner">
                  <AlertCircle className="w-12 h-12" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-800 uppercase">Verification Failed</h3>
                  <p className="text-slate-500 max-w-sm mx-auto font-medium">
                    Credentials do not match our secure records for {SKILL_CATEGORIES.find(s => s.id === formData.skill)?.org}. Please ensure you are using your official government-issued registration number.
                  </p>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <button 
                    onClick={() => setStep("form")}
                    className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-black transition-all"
                    >
                    Review Details
                    </button>
                    <button 
                    onClick={onClose}
                    className="w-full py-4 rounded-2xl border-2 border-slate-200 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                    Cancel
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
