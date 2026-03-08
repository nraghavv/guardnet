
"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Battery, 
  Navigation, 
  Radio, 
  Camera, 
  AlertOctagon, 
  Drill, 
  HeartPulse, 
  HardHat, 
  Info, 
  Wind, 
  Users2, 
  Dog, 
  Network 
} from "lucide-react";

const InstructionSection = ({ icon: Icon, title, items, color = "primary" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-${color}/30 transition-all group`}
  >
    <div className="flex items-center gap-4 mb-6">
      <div className={`w-12 h-12 rounded-2xl bg-${color}/10 flex items-center justify-center text-${color} group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold tracking-tight">{title}</h3>
    </div>
    <ul className="space-y-4">
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-4">
          <div className={`w-1.5 h-1.5 rounded-full bg-${color} mt-2 flex-shrink-0`} />
          <p className="text-foreground/70 text-sm leading-relaxed">
            <span className="text-foreground font-bold">{item.label}:</span> {item.content}
          </p>
        </li>
      ))}
    </ul>
  </motion.div>
);

export const InstructionsPanel = () => {
  const protocols = [
    {
      icon: Shield,
      title: "General Safety & Protocol",
      items: [
        { label: "Safety First", content: "Do not enter unstable zones (Red Zones) without explicit clearance from Command. Your safety is the priority; do not become a second victim." },
        { label: "Battery Discipline", content: "Keep your phone in 'Low Power Mode'. Only turn on GPS/Data when actively updating your status or navigating to a site." },
        { label: "Status Updates", content: "Update your status to 'On-Site' immediately upon arrival. If you leave the zone, mark yourself as 'Offline' so we don't search for you." },
        { label: "No Freelancing", content: "Only act on assigned tickets. Do not self-deploy to random locations; you may block access routes for heavy machinery." },
        { label: "Privacy is Absolute", content: "Do not take or share photos of victims on social media. Use the in-app camera only for reporting damage to the Command Center." }
      ]
    },
    {
      icon: HardHat,
      title: "Role-Specific Instructions",
      color: "orange",
      items: [
        { label: "Drone Pilots", content: "Fly at 40-60 meters altitude to avoid helicopters. Prioritize thermal scanning for body heat over general video feeds. Return to home point at 25% battery." },
        { label: "Heavy Machinery", content: "Prioritize clearing the main access road (Artery 1) before clearing individual debris. Wait for 'All Clear' from ground spotters before digging." },
        { label: "Medical/Trauma", content: "Triage only. Stabilize and tag victims for transport. Do not attempt long-term treatment on-site; move green/yellow tags to the nearest collection point." },
        { label: "Ham Radio", content: "Maintain silence on Emergency Channel 1. Only transmit situation reports (SITREPs) every 15 minutes or during immediate life-threats." }
      ]
    },
    {
      icon: Network,
      title: "Logistics & Mesh Handover",
      color: "blue",
      items: [
        { label: "Mesh Nodes", content: "Deploy 'Guardian Beacon' nodes every 200 meters in dead zones. Ensure clear line-of-sight between nodes for maximum throughput." },
        { label: "Battery Swap", content: "Mobile units must return to Zone 4 Command for battery swaps if SOC falls below 15%. Do not exhaust batteries completely." },
        { label: "Supply Drops", content: "Mark air-drop zones with 'H' (Helicopter) or 'D' (Drone) using lime powder or high-vis fabric. Secure the perimeter before drop." }
      ]
    },
    {
      icon: Users2,
      title: "Mental Health & Support",
      color: "purple",
      items: [
        { label: "Peer Support", content: "Watch for signs of acute stress in team members (confusion, paralysis). Mandate 15-minute 'Grounding Breaks' every 4 hours." },
        { label: "Victim Dignity", content: "Always use white shrouds for recovery. Shield recovery operations from public view and media cameras using privacy screens." },
        { label: "Language", content: "In Kerala zones, ensure at least one Malayalam speaker is present in every strike team to facilitate communication with locals." }
      ]
    },
    {
      icon: Dog,
      title: "Livestock & Environment",
      color: "green",
      items: [
        { label: "Animal Rescue", content: "Report trapped livestock to the Veterinary Response Unit. Do not attempt to move large animals (cattle) without specialized harnesses." },
        { label: "Water Pollution", content: "Monitor for changes in river color (grey/oily). Upstream landslide damming is a critical threat; report unusual water level drops." },
        { label: "K-PUP Units", content: "K9 search teams have right-of-way. Maintain absolute silence and keep 10-meter distance when sniffer dogs are actively 'scenting'." }
      ]
    },
    {
      icon: AlertOctagon,
      title: "Emergency & Recovery",
      color: "red",
      items: [
        { label: "Loss of Comms", content: "If internet/cellular fails, switch to Bluetooth Mesh Mode on the app or physically report to the nearest Green Zone Assembly Point." },
        { label: "Secondary Slides", content: "If ground tremors or 'cracking' sounds are heard, initiate immediate 2-minute whistle blast. All personnel must move to high ground immediately." },
        { label: "HazMat Alert", content: "If JCBs or vehicles leak fuel/hydraulic fluid near water sources, use immediate sand barriers. Report fuel spills to the Logistics Unit." },
        { label: "SAR Signals", content: "1 Whistle Blast: Stop/Look; 2 Blasts: Move/Go; 3 Blasts: EMERGENCY/HELP. At night, use 3 flashes of light to indicate distress." },
        { label: "Water Safety", content: "Do not consume local water. Use only sealed containers or water from the Zone 3 Purification Node. Contaminated water is a risk for leptospirosis." },
        { label: "MCI Triage", content: "Red: Immediate life-threat; Yellow: Delayed (stable); Green: Minor; Black: Deceased. Tag clearly and notify the Medical Dispatcher." }
      ]
    }
  ];

  return (
    <section id="protocols" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Info className="w-3 h-3" />
              Operational protocols
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4 uppercase">
              Field <span className="text-primary">Manual</span>
            </h2>
            <p className="text-foreground/60 leading-relaxed">
              Standard operating procedures for all GuardianNet units. Failure to follow these 
              protocols compromises mission safety and grid integrity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {protocols.map((section, idx) => (
            <InstructionSection key={idx} {...section} />
          ))}
        </div>
      </div>
    </section>
  );
};
