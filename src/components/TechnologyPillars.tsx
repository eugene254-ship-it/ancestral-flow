import { motion } from "framer-motion";
import PillarCard from "./PillarCard";
import { Brain, Radio, Users, Leaf } from "lucide-react";

const pillars = [
  {
    icon: <Brain className="w-7 h-7 text-primary-foreground" />,
    acronym: "B-DOS",
    title: "Behavior-Aware Driver OS",
    description: "Embedded in every PSV, combining advanced monitoring with gamified responsibility systems.",
    features: [
      "Facial microexpression cameras",
      "Biofeedback wristbands",
      "Gamified trip scoring",
    ],
  },
  {
    icon: <Radio className="w-7 h-7 text-primary-foreground" />,
    acronym: "AG-RIL",
    title: "Ancestral-Grid Road Intelligence",
    description: "Smart roads that listen and respond, synced with natural rhythms and movements.",
    features: [
      "Embedded vibration sensors",
      "Solar-geo signal nodes",
      "Wildlife movement alerts",
    ],
  },
  {
    icon: <Users className="w-7 h-7 text-primary-foreground" />,
    acronym: "PAN-AI",
    title: "Participatory AI Governance",
    description: "Decentralized AI councils co-trained by communities, ecology, and traffic data.",
    features: [
      "Voice-to-data consent",
      "Multi-dialect interpretation",
      "Citizen data boards",
    ],
  },
  {
    icon: <Leaf className="w-7 h-7 text-primary-foreground" />,
    acronym: "ETSH",
    title: "Eco-Temporal Speed Harmonization",
    description: "Time is lived rhythmically. Speed limits shift with nature's calendar.",
    features: [
      "Animal migration sync",
      "Cultural calendar alignment",
      "Drum-beat notifications",
    ],
  },
];

const TechnologyPillars = () => {
  return (
    <section className="py-24 px-6 relative">
      {/* Background elements */}
      <div className="absolute inset-0 pattern-adinkra opacity-20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest mb-4 block">
            CORE TECHNOLOGY
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Four Pillars of <span className="text-gradient-earth">Wisdom</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ATLAS does not manage traffic — it cultivates movement that respects the land, the people, and the moment.
          </p>
        </motion.div>
        
        {/* Pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <PillarCard key={pillar.acronym} {...pillar} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologyPillars;
